/**
 * useListRealms Hook
 * Custom hook for fetching realms with TanStack Query
 */
"use client";

import { useQuery } from "@tanstack/react-query";
import { listRealms } from "@/lib/api/realms";
import { queryKeys } from "@/lib/api/shared/query-keys";

export const useListRealms = (params?: any) => {
    return useQuery({
        queryKey: queryKeys.realms.list(params),
        queryFn: async () => {
            const response = await listRealms(params);
            return response.data;
        },
    });
};
