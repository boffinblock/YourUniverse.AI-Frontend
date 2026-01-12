/**
 * useToggleSaved Hook
 * Custom hook for toggling character saved status with TanStack Query
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleCharacterSaved } from "@/lib/api/characters/endpoints";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { ApiError } from "@/lib/api/shared/types";

interface UseToggleSavedOptions {
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

export const useToggleSaved = (options?: UseToggleSavedOptions) => {
    const {
        onSuccess: onSuccessCallback,
        onError: onErrorCallback,
        showToasts = true,
    } = options || {};

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (characterId: string) => {
            const response = await toggleCharacterSaved(characterId);
            return response.data;
        },
        retry: (failureCount, error) => {
            // Don't retry on 4xx errors
            if ((error as ApiError).statusCode && (error as ApiError).statusCode! >= 400 && (error as ApiError).statusCode! < 500) {
                return false;
            }
            return failureCount < 3;
        },
        retryDelay: (attemptIndex) => {
            return Math.min(1000 * 2 ** attemptIndex, 4000);
        },
        onSuccess: (data) => {
            // Invalidate character queries to refetch with updated saved status
            queryClient.invalidateQueries({ queryKey: queryKeys.characters.all });

            if (showToasts) {
                toast.success(
                    data?.character?.isSaved ? "Character Saved" : "Character Unsaved",
                    {
                        description: data?.character?.isSaved
                            ? "Character has been saved to your collection."
                            : "Character has been removed from your saved collection.",
                        duration: 3000,
                    }
                );
            }

            if (onSuccessCallback) {
                onSuccessCallback(data?.character?.isSaved);
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

