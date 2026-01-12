/**
 * Token Refresh Manager
 * Centralized token refresh mechanism with queue and lock to prevent
 * multiple simultaneous refresh requests
 * 
 * This manager ensures:
 * - Only one refresh request runs at a time
 * - Failed requests are queued and retried after refresh
 * - Proper cleanup on refresh failure
 * - Thread-safe operations
 */

import { AxiosError, InternalAxiosRequestConfig } from "axios";
import { refreshToken } from "@/lib/api/auth";
import { getRefreshToken, storeTokens, clearTokens } from "./token-storage";
import type { ApiError } from "@/lib/api/shared/types";

/**
 * Pending request queue item
 */
interface PendingRequest {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: InternalAxiosRequestConfig;
}

/**
 * Token Refresh Manager Class
 * Singleton pattern for centralized token refresh management
 */
class TokenRefreshManager {
  private refreshPromise: Promise<string> | null = null;
  private isRefreshing = false;
  private pendingRequests: PendingRequest[] = [];
  private failedRefreshCount = 0;
  private readonly MAX_FAILED_REFRESH_ATTEMPTS = 1;

  /**
   * Check if a refresh is currently in progress
   */
  private isRefreshInProgress(): boolean {
    return this.isRefreshing && this.refreshPromise !== null;
  }

  /**
   * Execute token refresh
   * Only one refresh can run at a time
   * 
   * Token Rotation: The old refresh token becomes invalid immediately.
   * The new refresh token from the response is stored and used for subsequent refreshes.
   */
  private async executeRefresh(): Promise<string> {
    // If already refreshing, return existing promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Check if refresh token exists
    const refreshTokenValue = getRefreshToken();
    if (!refreshTokenValue) {
      throw new Error("No refresh token available");
    }

    // Mark as refreshing
    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        // Call refresh token API
        // Note: Old refresh token becomes invalid immediately after this call (token rotation)
        const response = await refreshToken({
          refreshToken: refreshTokenValue,
        });

        // Store new tokens (token rotation - old refresh token is now invalid)
        const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;
        storeTokens({
          accessToken,
          refreshToken: newRefreshToken, // New refresh token replaces old one
        });

        // Reset failed count on success
        this.failedRefreshCount = 0;

        // Resolve all pending requests
        this.processPendingRequests(accessToken);

        return accessToken;
      } catch (error) {
        // Handle refresh failure
        const apiError = error as unknown as ApiError;
        
        // Increment failed count
        this.failedRefreshCount++;

        // If refresh token is expired or invalid, clear auth state
        if (
          apiError.statusCode === 401 ||
          apiError.statusCode === 403 ||
          this.failedRefreshCount >= this.MAX_FAILED_REFRESH_ATTEMPTS
        ) {
          // Clear tokens and auth state
          clearTokens();

          // Reject all pending requests
          this.rejectPendingRequests(
            apiError || new Error("Token refresh failed")
          );

          // Trigger logout callback if available
          if (typeof window !== "undefined") {
            // Dispatch custom event for logout handling
            window.dispatchEvent(new CustomEvent("auth:token-expired"));
          }
        }

        throw error;
      } finally {
        // Reset refresh state
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Process all pending requests with new access token
   */
  private processPendingRequests(accessToken: string): void {
    const requests = [...this.pendingRequests];
    this.pendingRequests = [];

    requests.forEach(({ resolve, config }) => {
      // Update request config with new token
      if (config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      // Resolve with updated config
      resolve(config);
    });
  }

  /**
   * Reject all pending requests
   */
  private rejectPendingRequests(error: Error | ApiError): void {
    const requests = [...this.pendingRequests];
    this.pendingRequests = [];

    requests.forEach(({ reject }) => {
      reject(error);
    });
  }

  /**
   * Handle 401 error by refreshing token and retrying request
   * 
   * @param error - The axios error with 401 status
   * @param originalRequest - The original request config
   * @returns Promise that resolves with retried request config or rejects with error
   */
  async handle401Error(
    error: AxiosError,
    originalRequest: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> {
    // Skip refresh for auth endpoints (login, register, refresh, etc.)
    if (this.isAuthEndpoint(originalRequest.url || "")) {
      return Promise.reject(error);
    }

    // If refresh is already in progress, queue this request
    if (this.isRefreshInProgress()) {
      return new Promise<InternalAxiosRequestConfig>((resolve, reject) => {
        this.pendingRequests.push({
          resolve,
          reject,
          config: originalRequest,
        });
      });
    }

    // Start refresh process
    try {
      const newAccessToken = await this.executeRefresh();

      // Update original request with new token
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      // Mark request as retried to prevent infinite loops
      originalRequest._retry = true;

      return originalRequest;
    } catch (refreshError) {
      // Refresh failed, reject the request
      return Promise.reject(refreshError);
    }
  }

  /**
   * Check if URL is an authentication endpoint that shouldn't trigger refresh
   */
  private isAuthEndpoint(url: string): boolean {
    const authEndpoints = [
      "/api/v1/auth/login",
      "/api/v1/auth/register",
      "/api/v1/auth/refresh",
      "/api/v1/auth/logout",
      "/api/v1/auth/forgot-password",
      "/api/v1/auth/reset-password",
      "/api/v1/auth/verify",
      "/api/v1/auth/resend-verification",
      "/api/v1/auth/username/check",
    ];

    return authEndpoints.some((endpoint) => url.includes(endpoint));
  }

  /**
   * Reset manager state (useful for testing or logout)
   */
  reset(): void {
    this.refreshPromise = null;
    this.isRefreshing = false;
    this.pendingRequests = [];
    this.failedRefreshCount = 0;
  }

  /**
   * Get current refresh state (for debugging)
   */
  getState() {
    return {
      isRefreshing: this.isRefreshing,
      pendingRequestsCount: this.pendingRequests.length,
      failedRefreshCount: this.failedRefreshCount,
    };
  }
}

/**
 * Export singleton instance
 */
export const tokenRefreshManager = new TokenRefreshManager();

/**
 * Helper to check if request should be retried
 */
export const shouldRetryRequest = (config: InternalAxiosRequestConfig): boolean => {
  // Don't retry if already retried
  if (config._retry) {
    return false;
  }

  // Don't retry auth endpoints
  const url = config.url || "";
  const authEndpoints = [
    "/api/v1/auth/login",
    "/api/v1/auth/register",
    "/api/v1/auth/refresh",
  ];

  return !authEndpoints.some((endpoint) => url.includes(endpoint));
};

