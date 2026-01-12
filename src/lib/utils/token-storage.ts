/**
 * Token Storage Utilities
 * Centralized token management for authentication
 */

const TOKEN_STORAGE_KEY = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
} as const;

/**
 * Get access token from storage
 */
export const getAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_STORAGE_KEY.ACCESS_TOKEN);
  }
  return null;
};

/**
 * Get refresh token from storage
 */
export const getRefreshToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_STORAGE_KEY.REFRESH_TOKEN);
  }
  return null;
};

/**
 * Store tokens in localStorage
 */
export const storeTokens = (tokens: { accessToken: string; refreshToken: string }): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_STORAGE_KEY.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(TOKEN_STORAGE_KEY.REFRESH_TOKEN, tokens.refreshToken);
  }
};

/**
 * Clear all tokens from storage
 */
export const clearTokens = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_STORAGE_KEY.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_STORAGE_KEY.REFRESH_TOKEN);
  }
};

/**
 * Check if user is authenticated (has access token)
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

