/**
 * useListLorebooks Hook
 * Custom hook for fetching a list of lorebooks with TanStack Query
 * Fully optimized with caching, filtering, and pagination
 */
"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listLorebooks } from "@/lib/api/lorebooks";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { ListLorebooksResponse } from "@/lib/api/lorebooks";
import type { ApiError } from "@/lib/api/shared/types";

/**
 * Filters for listing lorebooks
 */
export interface LorebookListFilters {
  /**
   * Page number for pagination (default: 1)
   */
  page?: number;

  /**
   * Number of items per page (default: 20, max: 100)
   */
  limit?: number;

  /**
   * Search in name/description
   */
  search?: string;

  /**
   * Filter by rating
   */
  rating?: "SFW" | "NSFW";

  /**
   * Filter by visibility (only applies when authenticated)
   */
  visibility?: "public" | "private";

  /**
   * Filter favourites (only applies when authenticated)
   */
  isFavourite?: boolean;

  /**
   * Filter saved (only applies when authenticated)
   */
  isSaved?: boolean;

  /**
   * Filter by tags (include tags - lorebooks must have all these tags)
   */
  tags?: string[];

  /**
   * Filter by tags to exclude (lorebooks must not have any of these tags)
   */
  excludeTags?: string[];

  /**
   * Sort field (default: "createdAt")
   */
  sortBy?: "createdAt" | "updatedAt" | "name";

  /**
   * Sort order (default: "desc")
   */
  sortOrder?: "asc" | "desc";
}

/**
 * Options for listing lorebooks
 */
interface UseListLorebooksOptions {
  /**
   * Filters for the lorebook list
   */
  filters?: LorebookListFilters;

  /**
   * Whether to enable the query (default: true)
   */
  enabled?: boolean;

  /**
   * Stale time in milliseconds (default: 2 minutes)
   */
  staleTime?: number;

  /**
   * Cache time in milliseconds (default: 5 minutes)
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
  onSuccess?: (data: ListLorebooksResponse) => void;

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
 * Custom hook for fetching a list of lorebooks
 * Fully optimized with intelligent caching and filtering
 * 
 * @param options - Configuration options for the query
 * @returns Query object with lorebooks data, loading state, and error state
 * 
 * @example
 * ```tsx
 * const { lorebooks, isLoading } = useListLorebooks({
 *   filters: { visibility: "public", rating: "SFW" },
 *   staleTime: 2 * 60 * 1000,
 * });
 * ```
 */
export const useListLorebooks = (options: UseListLorebooksOptions = {}) => {
  const {
    filters = {},
    enabled = true,
    staleTime = 2 * 60 * 1000, // 2 minutes - lists change more frequently
    cacheTime = 5 * 60 * 1000, // 5 minutes
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
   * Query key for this lorebook list
   * Includes filters for proper cache management
   */
  const queryKey = queryKeys.lorebooks.list(filters as Record<string, unknown>);

  /**
   * Lorebooks list query
   */
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await listLorebooks(filters);
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
          "Failed to load lorebooks. Please try again.";

        toast.error("Failed to Load Lorebooks", {
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
    queryClient.invalidateQueries({ queryKey: queryKeys.lorebooks.lists() });
  };

  /**
   * Refetch function
   */
  const refetch = () => {
    return query.refetch();
  };

  return {
    /**
     * Lorebooks array
     */
    lorebooks: query.data?.lorebooks || [],

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
     * Manually refetch the lorebooks list
     */
    refetch,

    /**
     * Invalidate the lorebooks list cache
     */
    invalidate,
  };
};
