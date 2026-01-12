/**
 * useListTags Hook
 * Custom hook for fetching a list of tags with TanStack Query
 * Fully optimized with caching, filtering, and pagination
 */
"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listTags } from "@/lib/api/tags";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { ListTagsResponse } from "@/lib/api/tags";
import type { ApiError } from "@/lib/api/shared/types";

/**
 * Filters for listing tags
 */
export interface TagListFilters {
  /**
   * Page number for pagination (default: 1)
   */
  page?: number;

  /**
   * Number of items per page (default: 20, max: 100)
   */
  limit?: number;

  /**
   * Search tags by name
   */
  search?: string;

  /**
   * Filter by category
   */
  category?: "SFW" | "NSFW";

  /**
   * Sort field (default: "name")
   */
  sortBy?: "name" | "usageCount" | "createdAt";

  /**
   * Sort order (default: "asc")
   */
  sortOrder?: "asc" | "desc";
}

/**
 * Options for listing tags
 */
interface UseListTagsOptions {
  /**
   * Filters for the tag list
   */
  filters?: TagListFilters;

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
  onSuccess?: (data: ListTagsResponse) => void;

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
 * Custom hook for fetching a list of tags
 * Fully optimized with intelligent caching and filtering
 * 
 * @param options - Configuration options for the query
 * @returns Query object with tags data, loading state, and error state
 * 
 * @example
 * ```tsx
 * const { tags, isLoading } = useListTags({
 *   filters: { category: "SFW", search: "fantasy" },
 *   staleTime: 5 * 60 * 1000,
 * });
 * ```
 */
export const useListTags = (options: UseListTagsOptions = {}) => {
  const {
    filters = {},
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes - tags don't change frequently
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
   * Query key for this tag list
   * Includes filters for proper cache management
   */
  const queryKey = queryKeys.tags.list(filters as Record<string, unknown>);

  /**
   * Tags list query
   */
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await listTags(filters);
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
          "Failed to load tags. Please try again.";

        toast.error("Failed to Load Tags", {
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
    queryClient.invalidateQueries({ queryKey: queryKeys.tags.lists() });
  };

  /**
   * Refetch function
   */
  const refetch = () => {
    return query.refetch();
  };

  return {
    /**
     * Tags array
     */
    tags: query.data?.tags || [],

    /**
     * Full response data
     */
    data: query.data,

    /**
     * Pagination info
     */
    pagination: query.data?.pagination,

    /**
     * Total count (convenience accessor)
     */
    total: query.data?.pagination?.total,

    /**
     * Current page (convenience accessor)
     */
    page: query.data?.pagination?.page,

    /**
     * Total pages (convenience accessor)
     */
    totalPages: query.data?.pagination?.totalPages,

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
     * Manually refetch the tags list
     */
    refetch,

    /**
     * Invalidate the tags list cache
     */
    invalidate,
  };
};

