/**
 * useCurrentUser Hook
 * Custom hook for fetching current user profile with TanStack Query
 * Handles authentication and automatic token refresh
 */
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/api/user";
import { queryKeys } from "@/lib/api/shared/query-keys";
import { getAccessToken } from "@/lib/utils/token-storage";
import type { GetCurrentUserResponse } from "@/lib/api/user";
import type { ApiError } from "@/lib/api/shared/types";

interface UseCurrentUserOptions {
  enabled?: boolean;
  onSuccess?: (data: GetCurrentUserResponse) => void;
  onError?: (error: ApiError) => void;
  retry?: boolean;
}

/**
 * Custom hook for fetching current user profile
 * Token refresh is now handled automatically by the API client interceptor
 */
export const useCurrentUser = (options: UseCurrentUserOptions = {}) => {
  const {
    enabled = true,
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
    retry = true,
  } = options;

  const queryClient = useQueryClient();
  const accessToken = getAccessToken();

  const query = useQuery({
    queryKey: queryKeys.user.current(),
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("No access token available");
      }

      // API client interceptor will automatically handle token refresh on 401
      const response = await getCurrentUser(accessToken);
      return response.data;
    },
    enabled: enabled && !!accessToken,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: (failureCount, error) => {
      const apiError = error as unknown as ApiError;
      
      // Don't retry on auth errors - interceptor handles refresh
      if (apiError?.statusCode === 401 || apiError?.statusCode === 403) {
        return false;
      }
      
      // Retry other errors up to 2 times if retry is enabled
      return retry && failureCount < 2;
    },
    retryDelay: 1000,
  });

  // Execute callbacks
  if (query.data && onSuccessCallback) {
    onSuccessCallback(query.data);
  }

  if (query.error && onErrorCallback) {
    onErrorCallback(query.error as unknown as ApiError);
  }

  return {
    user: query.data?.user,
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ? (query.error as unknown as ApiError) : null,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};

