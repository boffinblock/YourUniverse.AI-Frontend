/**
 * usePopularTags Hook
 * Custom hook for fetching popular tags with TanStack Query
 */
"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getPopularTags } from "@/lib/api/tags";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { PopularTagsResponse } from "@/lib/api/tags";
import type { ApiError } from "@/lib/api/shared/types";

/**
 * Options for fetching popular tags
 */
interface UsePopularTagsOptions {
  /**
   * Limit number of tags (default: 10, max: 100)
   */
  limit?: number;

  /**
   * Filter by category
   */
  category?: "SFW" | "NSFW";

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
  onSuccess?: (data: PopularTagsResponse) => void;

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
 * Custom hook for fetching popular tags
 * 
 * @param options - Configuration options for the query
 * @returns Query object with popular tags data, loading state, and error state
 * 
 * @example
 * ```tsx
 * const { tags, isLoading } = usePopularTags({
 *   limit: 20,
 *   category: "SFW",
 * });
 * ```
 */
export const usePopularTags = (options: UsePopularTagsOptions = {}) => {
  const {
    limit = 10,
    category,
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

  const queryClient = useQueryClient();

  /**
   * Query key for popular tags
   */
  const queryKey = queryKeys.tags.popular(category);

  /**
   * Popular tags query
   */
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await getPopularTags({ limit, category });
      return response.data;
    },
    enabled,
    staleTime,
    gcTime: cacheTime,
    refetchOnWindowFocus,
    refetchOnMount,
    retry,
  });

  /**
   * Handle success callback
   */
  useEffect(() => {
    if (query.isSuccess && query.data && onSuccessCallback) {
      onSuccessCallback(query.data);
    }
  }, [query.isSuccess, query.data, onSuccessCallback]);

  /**
   * Handle error callback and toast notifications
   */
  useEffect(() => {
    if (query.isError && query.error) {
      const error = query.error as ApiError;

      if (onErrorCallback) {
        onErrorCallback(error);
      }

      if (showErrorToast) {
        const errorMessage =
          error.message ||
          error.error ||
          "Failed to load popular tags. Please try again.";

        toast.error("Failed to Load Popular Tags", {
          description: errorMessage,
          duration: 5000,
        });
      }
    }
  }, [query.isError, query.error, onErrorCallback, showErrorToast]);

  /**
   * Invalidate function
   */
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.tags.popular(category) });
  };

  /**
   * Refetch function
   */
  const refetch = () => {
    return query.refetch();
  };

  return {
    /**
     * Popular tags array
     */
    tags: query.data?.tags || [],

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
     * Manually refetch the popular tags
     */
    refetch,

    /**
     * Invalidate the popular tags cache
     */
    invalidate,
  };
};

