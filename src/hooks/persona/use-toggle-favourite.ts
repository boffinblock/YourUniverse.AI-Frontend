/**
 * useTogglePersonaFavourite Hook
 * Custom hook for toggling persona favourite status with TanStack Query
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { togglePersonaFavourite } from "@/lib/api/personas";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { ApiError } from "@/lib/api/shared/types";

interface UseTogglePersonaFavouriteOptions {
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

export const useTogglePersonaFavourite = (options?: UseTogglePersonaFavouriteOptions) => {
  const {
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
    showToasts = true,
  } = options || {};

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (personaId: string) => {
      const response = await togglePersonaFavourite(personaId);
      return response.data;
    },
    retry: (failureCount, error) => {
      if ((error as ApiError).statusCode && (error as ApiError).statusCode! >= 400 && (error as ApiError).statusCode! < 500) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => {
      return Math.min(1000 * 2 ** attemptIndex, 4000);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.personas.all });

      if (showToasts) {
        toast.success(
          data?.persona?.isFavourite ? "Added to Favourites" : "Removed from Favourites",
          {
            description: data?.persona?.isFavourite
              ? "Persona has been added to your favourites."
              : "Persona has been removed from your favourites.",
            duration: 3000,
          }
        );
      }

      if (onSuccessCallback) {
        onSuccessCallback(data?.persona?.isFavourite);
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
