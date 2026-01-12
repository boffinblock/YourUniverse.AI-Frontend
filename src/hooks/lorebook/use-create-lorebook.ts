/**
 * useCreateLorebook Hook
 * Custom hook for creating a lorebook with TanStack Query
 * Handles mutation, error states, success callbacks, and cache invalidation
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createLorebook } from "@/lib/api/lorebooks";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { CreateLorebookRequest, CreateLorebookResponse } from "@/lib/api/lorebooks";
import type { ApiError } from "@/lib/api/shared/types";

/**
 * Mutation options for creating a lorebook
 */
interface UseCreateLorebookOptions {
  /**
   * Callback fired on successful lorebook creation
   * @param data - Lorebook creation response data
   */
  onSuccess?: (data: CreateLorebookResponse) => void;

  /**
   * Callback fired on lorebook creation error
   * @param error - API error object
   */
  onError?: (error: ApiError) => void;

  /**
   * Whether to show toast notifications (default: true)
   */
  showToasts?: boolean;
}

/**
 * Custom hook for creating a lorebook
 * @param options - Configuration options for the mutation
 * @returns Mutation object with status, data, and mutation function
 */
export const useCreateLorebook = (options: UseCreateLorebookOptions = {}) => {
  const {
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
    showToasts = true,
  } = options;

  const queryClient = useQueryClient();

  /**
   * Create lorebook mutation
   * Uses TanStack Query's useMutation with advanced features:
   * - Retry logic (3 attempts with exponential backoff)
   * - Error handling with toast notifications
   * - Success handling with cache invalidation
   */
  const mutation = useMutation({
    mutationFn: async (data: CreateLorebookRequest) => {
      return await createLorebook(data);
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

      // Invalidate lorebook list queries to refetch with new lorebook
      queryClient.invalidateQueries({ queryKey: queryKeys.lorebooks.all });

      // Optionally set the new lorebook in cache for immediate access
      if (data.lorebook) {
        queryClient.setQueryData(
          queryKeys.lorebooks.detail(data.lorebook.id),
          data.lorebook
        );
      }

      // Show success toast
      if (showToasts) {
        toast.success("Lorebook Created", {
          description: data.message || "Your lorebook has been created successfully.",
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
        "Failed to create lorebook. Please try again.";

      // Show error toast
      if (showToasts) {
        toast.error("Creation Failed", {
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
   * Create lorebook function wrapper
   * Provides a cleaner API for calling the mutation
   */
  const create = (data: CreateLorebookRequest) => {
    return mutation.mutate(data);
  };

  /**
   * Create lorebook async function wrapper
   * Returns a promise for use in async/await patterns
   */
  const createAsync = (data: CreateLorebookRequest) => {
    return mutation.mutateAsync(data);
  };

  return {
    /**
     * Mutation function
     * Call this to trigger lorebook creation
     */
    createLorebook: create,

    /**
     * Async mutation function
     * Returns a promise
     */
    createLorebookAsync: createAsync,

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

