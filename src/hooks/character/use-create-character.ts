/**
 * useCreateCharacter Hook
 * Custom hook for creating a character with TanStack Query
 * Handles mutation, error states, success callbacks, and cache invalidation
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCharacter } from "@/lib/api/characters";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { CreateCharacterRequest, CreateCharacterResponse } from "@/lib/api/characters";
import type { ApiError } from "@/lib/api/shared/types";

/**
 * Mutation options for creating a character
 */
interface UseCreateCharacterOptions {
    /**
     * Callback fired on successful character creation
     * @param data - Character creation response data
     */
    onSuccess?: (data: CreateCharacterResponse) => void;

    /**
     * Callback fired on character creation error
     * @param error - API error object
     */
    onError?: (error: ApiError) => void;

    /**
     * Whether to show toast notifications (default: true)
     */
    showToasts?: boolean;
}

/**
 * Custom hook for creating a character
 * @param options - Configuration options for the mutation
 * @returns Mutation object with status, data, and mutation function
 */
export const useCreateCharacter = (options: UseCreateCharacterOptions = {}) => {
    const {
        onSuccess: onSuccessCallback,
        onError: onErrorCallback,
        showToasts = true,
    } = options;

    const queryClient = useQueryClient();

    /**
     * Create character mutation
     * Uses TanStack Query's useMutation with advanced features:
     * - Retry logic (3 attempts with exponential backoff)
     * - Error handling with toast notifications
     * - Success handling with cache invalidation
     */
    const mutation = useMutation({
        mutationFn: async (data: CreateCharacterRequest) => {
            return await createCharacter(data);
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

            // Invalidate character list queries to refetch with new character
            queryClient.invalidateQueries({ queryKey: queryKeys.characters.all });

            // Optionally set the new character in cache for immediate access
            if (data.character) {
                queryClient.setQueryData(
                    queryKeys.characters.detail(data.character.id),
                    data.character
                );
            }

            // Show success toast
            if (showToasts) {
                toast.success("Character Created", {
                    description: data.message || "Your character has been created successfully.",
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
                "Failed to create character. Please try again.";

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
            // Refetch character lists to ensure consistency
            queryClient.invalidateQueries({ queryKey: queryKeys.characters.lists() });
        },
    });

    /**
     * Create character function wrapper
     * Provides a cleaner API for calling the mutation
     */
    const create = (data: CreateCharacterRequest) => {
        return mutation.mutate(data);
    };

    /**
     * Create character async function wrapper
     * Returns a promise for use in async/await patterns
     */
    const createAsync = (data: CreateCharacterRequest) => {
        return mutation.mutateAsync(data);
    };

    return {
        /**
         * Mutation function
         * Call this to trigger character creation
         */
        createCharacter: create,

        /**
         * Async mutation function
         * Returns a promise
         */
        createCharacterAsync: createAsync,

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

