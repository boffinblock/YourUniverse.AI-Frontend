/**
 * useToggleLorebookSaved Hook
 * Custom hook for toggling lorebook saved status with TanStack Query
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleLorebookSaved } from "@/lib/api/lorebooks";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { ApiError } from "@/lib/api/shared/types";

interface UseToggleLorebookSavedOptions {
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

export const useToggleLorebookSaved = (options?: UseToggleLorebookSavedOptions) => {
    const {
        onSuccess: onSuccessCallback,
        onError: onErrorCallback,
        showToasts = true,
    } = options || {};

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (lorebookId: string) => {
            const response = await toggleLorebookSaved(lorebookId);
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
            // Invalidate lorebook queries to refetch with updated saved status
            queryClient.invalidateQueries({ queryKey: queryKeys.lorebooks.all });

            if (showToasts) {
                toast.success(
                    data?.lorebook?.isSaved ? "Lorebook Saved" : "Lorebook Unsaved",
                    {
                        description: data?.lorebook?.isSaved
                            ? "Lorebook has been saved to your collection."
                            : "Lorebook has been removed from your saved collection.",
                        duration: 3000,
                    }
                );
            }

            if (onSuccessCallback) {
                onSuccessCallback(data?.lorebook?.isSaved);
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
