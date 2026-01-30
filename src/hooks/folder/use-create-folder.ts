/**
 * useCreateFolder Hook
 * Creates a folder with TanStack Query
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createFolder } from "@/lib/api/folders";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { CreateFolderRequest, CreateFolderResponse } from "@/lib/api/folders";
import type { ApiError } from "@/lib/api/shared/types";

interface UseCreateFolderOptions {
  onSuccess?: (data: CreateFolderResponse) => void;
  onError?: (error: ApiError) => void;
  showToasts?: boolean;
}

export const useCreateFolder = (options: UseCreateFolderOptions = {}) => {
  const { onSuccess: onSuccessCallback, onError: onErrorCallback, showToasts = true } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreateFolderRequest) => {
      const response = await createFolder(data);
      return response.data;
    },
    retry: (failureCount, error) => {
      if ((error as ApiError).statusCode && (error as ApiError).statusCode! >= 400 && (error as ApiError).statusCode! < 500) {
        return false;
      }
      return failureCount < 3;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.folders.all });
      if (data.folder) {
        queryClient.setQueryData(queryKeys.folders.detail(data.folder.id), { folder: data.folder });
      }
      if (showToasts) {
        toast.success("Folder created", {
          description: `"${data.folder?.name}" has been created.`,
          duration: 3000,
        });
      }
      onSuccessCallback?.(data);
    },
    onError: (error: ApiError) => {
      const msg = error.message || error.error || "Failed to create folder.";
      if (showToasts) toast.error("Create folder failed", { description: msg, duration: 5000 });
      onErrorCallback?.(error);
    },
  });

  return {
    createFolder: mutation.mutate,
    createFolderAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error as ApiError | null,
    reset: mutation.reset,
  };
};
