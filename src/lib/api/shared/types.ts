/**
 * Shared API Types
 * Common types used across all API modules
 */

/**
 * Base API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

/**
 * Error response structure
 */
export interface ApiError {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
}

