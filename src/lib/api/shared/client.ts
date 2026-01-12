/**
 * API Client
 * Centralized HTTP client with error handling, interceptors, and retry logic
 * Includes automatic token refresh on 401 errors
 */
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { ApiError } from "./types";
import { tokenRefreshManager } from "@/lib/utils/token-refresh-manager";
import { getAccessToken } from "@/lib/utils/token-storage";

/**
 * Extend InternalAxiosRequestConfig to include retry flag
 */
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

/**
 * Get the base API URL from environment variables
 * Falls back to a default if not set
 * Supports ngrok URLs for development
 */
const getBaseURL = (): string => {
  // Check for Next.js environment variable (NEXT_PUBLIC_* variables are exposed to browser)
  if (typeof window !== "undefined") {
    // Browser environment - use NEXT_PUBLIC_API_URL or fallback
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return apiUrl;
  }

  // Server-side environment
  return process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:8000";
};

/**
 * Create axios instance with default configuration
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: getBaseURL(),
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // Important for CORS with credentials
  });

  /**
   * Request interceptor
   * Adds common headers, authentication tokens, and handles request transformation
   */
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Skip Authorization header for refresh endpoint (doesn't require auth)
      const isRefreshEndpoint = config.url?.includes("/api/v1/auth/refresh");

      // Handle FormData - axios will automatically set Content-Type with boundary
      if (config.data instanceof FormData) {
        // Delete Content-Type to let axios set it automatically with boundary
        delete config.headers["Content-Type"];
      }

      // Add access token if available and not already set (and not refresh endpoint)
      if (typeof window !== "undefined" && !config.headers.Authorization && !isRefreshEndpoint) {
        const accessToken = getAccessToken();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }

      // Add idempotency key for POST/PUT/PATCH requests if not present
      if (["post", "put", "patch"].includes(config.method?.toLowerCase() || "") && !config.headers["Idempotency-Key"]) {
        const uuid = typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        config.headers["Idempotency-Key"] = uuid;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  /**
   * Response interceptor
   * Handles error transformation, token refresh on 401, and automatic retry
   */
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig;

      // Handle 401 Unauthorized - attempt token refresh and retry
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        try {
          // Use token refresh manager to handle refresh and queue
          const retryConfig = await tokenRefreshManager.handle401Error(
            error,
            originalRequest
          );

          // Retry the original request with new token
          return client.request(retryConfig);
        } catch (refreshError) {
          // Refresh failed - transform and reject the error
          const refreshApiError: ApiError = {
            success: false,
            error: (refreshError as ApiError).error || "Token refresh failed",
            message: (refreshError as ApiError).message || "Unable to refresh authentication token",
            statusCode: (refreshError as ApiError).statusCode || 401,
          };

          return Promise.reject(refreshApiError);
        }
      }

      // Transform other errors
      const apiError: ApiError = {
        success: false,
        error: error.message || "An unexpected error occurred",
        statusCode: error.response?.status,
      };

      // Handle different error scenarios
      if (error.response) {
        const data = error.response.data as {
          message?: string | { code?: number; message?: string };
          error?: string | { code?: number; message?: string };
        };

        // Safely extract message as string
        let messageStr: string | undefined;
        if (typeof data.message === "string") {
          messageStr = data.message;
        } else if (
          data.message &&
          typeof data.message === "object" &&
          "message" in data.message &&
          typeof data.message.message === "string"
        ) {
          messageStr = data.message.message;
        }

        // Safely extract error as string
        let errorStr: string | undefined;
        if (typeof data.error === "string") {
          errorStr = data.error;
        } else if (
          data.error &&
          typeof data.error === "object" &&
          "message" in data.error &&
          typeof data.error.message === "string"
        ) {
          errorStr = data.error.message;
        }

        apiError.message = messageStr || errorStr || error.message;
        apiError.error = errorStr || messageStr || error.message;
      } else if (error.request) {
        apiError.error = "Network error. Please check your connection.";
        apiError.message = "Unable to reach the server. Please try again later.";
      } else {
        apiError.error = error.message || "Request configuration error";
      }

      return Promise.reject(apiError);
    }
  );

  return client;
};

/**
 * Export singleton API client instance
 */
export const apiClient = createApiClient();

/**
 * Helper function to generate idempotency key
 */

export const generateIdempotencyKey = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;
};

