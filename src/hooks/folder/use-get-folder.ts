/**
 * useGetFolder Hook
 * Fetches a single folder by ID with TanStack Query
 */
"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getFolder } from "@/lib/api/folders";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { GetFolderResponse } from "@/lib/api/folders";
import type { ApiError } from "@/lib/api/shared/types";

interface UseGetFolderOptions {
  folderId: string | null | undefined;
  enabled?: boolean;
  staleTime?: number;
  showErrorToast?: boolean;
  onSuccess?: (data: GetFolderResponse) => void;
  onError?: (error: ApiError) => void;
}

export const useGetFolder = (options: UseGetFolderOptions) => {
  const {
    folderId,
    enabled = true,
    staleTime = 2 * 60 * 1000,
    showErrorToast = false,
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
  } = options;

  const queryClient = useQueryClient();
  const queryKey = queryKeys.folders.detail(folderId ?? "");

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (!folderId) throw new Error("Folder ID is required");
      const response = await getFolder(folderId);
      return response.data;
    },
    enabled: Boolean(enabled && folderId),
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
        toast.error("Failed to load folder", {
          description: error.message || error.error || "Please try again.",
          duration: 5000,
        });
      }
    }
  }, [query.isError, query.error, onErrorCallback, showErrorToast]);

  return {
    folder: query.data?.folder ?? null,
    data: query.data,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    isError: query.isError,
    error: query.error as unknown as ApiError | null,
    refetch: () => query.refetch(),
    invalidate: () => queryClient.invalidateQueries({ queryKey: queryKeys.folders.all }),
  };
};
