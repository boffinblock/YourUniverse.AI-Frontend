/**
 * useTogglePersonaSaved Hook
 * Custom hook for toggling persona saved status with TanStack Query
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { togglePersonaSaved } from "@/lib/api/personas";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { ApiError } from "@/lib/api/shared/types";

interface UseTogglePersonaSavedOptions {
  /**
   * Callback fired on successful saved toggle
   */
  onSuccess?: (isSaved: boolean) => void;

  /**
   * Callback fired on error
   */
  onError?: (error: ApiError) => void;

  /**
   * Whether to show toast notifications (default: true)
   */
  showToasts?: boolean;
}

export const useTogglePersonaSaved = (options?: UseTogglePersonaSavedOptions) => {
  const {
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
    showToasts = true,
  } = options || {};

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (personaId: string) => {
      const response = await togglePersonaSaved(personaId);
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
          data?.persona?.isSaved ? "Saved" : "Unsaved",
          {
            description: data?.persona?.isSaved
              ? "Persona has been saved."
              : "Persona has been unsaved.",
            duration: 3000,
          }
        );
      }

      if (onSuccessCallback) {
        onSuccessCallback(data?.persona?.isSaved);
      }
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error.message ||
        error.error ||
        "Failed to update saved status. Please try again.";

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
    toggleSaved: mutation.mutate,
    toggleSavedAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error as ApiError | null,
    reset: mutation.reset,
  };
};
