/**
 * useGlobalDefaultBackground Hook
 * Custom hook for fetching the user's global default background
 */
"use client";

import { useQuery } from "@tanstack/react-query";
import { listBackgrounds } from "@/lib/api/backgrounds";
import { queryKeys } from "@/lib/api/shared/query-keys";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import type { ApiError } from "@/lib/api/shared/types";

export const useGlobalDefaultBackground = () => {
    const { user } = useCurrentUser();

    const query = useQuery({
        queryKey: [...queryKeys.backgrounds.list({ isGlobalDefault: true }), user?.id],
        queryFn: async () => {
            if (!user?.id) return null;
            const response = await listBackgrounds({ isGlobalDefault: true, limit: 1 });
            return response.data.backgrounds[0] || null;
        },
        enabled: !!user?.id,
        staleTime: 30 * 1000, // 30 seconds
        refetchOnWindowFocus: true,
    });

    return {
        background: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
};
