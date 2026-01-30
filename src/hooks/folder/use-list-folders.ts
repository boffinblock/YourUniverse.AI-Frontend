/**
 * useListFolders Hook
 * Fetches user folders with TanStack Query
 */
"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listFolders } from "@/lib/api/folders";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { ListFoldersResponse, ListFoldersParams } from "@/lib/api/folders";
import type { ApiError } from "@/lib/api/shared/types";

export interface FolderListFilters extends ListFoldersParams { }

interface UseListFoldersOptions {
  filters?: FolderListFilters;
  enabled?: boolean;
  staleTime?: number;
  showErrorToast?: boolean;
  onSuccess?: (data: ListFoldersResponse) => void;
  onError?: (error: ApiError) => void;
}

export const useListFolders = (options: UseListFoldersOptions = {}) => {
  const {
    filters = {},
    enabled = true,
    staleTime = 2 * 60 * 1000,
    showErrorToast = false,
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
  } = options;

  const queryClient = useQueryClient();
  const queryKey = queryKeys.folders.list(filters as Record<string, unknown>);

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await listFolders(filters);
      return response.data;
    },
    enabled,
    staleTime,
    gcTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      const apiErr = error as unknown as ApiError;
      if (apiErr?.statusCode != null && apiErr.statusCode >= 400 && apiErr.statusCode < 500) {
        return false;
      }
      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (query.isSuccess && query.data && onSuccessCallback) {
      onSuccessCallback(query.data);
    }
  }, [query.isSuccess, query.data, onSuccessCallback]);

  useEffect(() => {
    if (query.isError && query.error) {
      const error = query.error as unknown as ApiError;
      onErrorCallback?.(error);
      if (showErrorToast) {
        toast.error("Failed to load folders", {
          description: error.message || error.error || "Please try again.",
          duration: 5000,
        });
      }
    }
  }, [query.isError, query.error, onErrorCallback, showErrorToast]);

  return {
    folders: query.data?.folders ?? [],
    data: query.data,
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    isError: query.isError,
    error: query.error as unknown as ApiError | null,
    refetch: () => query.refetch(),
    invalidate: () => queryClient.invalidateQueries({ queryKey: queryKeys.folders.all }),
  };
};
