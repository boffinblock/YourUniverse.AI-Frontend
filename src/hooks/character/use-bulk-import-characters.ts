/**
 * useBulkImportCharacters Hook
 * Custom hook for bulk importing characters with TanStack Query
 * Handles mutation, error states, success callbacks, and cache invalidation
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bulkImportCharacters } from "@/lib/api/characters/endpoints";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { BulkImportCharactersResponse, Character } from "@/lib/api/characters";
import type { ApiError } from "@/lib/api/shared/types";

/**
 * Mutation options for bulk importing characters
 */
interface UseBulkImportCharactersOptions {
  /**
   * Callback fired on successful bulk import
   * @param data - Bulk import response data
   */
  onSuccess?: (data: BulkImportCharactersResponse) => void;

  /**
   * Callback fired on bulk import error
   * @param error - API error object
   */
  onError?: (error: ApiError) => void;

  /**
   * Whether to show toast notifications (default: true)
   */
  showToasts?: boolean;
}

/**
 * Custom hook for bulk importing characters
 * @param options - Configuration options for the mutation
 * @returns Mutation object with status, data, and mutation function
 */
export const useBulkImportCharacters = (options?: UseBulkImportCharactersOptions) => {
  const { onSuccess: onSuccessCallback, onError: onErrorCallback, showToasts = true } = options || {};
  const queryClient = useQueryClient();

  /**
   * Bulk import characters mutation
   * Uses TanStack Query's useMutation with advanced features:
   * - Retry logic (3 attempts with exponential backoff)
   * - Error handling with toast notifications
   * - Success handling with cache invalidation
   */
  const mutation = useMutation({
    mutationFn: async (file: File) => {
      if (!file) {
        throw new Error("File is required for bulk import");
      }
      return await bulkImportCharacters(file);
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

      // Update imported characters in cache
      data.characters.forEach((character: Character) => {
        queryClient.setQueryData(
          queryKeys.characters.detail(character.id),
          { character }
        );
      });

      // Show success toast
      if (showToasts) {
        if (data.failed === 0) {
          toast.success("Characters Imported", {
            description: data.message || `Successfully imported ${data.imported} character(s).`,
            duration: 5000,
          });
        } else {
          toast.warning("Partial Import Success", {
            description: `${data.imported} imported successfully, ${data.failed} failed.`,
            duration: 5000,
          });
        }
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
        "Failed to import characters. Please try again.";

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
   * Bulk import characters function wrapper
   * Provides a cleaner API for calling the mutation
   */
  const bulkImport = (file: File) => {
    return mutation.mutate(file);
  };

  /**
   * Bulk import characters async function wrapper
   * Returns a promise for use in async/await patterns
   */
  const bulkImportAsync = (file: File) => {
    return mutation.mutateAsync(file);
  };

  return {
    /**
     * Mutation function
     * Call this to trigger bulk character import
     */
    bulkImportCharacters: bulkImport,

    /**
     * Async mutation function
     * Returns a promise
     */
    bulkImportCharactersAsync: bulkImportAsync,

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
