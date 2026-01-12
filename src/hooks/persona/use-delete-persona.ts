/**
 * useDeletePersona Hook
 * Custom hook for deleting personas with TanStack Query
 * Supports both single and batch deletion
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deletePersona, deletePersonasBatch } from "@/lib/api/personas";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { ApiError } from "@/lib/api/shared/types";

interface UseDeletePersonaOptions {
  /**
   * Callback fired on successful persona deletion
   */
  onSuccess?: (data?: { deleted: number; failed: number }) => void;

  /**
   * Callback fired on deletion error
   */
  onError?: (error: ApiError) => void;

  /**
   * Whether to show toast notifications (default: true)
   */
  showToasts?: boolean;
}

export const useDeletePersona = (options?: UseDeletePersonaOptions) => {
  const {
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
    showToasts = true,
  } = options || {};

  const queryClient = useQueryClient();

  // Single deletion mutation
  const singleMutation = useMutation({
    mutationFn: async (personaId: string) => {
      await deletePersona(personaId);
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.personas.all });

      if (showToasts) {
        toast.success("Persona Deleted", {
          description: "Persona has been permanently deleted.",
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
        "Failed to delete persona. Please try again.";

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
    { deleted: number; failed: number; message: string },
    ApiError,
    string[]
  >({
    mutationFn: async (personaIds: string[]) => {
      const response = await deletePersonasBatch(personaIds);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.personas.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.personas.details() });

      if (showToasts) {
        if (data.failed === 0) {
          toast.success("Personas deleted successfully", {
            description: `${data.deleted} persona(s) have been permanently deleted.`,
          });
        } else {
          toast.warning("Some personas could not be deleted", {
            description: `${data.deleted} deleted successfully, ${data.failed} failed.`,
          });
        }
      }

      onSuccessCallback?.(data);
    },
    onError: (error) => {
      if (showToasts) {
        toast.error("Failed to delete personas", {
          description: error.message || error.error || "An error occurred while deleting the personas.",
        });
      }

      onErrorCallback?.(error);
    },
  });

  return {
    // Single deletion (for one persona)
    deletePersona: singleMutation.mutate,
    deletePersonaAsync: singleMutation.mutateAsync,

    // Batch deletion (for multiple personas)
    deletePersonasBatch: batchMutation.mutate,
    deletePersonasBatchAsync: batchMutation.mutateAsync,

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
