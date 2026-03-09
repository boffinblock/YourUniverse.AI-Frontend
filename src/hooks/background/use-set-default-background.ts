/**
 * useSetDefaultBackground Hook
 * Mutation hook for setting/clearing a background as the global default
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setBackgroundDefault, clearBackgroundDefault } from "@/lib/api/backgrounds/endpoints";
import { queryKeys } from "@/lib/api/shared/query-keys";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/shared/types";

export const useSetDefaultBackground = () => {
    const queryClient = useQueryClient();

    const setMutation = useMutation({
        mutationFn: (backgroundId: string) => setBackgroundDefault(backgroundId),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.backgrounds.all });

            toast.success("Default Background Updated", {
                description: "The global background has been changed successfully.",
                duration: 5000,
            });
        },

        onError: (error: ApiError) => {
            const errorMessage = error.message || "Failed to set default background.";
            toast.error("Error", {
                description: errorMessage,
                duration: 5000,
            });
        },
    });

    const clearMutation = useMutation({
        mutationFn: (backgroundId: string) => clearBackgroundDefault(backgroundId),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.backgrounds.all });

            toast.success("Default Background Removed", {
                description: "The global default background has been cleared.",
                duration: 5000,
            });
        },

        onError: (error: ApiError) => {
            const errorMessage = error.message || "Failed to remove default background.";
            toast.error("Error", {
                description: errorMessage,
                duration: 5000,
            });
        },
    });

    return {
        setDefaultBackground: setMutation.mutate,
        setDefaultBackgroundAsync: setMutation.mutateAsync,
        clearDefaultBackground: clearMutation.mutate,
        clearDefaultBackgroundAsync: clearMutation.mutateAsync,
        isLoading: setMutation.isPending || clearMutation.isPending,
        isSuccess: setMutation.isSuccess || clearMutation.isSuccess,
        isError: setMutation.isError || clearMutation.isError,
    };
};
