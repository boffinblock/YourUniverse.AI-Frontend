/**
 * useDeleteLorebook Hook
 * Custom hook for deleting lorebooks with TanStack Query
 * Supports both single and batch deletion
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteLorebook, deleteLorebooksBatch } from "@/lib/api/lorebooks";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { ApiError } from "@/lib/api/shared/types";

interface UseDeleteLorebookOptions {
  /**
   * Callback fired on successful lorebook deletion
   */
  onSuccess?: (data?: { success: number; failed: number; errors: Array<{ id: string; error: string }> }) => void;

  /**
   * Callback fired on deletion error
   */
  onError?: (error: ApiError) => void;

  /**
   * Whether to show toast notifications (default: true)
   */
  showToasts?: boolean;
}

export const useDeleteLorebook = (options?: UseDeleteLorebookOptions) => {
  const {
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
    showToasts = true,
  } = options || {};

  const queryClient = useQueryClient();

  // Single deletion mutation
  const singleMutation = useMutation({
    mutationFn: async (lorebookId: string) => {
      await deleteLorebook(lorebookId);
    },
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if ((error as ApiError).statusCode && (error as ApiError).statusCode! >= 400 && (error as ApiError).statusCode! < 500) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => {
      return Math.min(1000 * 2 ** attemptIndex, 4000);
    },
    onSuccess: () => {
      // Invalidate lorebook queries to refetch without deleted lorebook
      queryClient.invalidateQueries({ queryKey: queryKeys.lorebooks.all });

      if (showToasts) {
        toast.success("Lorebook Deleted", {
          description: "Lorebook has been permanently deleted.",
          duration: 5000,
        });
      }

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error.message ||
        error.error ||
        "Failed to delete lorebook. Please try again.";

      if (showToasts) {
        toast.error("Deletion Failed", {
          description: errorMessage,
          duration: 5000,
        });
      }

      if (onErrorCallback) {
        onErrorCallback(error);
      }
    },
  });

  // Batch deletion mutation
  const batchMutation = useMutation<
    { success: number; failed: number; errors: Array<{ id: string; error: string }> },
    ApiError,
    string[]
  >({
    mutationFn: async (lorebookIds: string[]) => {
      const results = await deleteLorebooksBatch(lorebookIds);
      return results;
    },
    onSuccess: (data) => {
      // Invalidate lorebook list queries to refresh the list
      queryClient.invalidateQueries({ queryKey: queryKeys.lorebooks.lists() });

      // Remove deleted lorebooks from cache
      // Note: We don't know which specific lorebooks were deleted, so we invalidate all detail queries
      queryClient.invalidateQueries({ queryKey: queryKeys.lorebooks.details() });

      if (showToasts) {
        if (data.failed === 0) {
          toast.success("Lorebooks deleted successfully", {
            description: `${data.success} lorebook(s) have been permanently deleted.`,
          });
        } else {
          toast.warning("Some lorebooks could not be deleted", {
            description: `${data.success} deleted successfully, ${data.failed} failed.`,
          });
        }
      }

      onSuccessCallback?.(data);
    },
    onError: (error) => {
      if (showToasts) {
        toast.error("Failed to delete lorebooks", {
          description: error.message || error.error || "An error occurred while deleting the lorebooks.",
        });
      }

      onErrorCallback?.(error);
    },
  });

  return {
    // Single deletion (for one lorebook)
    deleteLorebook: singleMutation.mutate,
    deleteLorebookAsync: singleMutation.mutateAsync,

    // Batch deletion (for multiple lorebooks)
    deleteLorebooksBatch: batchMutation.mutate,
    deleteLorebooksBatchAsync: batchMutation.mutateAsync,

    // Loading state (true if either mutation is pending)
    isLoading: singleMutation.isPending || batchMutation.isPending,
    isSuccess: singleMutation.isSuccess || batchMutation.isSuccess,
    isError: singleMutation.isError || batchMutation.isError,
    error: (singleMutation.error || batchMutation.error) as ApiError | null,
    data: batchMutation.data,
    reset: () => {
      singleMutation.reset();
      batchMutation.reset();
    },
  };
};
