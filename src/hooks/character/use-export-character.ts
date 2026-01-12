/**
 * useExportCharacter Hook
 * Custom hook for exporting a character with TanStack Query
 * Handles mutation, error states, success callbacks, and file download
 */
"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { exportCharacter } from "@/lib/api/characters/endpoints";
import type { ApiError } from "@/lib/api/shared/types";

/**
 * Mutation options for exporting a character
 */
interface UseExportCharacterOptions {
  /**
   * Callback fired on successful character export
   * @param characterName - Name of the exported character
   */
  onSuccess?: (characterName: string) => void;

  /**
   * Callback fired on character export error
   * @param error - API error object
   */
  onError?: (error: ApiError) => void;

  /**
   * Whether to show toast notifications (default: true)
   */
  showToasts?: boolean;
}

/**
 * Custom hook for exporting a character
 * @param options - Configuration options for the mutation
 * @returns Mutation object with status, data, and mutation function
 */
export const useExportCharacter = (options?: UseExportCharacterOptions) => {
  const { onSuccess: onSuccessCallback, onError: onErrorCallback, showToasts = true } = options || {};

  /**
   * Export character mutation
   * Uses TanStack Query's useMutation with advanced features:
   * - Retry logic (3 attempts with exponential backoff)
   * - Error handling with toast notifications
   * - Success handling with file download
   */
  const mutation = useMutation({
    mutationFn: async ({ characterId, format }: { characterId: string; format?: "json" | "png" }) => {
      if (!characterId) {
        throw new Error("Character ID is required for export");
      }
      await exportCharacter(characterId, format || "json");
      return characterId;
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
     * Handles success state and callbacks
     */
    onSuccess: (characterId) => {
      // Show success toast
      if (showToasts) {
        toast.success("Character Exported", {
          description: "Character has been exported successfully.",
          duration: 3000,
        });
      }

      // Execute custom success callback
      if (onSuccessCallback) {
        // We don't have character name here, but we can pass the ID
        // The actual character name is handled in the export function
        onSuccessCallback(characterId);
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
        "Failed to export character. Please try again.";

      // Show error toast
      if (showToasts) {
        toast.error("Export Failed", {
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
   * Export character function wrapper
   * Provides a cleaner API for calling the mutation
   */
  const exportChar = (characterId: string, format?: "json" | "png") => {
    return mutation.mutate({ characterId, format });
  };

  /**
   * Export character async function wrapper
   * Returns a promise for use in async/await patterns
   */
  const exportCharAsync = (characterId: string, format?: "json" | "png") => {
    return mutation.mutateAsync({ characterId, format });
  };

  return {
    /**
     * Mutation function
     * Call this to trigger character export
     */
    exportCharacter: exportChar,

    /**
     * Async mutation function
     * Returns a promise
     */
    exportCharacterAsync: exportCharAsync,

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
