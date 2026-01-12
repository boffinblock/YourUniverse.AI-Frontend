/**
 * useToggleLorebookFavourite Hook
 * Custom hook for toggling lorebook favourite status with TanStack Query
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleLorebookFavourite } from "@/lib/api/lorebooks";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { ApiError } from "@/lib/api/shared/types";

interface UseToggleLorebookFavouriteOptions {
  /**
   * Callback fired on successful favourite toggle
   */
  onSuccess?: (isFavourite: boolean) => void;

  /**
   * Callback fired on error
   */
  onError?: (error: ApiError) => void;

  /**
   * Whether to show toast notifications (default: true)
   */
  showToasts?: boolean;
}

export const useToggleLorebookFavourite = (options?: UseToggleLorebookFavouriteOptions) => {
  const {
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
    showToasts = true,
  } = options || {};

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (lorebookId: string) => {
      const response = await toggleLorebookFavourite(lorebookId);
      return response.data;
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
    onSuccess: (data) => {
      // Invalidate lorebook queries to refetch with updated favourite status
      queryClient.invalidateQueries({ queryKey: queryKeys.lorebooks.all });

      if (showToasts) {
        toast.success(
          data?.lorebook?.isFavourite ? "Added to Favourites" : "Removed from Favourites",
          {
            description: data?.lorebook?.isFavourite
              ? "Lorebook has been added to your favourites."
              : "Lorebook has been removed from your favourites.",
            duration: 3000,
          }
        );
      }

      if (onSuccessCallback) {
        onSuccessCallback(data?.lorebook?.isFavourite);
      }
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error.message ||
        error.error ||
        "Failed to update favourite status. Please try again.";

      if (showToasts) {
        toast.error("Update Failed", {
          description: errorMessage,
          duration: 5000,
        });
      }

      if (onErrorCallback) {
        onErrorCallback(error);
      }
    },
  });

  return {
    toggleFavourite: mutation.mutate,
    toggleFavouriteAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error as ApiError | null,
    reset: mutation.reset,
  };
};
