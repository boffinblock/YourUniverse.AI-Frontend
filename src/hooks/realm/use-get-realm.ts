/**
 * useGetRealm Hook
 * Custom hook for fetching a single realm with TanStack Query
 */
"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { getRealm } from "@/lib/api/realms";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { RealmResponse } from "@/lib/api/realms";
import type { ApiError } from "@/lib/api/shared/types";

/**
 * Options for fetching a realm
 */
interface UseGetRealmOptions {
    /**
     * Whether to enable the query (default: true)
     */
    enabled?: boolean;

    /**
     * Stale time in milliseconds (default: 5 minutes)
     */
    staleTime?: number;

    /**
     * Cache time in milliseconds (default: 10 minutes)
     */
    cacheTime?: number;

    /**
     * Whether to refetch on window focus (default: true)
     */
    refetchOnWindowFocus?: boolean;

    /**
     * Whether to refetch on mount (default: true)
     */
    refetchOnMount?: boolean;

    /**
     * Retry configuration
     */
    retry?: boolean | number | ((failureCount: number, error: ApiError) => boolean);

    /**
     * Callback fired on successful fetch
     */
    onSuccess?: (data: RealmResponse) => void;

    /**
     * Callback fired on fetch error
     */
    onError?: (error: ApiError) => void;

    /**
     * Whether to show error toast notifications (default: false)
     */
    showErrorToast?: boolean;
}

/**
 * Custom hook for fetching a single realm
 * @param realmId - Realm UUID
 * @param options - Configuration options for the query
 * @returns Query object with realm data, loading state, and error state
 */
export const useGetRealm = (
    realmId: string | undefined,
    options: UseGetRealmOptions = {}
) => {
    const {
        enabled = true,
        staleTime = 5 * 60 * 1000, // 5 minutes
        cacheTime = 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus = true,
        refetchOnMount = true,
        retry = (failureCount, error) => {
            // Don't retry on 4xx errors
            if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
                return false;
            }
            return failureCount < 3;
        },
        onSuccess: onSuccessCallback,
        onError: onErrorCallback,
        showErrorToast = false,
    } = options;

    const query = useQuery({
        queryKey: queryKeys.realms.detail(realmId || ""),
        queryFn: async () => {
            if (!realmId) {
                throw new Error("Realm ID is required");
            }
            const response = await getRealm(realmId);
            return response.data;
        },
        enabled: enabled && !!realmId,
        staleTime,
        gcTime: cacheTime,
        refetchOnWindowFocus,
        refetchOnMount,
        retry,
    });

    // Handle onSuccess side effect
    useEffect(() => {
        if (query.isSuccess && query.data && onSuccessCallback) {
            onSuccessCallback(query.data);
        }
    }, [query.isSuccess, query.data, onSuccessCallback]);

    // Handle onError side effect
    useEffect(() => {
        if (query.isError && query.error) {
            const error = query.error as ApiError;

            if (onErrorCallback) {
                onErrorCallback(error);
            }

            if (showErrorToast) {
                const errorMessage =
                    error.message ||
                    error.error ||
                    "Failed to load realm. Please try again.";

                toast.error("Failed to Load Realm", {
                    description: errorMessage,
                    duration: 5000,
                });
            }
        }
    }, [query.isError, query.error, onErrorCallback, showErrorToast]);

    return {
        /**
         * Realm data
         */
        realm: query.data?.realm,

        /**
         * Full response data
         */
        data: query.data,

        /**
         * Query status
         */
        status: query.status,

        /**
         * Whether query is currently fetching
         */
        isLoading: query.isLoading,

        /**
         * Whether query is currently refetching
         */
        isRefetching: query.isRefetching,

        /**
         * Whether query completed successfully
         */
        isSuccess: query.isSuccess,

        /**
         * Whether query failed
         */
        isError: query.isError,

        /**
         * Error object
         */
        error: query.error as ApiError | null,

        /**
         * Manually refetch the realm
         */
        refetch: query.refetch,
    };
};
