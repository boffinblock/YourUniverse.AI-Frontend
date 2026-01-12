/**
 * useUpdateLorebook Hook
 * Custom hook for updating a lorebook with TanStack Query
 * Handles mutation, error states, success callbacks, and cache invalidation
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateLorebook } from "@/lib/api/lorebooks";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { UpdateLorebookRequest, UpdateLorebookResponse } from "@/lib/api/lorebooks";
import type { ApiError } from "@/lib/api/shared/types";

/**
 * Mutation options for updating a lorebook
 */
interface UseUpdateLorebookOptions {
  /**
   * Lorebook ID to update
   */
  lorebookId: string;

  /**
   * Callback fired on successful lorebook update
   * @param data - Lorebook update response data
   */
  onSuccess?: (data: UpdateLorebookResponse) => void;

  /**
   * Callback fired on lorebook update error
   * @param error - API error object
   */
  onError?: (error: ApiError) => void;

  /**
   * Whether to show toast notifications (default: true)
   */
  showToasts?: boolean;
}

/**
 * Custom hook for updating a lorebook
 * @param options - Configuration options for the mutation
 * @returns Mutation object with status, data, and mutation function
 */
export const useUpdateLorebook = (options: UseUpdateLorebookOptions) => {
  const {
    lorebookId,
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
    showToasts = true,
  } = options;

  const queryClient = useQueryClient();

  /**
   * Update lorebook mutation
   * Uses TanStack Query's useMutation with advanced features:
   * - Retry logic (3 attempts with exponential backoff)
   * - Error handling with toast notifications
   * - Success handling with cache invalidation
   */
  const mutation = useMutation({
    mutationFn: async (data: UpdateLorebookRequest) => {
      if (!lorebookId) {
        throw new Error("Lorebook ID is required for update");
      }
      return await updateLorebook(lorebookId, data);
    },

    /**
     * Retry configuration
     * Retries failed requests up to 3 times with exponential backoff
     */
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if ((error as ApiError).statusCode && (error as ApiError).statusCode! >= 400 && (error as ApiError).statusCode! < 500) {
        return false;
      }
      // Retry up to 3 times for network/server errors
      return failureCount < 3;
    },

    retryDelay: (attemptIndex) => {
      // Exponential backoff: 1s, 2s, 4s
      return Math.min(1000 * 2 ** attemptIndex, 4000);
    },

    /**
     * On mutation start
     * Capture old lorebook data for comparison
     */
    onMutate: async (variables) => {
      // Get the old lorebook data from cache
      const oldLorebook = queryClient.getQueryData<{ lorebook: any }>(
        queryKeys.lorebooks.detail(lorebookId)
      );

      // Return context with old data for use in onSuccess/onError
      return { oldLorebook };
    },

    /**
     * On mutation success
     * Handles success state, cache invalidation, and callbacks
     */
    onSuccess: (response, variables, context) => {
      const { data } = response;
      const oldLorebook = context?.oldLorebook;

      // Invalidate lorebook list queries to refetch with updated lorebook
      queryClient.invalidateQueries({ queryKey: queryKeys.lorebooks.all });

      // Update the lorebook in cache for immediate access
      if (data.lorebook) {
        queryClient.setQueryData(
          queryKeys.lorebooks.detail(data.lorebook.id),
          { lorebook: data.lorebook }
        );
      }

      // Invalidate character queries if characterIds were updated
      if (variables.characterIds !== undefined) {
        const oldCharacterIds = oldLorebook?.lorebook?.characters?.map((c: any) => c.id) || [];
        const newCharacterIds = variables.characterIds || [];

        // Get all unique character IDs (old + new)
        const allCharacterIds = [...new Set([...oldCharacterIds, ...newCharacterIds])];

        // Invalidate each character's detail query
        allCharacterIds.forEach((characterId: string) => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.characters.detail(characterId),
          });
        });

        // Invalidate all character list queries
        queryClient.invalidateQueries({ queryKey: queryKeys.characters.all });
      }

      // Show success toast
      if (showToasts) {
        toast.success("Lorebook Updated", {
          description: data.message || "Your lorebook has been updated successfully.",
          duration: 5000,
        });
      }

      // Execute custom success callback
      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },

    /**
     * On mutation error
     * Handles error state, error messages, and callbacks
     */
    onError: (error: ApiError) => {
      // Extract error message
      const errorMessage =
        error.message ||
        error.error ||
        "Failed to update lorebook. Please try again.";

      // Show error toast
      if (showToasts) {
        toast.error("Update Failed", {
          description: errorMessage,
          duration: 5000,
        });
      }

      // Execute custom error callback
      if (onErrorCallback) {
        onErrorCallback(error);
      }
    },

    /**
     * On mutation settle (both success and error)
     * Can be used for cleanup or analytics
     */
    onSettled: () => {
      // Refetch lorebook lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.lorebooks.lists() });
    },
  });

  /**
   * Update lorebook function wrapper
   * Provides a cleaner API for calling the mutation
   */
  const update = (data: UpdateLorebookRequest) => {
    return mutation.mutate(data);
  };

  /**
   * Update lorebook async function wrapper
   * Returns a promise for use in async/await patterns
   */
  const updateAsync = (data: UpdateLorebookRequest) => {
    return mutation.mutateAsync(data);
  };

  return {
    /**
     * Mutation function
     * Call this to trigger lorebook update
     */
    updateLorebook: update,

    /**
     * Async mutation function
     * Returns a promise
     */
    updateLorebookAsync: updateAsync,

    /**
     * Mutation status
     * - idle: Not started
     * - pending: In progress
     * - error: Failed
     * - success: Completed successfully
     */
    status: mutation.status,

    /**
     * Whether mutation is currently pending
     */
    isLoading: mutation.isPending,

    /**
     * Whether mutation completed successfully
     */
    isSuccess: mutation.isSuccess,

    /**
     * Whether mutation failed
     */
    isError: mutation.isError,

    /**
     * Response data (available after success)
     */
    data: mutation.data?.data,

    /**
     * Error object (available after error)
     */
    error: mutation.error as ApiError | null,

    /**
     * Reset mutation state
     * Useful for clearing error/success states
     */
    reset: mutation.reset,
  };
};
