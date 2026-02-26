/**
 * useListBackgrounds Hook
 * Custom hook for fetching a list of backgrounds with TanStack Query
 */
"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listBackgrounds } from "@/lib/api/backgrounds";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { ListBackgroundsFilters } from "@/lib/api/backgrounds";
import type { ApiError } from "@/lib/api/shared/types";

interface UseListBackgroundsOptions {
  filters?: ListBackgroundsFilters;
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  showErrorToast?: boolean;
}

export const useListBackgrounds = (options: UseListBackgroundsOptions = {}) => {
  const {
    filters = {},
    enabled = true,
    staleTime = 2 * 60 * 1000,
    cacheTime = 5 * 60 * 1000,
    showErrorToast = false,
  } = options;

  const queryClient = useQueryClient();
  const queryKey = queryKeys.backgrounds.list(filters as Record<string, unknown>);

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await listBackgrounds(filters);
      return response.data;
    },
    enabled,
    staleTime,
    gcTime: cacheTime,
    retry: (failureCount, error) => {
      const apiError = error as ApiError;
      if (apiError.statusCode && apiError.statusCode >= 400 && apiError.statusCode < 500) {
        return false;
      }
      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (query.isError && query.error && showErrorToast) {
      const error = query.error as ApiError;
      toast.error("Failed to Load Backgrounds", {
        description: error.message || error.error || "Please try again.",
        duration: 5000,
      });
    }
  }, [query.isError, query.error, showErrorToast]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.backgrounds.lists() });
  };

  return {
    backgrounds: query.data?.backgrounds ?? [],
    data: query.data,
    pagination: query.data?.pagination,
    total: query.data?.pagination?.total,
    totalPages: query.data?.pagination?.totalPages ?? 1,
    page: query.data?.pagination?.page ?? 1,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as ApiError | null,
    refetch: query.refetch,
    invalidate,
  };
};
