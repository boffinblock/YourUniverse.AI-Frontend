/**
 * useCreateTag Hook
 * Custom hook for creating a tag with TanStack Query
 * Handles mutation, error states, success callbacks, and cache invalidation
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTag } from "@/lib/api/tags";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { CreateTagRequest, CreateTagResponse } from "@/lib/api/tags";
import type { ApiError } from "@/lib/api/shared/types";

/**
 * Mutation options for creating a tag
 */
interface UseCreateTagOptions {
  /**
   * Callback fired on successful tag creation
   * @param data - Tag creation response data
   */
  onSuccess?: (data: CreateTagResponse) => void;

  /**
   * Callback fired on tag creation error
   * @param error - API error object
   */
  onError?: (error: ApiError) => void;

  /**
   * Whether to show toast notifications (default: true)
   */
  showToasts?: boolean;
}

/**
 * Custom hook for creating a tag
 * @param options - Configuration options for the mutation
 * @returns Mutation object with status, data, and mutation function
 */
export const useCreateTag = (options: UseCreateTagOptions = {}) => {
  const {
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
    showToasts = true,
  } = options;

  const queryClient = useQueryClient();

  /**
   * Create tag mutation
   * Uses TanStack Query's useMutation with advanced features:
   * - Retry logic (3 attempts with exponential backoff)
   * - Error handling with toast notifications
   * - Success handling with cache invalidation
   */
  const mutation = useMutation({
    mutationFn: async (data: CreateTagRequest) => {
      return await createTag(data);
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

      // Invalidate tag list queries to refetch with new tag
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });

      // Show success toast
      if (showToasts) {
        toast.success("Tag Created", {
          description: data.message || "Your tag has been created successfully.",
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
        "Failed to create tag. Please try again.";

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
  });

  /**
   * Create tag function wrapper
   * Provides a cleaner API for calling the mutation
   */
  const create = (data: CreateTagRequest) => {
    return mutation.mutate(data);
  };

  /**
   * Create tag async function wrapper
   * Returns a promise for use in async/await patterns
   */
  const createAsync = (data: CreateTagRequest) => {
    return mutation.mutateAsync(data);
  };

  return {
    /**
     * Mutation function
     * Call this to trigger tag creation
     */
    createTag: create,

    /**
     * Async mutation function
     * Returns a promise
     */
    createTagAsync: createAsync,

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

