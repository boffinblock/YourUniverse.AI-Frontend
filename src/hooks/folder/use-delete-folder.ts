/**
 * useDeleteFolder Hook
 * Deletes a folder with TanStack Query
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteFolder } from "@/lib/api/folders";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { ApiError } from "@/lib/api/shared/types";

interface UseDeleteFolderOptions {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
  showToasts?: boolean;
}

export const useDeleteFolder = (options: UseDeleteFolderOptions = {}) => {
  const { onSuccess: onSuccessCallback, onError: onErrorCallback, showToasts = true } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (folderId: string) => {
      await deleteFolder(folderId);
    },
    retry: (failureCount, error) => {
      if ((error as ApiError).statusCode && (error as ApiError).statusCode! >= 400 && (error as ApiError).statusCode! < 500) {
        return false;
      }
      return failureCount < 3;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.folders.all });
      if (showToasts) {
        toast.success("Folder deleted", {
          description: "Folder has been permanently deleted.",
          duration: 5000,
        });
      }
      onSuccessCallback?.();
    },
    onError: (error: ApiError) => {
      const msg = error.message || error.error || "Failed to delete folder.";
      if (showToasts) toast.error("Delete folder failed", { description: msg, duration: 5000 });
      onErrorCallback?.(error);
    },
  });

  return {
    deleteFolder: mutation.mutate,
    deleteFolderAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error as ApiError | null,
    reset: mutation.reset,
  };
};
