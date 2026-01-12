/**
 * useRefreshToken Hook
 * Custom hook for refreshing access tokens with TanStack Query
 * Handles token rotation and automatic token updates
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { refreshToken } from "@/lib/api/auth";
import { queryKeys } from "@/lib/api/shared/query-keys";
import { storeTokens, getRefreshToken, clearTokens } from "@/lib/utils/token-storage";
import type { RefreshTokenRequest, RefreshTokenResponse } from "@/lib/api/auth";
import type { ApiError } from "@/lib/api/shared/types";

interface UseRefreshTokenOptions {
  onSuccess?: (data: RefreshTokenResponse) => void;
  onError?: (error: ApiError) => void;
  onTokenExpired?: () => void;
}

export const useRefreshToken = (options: UseRefreshTokenOptions = {}) => {
  const {
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
    onTokenExpired,
  } = options;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (refreshTokenValue?: string) => {
      const token = refreshTokenValue || getRefreshToken();
      if (!token) {
        throw new Error("No refresh token available");
      }
      return await refreshToken({ refreshToken: token });
    },

    retry: false,

    onSuccess: (response) => {
      const { data } = response;

      // Store new tokens
      storeTokens(data.tokens);

      // Invalidate auth queries to refetch with new token
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });

      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },

    onError: (error: ApiError) => {
      // Check if token is expired (401 or 403)
      if (error.statusCode === 401 || error.statusCode === 403) {
        // Clear tokens
        clearTokens();

        // Clear auth cache
        queryClient.removeQueries({ queryKey: queryKeys.auth.all });

        if (onTokenExpired) {
          onTokenExpired();
        }
      }

      if (onErrorCallback) {
        onErrorCallback(error);
      }
    },
  });

  const refresh = (refreshTokenValue?: string) => {
    return mutation.mutate(refreshTokenValue);
  };

  const refreshAsync = (refreshTokenValue?: string) => {
    return mutation.mutateAsync(refreshTokenValue);
  };

  return {
    refresh,
    refreshAsync,
    status: mutation.status,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data?.data,
    error: mutation.error as ApiError | null,
    reset: mutation.reset,
  };
};

