/**
 * useSetDefaultBackground Hook
 * Mutation hook for setting a background as the global default
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setBackgroundDefault } from "@/lib/api/backgrounds/endpoints";
import { queryKeys } from "@/lib/api/shared/query-keys";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/shared/types";

export const useSetDefaultBackground = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (backgroundId: string) => setBackgroundDefault(backgroundId),

        onSuccess: () => {
            // Invalidate ALL background queries to ensure site-wide sync
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

    return {
        setDefaultBackground: mutation.mutate,
        setDefaultBackgroundAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
    };
};
