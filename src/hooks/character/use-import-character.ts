/**
 * useImportCharacter Hook
 * Custom hook for importing a character with TanStack Query
 * Handles mutation, error states, success callbacks, and cache invalidation
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { importCharacter } from "@/lib/api/characters/endpoints";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { ImportCharacterResponse } from "@/lib/api/characters";
import type { ApiError } from "@/lib/api/shared/types";

/**
 * Mutation options for importing a character
 */
interface UseImportCharacterOptions {
  /**
   * Callback fired on successful character import
   * @param data - Character import response data
   */
  onSuccess?: (data: ImportCharacterResponse) => void;

  /**
   * Callback fired on character import error
   * @param error - API error object
   */
  onError?: (error: ApiError) => void;

  /**
   * Whether to show toast notifications (default: true)
   */
  showToasts?: boolean;
}

/**
 * Custom hook for importing a character
 * @param options - Configuration options for the mutation
 * @returns Mutation object with status, data, and mutation function
 */
export const useImportCharacter = (options?: UseImportCharacterOptions) => {
  const { onSuccess: onSuccessCallback, onError: onErrorCallback, showToasts = true } = options || {};
  const queryClient = useQueryClient();

  /**
   * Import character mutation
   * Uses TanStack Query's useMutation with advanced features:
   * - Retry logic (3 attempts with exponential backoff)
   * - Error handling with toast notifications
   * - Success handling with cache invalidation
   */
  const mutation = useMutation({
    mutationFn: async (file: File) => {
      if (!file) {
        throw new Error("File is required for import");
      }
      return await importCharacter(file);
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
     * On mutation success
     * Handles success state, cache invalidation, and callbacks
     */
    onSuccess: (response) => {
      const { data } = response;

      // Invalidate all character list queries to refresh the list
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.all });

      // Update the character in cache for immediate access
      if (data.character) {
        queryClient.setQueryData(
          queryKeys.characters.detail(data.character.id),
          { character: data.character }
        );
      }

      // Show success toast
      if (showToasts) {
        toast.success("Character Imported", {
          description: data.message || `${data.character.name} has been imported successfully.`,
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
        "Failed to import character. Please try again.";

      // Show error toast
      if (showToasts) {
        toast.error("Import Failed", {
          description: errorMessage,
          duration: 5000,
        });
      }

      // Execute custom error callback
      if (onErrorCallback) {
        onErrorCallback(error);
      }
    },
  });

  /**
   * Import character function wrapper
   * Provides a cleaner API for calling the mutation
   */
  const importChar = (file: File) => {
    return mutation.mutate(file);
  };

  /**
   * Import character async function wrapper
   * Returns a promise for use in async/await patterns
   */
  const importCharAsync = (file: File) => {
    return mutation.mutateAsync(file);
  };

  return {
    /**
     * Mutation function
     * Call this to trigger character import
     */
    importCharacter: importChar,

    /**
     * Async mutation function
     * Returns a promise
     */
    importCharacterAsync: importCharAsync,

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
