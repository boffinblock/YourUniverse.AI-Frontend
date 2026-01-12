/**
 * useGetLorebook Hook
 * Custom hook for fetching a single lorebook with TanStack Query
 */
"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getLorebook } from "@/lib/api/lorebooks";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { GetLorebookResponse } from "@/lib/api/lorebooks";
import type { ApiError } from "@/lib/api/shared/types";

/**
 * Options for fetching a lorebook
 */
interface UseGetLorebookOptions {
  /**
   * Whether to require authentication (default: false)
   */
  requireAuth?: boolean;

  /**
   * Whether to enable the query (default: true)
   */
  enabled?: boolean;

  /**
   * Stale time in milliseconds (default: 5 minutes)
   */
  staleTime?: number;

  /**
   * Cache time in milliseconds (default: 10 minutes)
   */
  cacheTime?: number;

  /**
   * Whether to refetch on window focus (default: true)
   */
  refetchOnWindowFocus?: boolean;

  /**
   * Whether to refetch on mount (default: true)
   */
  refetchOnMount?: boolean;

  /**
   * Retry configuration
   */
  retry?: boolean | number | ((failureCount: number, error: ApiError) => boolean);

  /**
   * Callback fired on successful fetch
   */
  onSuccess?: (data: GetLorebookResponse) => void;

  /**
   * Callback fired on fetch error
   */
  onError?: (error: ApiError) => void;

  /**
   * Whether to show error toast notifications (default: false)
   */
  showErrorToast?: boolean;
}

/**
 * Custom hook for fetching a single lorebook
 * @param lorebookId - Lorebook UUID
 * @param options - Configuration options for the query
 * @returns Query object with lorebook data, loading state, and error state
 */
export const useGetLorebook = (
  lorebookId: string | undefined,
  options: UseGetLorebookOptions = {}
) => {
  const {
    requireAuth = false,
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus = true,
    refetchOnMount = true,
    retry = (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        return false;
      }
      return failureCount < 3;
    },
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
    showErrorToast = false,
  } = options;

  const query = useQuery({
    queryKey: queryKeys.lorebooks.detail(lorebookId || ""),
    queryFn: async () => {
      if (!lorebookId) {
        throw new Error("Lorebook ID is required");
      }
      const response = await getLorebook(lorebookId, { requireAuth });
      return response.data;
    },
    enabled: enabled && !!lorebookId,
    staleTime,
    gcTime: cacheTime,
    refetchOnWindowFocus,
    refetchOnMount,
    retry,
    onSuccess: onSuccessCallback,
    onError: (error: ApiError) => {
      if (onErrorCallback) {
        onErrorCallback(error);
      }

      if (showErrorToast) {
        const errorMessage =
          error.message ||
          error.error ||
          "Failed to load lorebook. Please try again.";

        toast.error("Failed to Load Lorebook", {
          description: errorMessage,
          duration: 5000,
        });
      }
    },
  });

  return {
    /**
     * Lorebook data
     */
    lorebook: query.data?.lorebook,

    /**
     * Full response data
     */
    data: query.data,

    /**
     * Query status
     */
    status: query.status,

    /**
     * Whether query is currently fetching
     */
    isLoading: query.isLoading,

    /**
     * Whether query is currently refetching
     */
    isRefetching: query.isRefetching,

    /**
     * Whether query completed successfully
     */
    isSuccess: query.isSuccess,

    /**
     * Whether query failed
     */
    isError: query.isError,

    /**
     * Error object
     */
    error: query.error as ApiError | null,

    /**
     * Manually refetch the lorebook
     */
    refetch: query.refetch,
  };
};
