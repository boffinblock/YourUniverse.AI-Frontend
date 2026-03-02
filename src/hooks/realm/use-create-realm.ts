/**
 * useCreateRealm Hook
 * Custom hook for creating a realm with TanStack Query
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createRealm } from "@/lib/api/realms";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { CreateRealmRequest, RealmResponse } from "@/lib/api/realms";
import type { ApiError } from "@/lib/api/shared/types";

interface UseCreateRealmOptions {
    onSuccess?: (data: RealmResponse) => void;
    onError?: (error: ApiError) => void;
    showToasts?: boolean;
}

export const useCreateRealm = (options: UseCreateRealmOptions = {}) => {
    const {
        onSuccess: onSuccessCallback,
        onError: onErrorCallback,
        showToasts = true,
    } = options;

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (data: CreateRealmRequest) => {
            const response = await createRealm(data);
            return response;
        },

        onSuccess: (response) => {
            const { data } = response;

            queryClient.invalidateQueries({ queryKey: queryKeys.realms.all });

            if (showToasts) {
                toast.success("Realm Created", {
                    description: data.message || "Your realm has been created successfully.",
                    duration: 5000,
                });
            }

            if (onSuccessCallback) {
                onSuccessCallback(data);
            }
        },

        onError: (error: ApiError) => {
            const errorMessage =
                error.message ||
                "Failed to create realm. Please try again.";

            if (showToasts) {
                toast.error("Creation Failed", {
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
        createRealm: mutation.mutate,
        createRealmAsync: mutation.mutateAsync,
        status: mutation.status,
        isLoading: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        data: mutation.data?.data,
        error: mutation.error as ApiError | null,
        reset: mutation.reset,
    };
};
