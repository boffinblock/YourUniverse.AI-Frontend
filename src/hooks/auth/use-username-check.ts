/**
 * useUsernameCheck Hook
 * Custom hook for checking username availability with TanStack Query
 * Optimized for real-time validation with debouncing support
 */
"use client";

import { useQuery } from "@tanstack/react-query";
import { checkUsernameAvailability } from "@/lib/api/auth";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { UsernameCheckResponse } from "@/lib/api/auth";
import type { ApiError } from "@/lib/api/shared/types";

interface UseUsernameCheckOptions {
  username: string;
  enabled?: boolean;
  onSuccess?: (data: UsernameCheckResponse) => void;
  onError?: (error: ApiError) => void;
}

/**
 * Custom hook for checking username availability
 * Uses TanStack Query with caching for performance
 * @param options - Configuration options
 */
export const useUsernameCheck = (options: UseUsernameCheckOptions) => {
  const {
    username,
    enabled = true,
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
  } = options;

  const query = useQuery({
    queryKey: queryKeys.auth.usernameCheck(username),
    queryFn: async () => {
      const response = await checkUsernameAvailability(username);
      return response.data;
    },
    enabled: enabled && username.length >= 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
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
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ? (query.error as unknown as ApiError) : null,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};

