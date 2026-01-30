/**
 * useUpdateFolder Hook
 * Updates (rename) a folder with TanStack Query
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateFolder } from "@/lib/api/folders";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { UpdateFolderRequest, UpdateFolderResponse } from "@/lib/api/folders";
import type { ApiError } from "@/lib/api/shared/types";

export type UpdateFolderPayload = UpdateFolderRequest & { folderId: string };

interface UseUpdateFolderOptions {
  onSuccess?: (data: UpdateFolderResponse) => void;
  onError?: (error: ApiError) => void;
  showToasts?: boolean;
}

export const useUpdateFolder = (options: UseUpdateFolderOptions = {}) => {
  const { onSuccess: onSuccessCallback, onError: onErrorCallback, showToasts = true } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: UpdateFolderPayload) => {
      const { folderId, ...data } = payload;
      const response = await updateFolder(folderId, data);
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
        toast.success("Folder updated", {
          description: `Folder has been renamed to "${data.folder?.name}".`,
          duration: 3000,
        });
      }
      onSuccessCallback?.(data);
    },
    onError: (error: ApiError) => {
      const msg = error.message || error.error || "Failed to update folder.";
      if (showToasts) toast.error("Update folder failed", { description: msg, duration: 5000 });
      onErrorCallback?.(error);
    },
  });

  return {
    updateFolder: mutation.mutate,
    updateFolderAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error as ApiError | null,
    reset: mutation.reset,
  };
};
