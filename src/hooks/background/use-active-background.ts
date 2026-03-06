/**
 * useActiveBackground Hook
 * Detects the current page context and fetches the prioritized background:
 * 1. Entity-specific background (linked to character, persona, or realm)
 * 2. User's global default background
 * 3. Fallback to stars (returns null background)
 */
"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, usePathname } from "next/navigation";
import { listBackgrounds } from "@/lib/api/backgrounds";
import { queryKeys } from "@/lib/api/shared/query-keys";
import { useCurrentUser } from "@/hooks/user/use-current-user";

export const useActiveBackground = () => {
    const { user } = useCurrentUser();
    const params = useParams();
    const pathname = usePathname();

    // Identify current context from URL
    const charId = params?.id && pathname.includes("/characters/") ? params.id as string : null;
    const persId = params?.id && pathname.includes("/personas/") ? params.id as string : null;
    const rlmId = params?.id && pathname.includes("/realms/") ? params.id as string : null;

    const query = useQuery({
        // Key is sensitive to user, context IDs, and type
        queryKey: [...queryKeys.backgrounds.all, "active", user?.id, charId, persId, rlmId],
        queryFn: async () => {
            if (!user?.id) return null;

            // 1. Check for context-specific background
            if (charId || persId || rlmId) {
                const contextFilters = {
                    characterId: charId || undefined,
                    personaId: persId || undefined,
                    realmId: rlmId || undefined,
                    limit: 1,
                };

                const contextResponse = await listBackgrounds(contextFilters);
                if (contextResponse.data.backgrounds.length > 0) {
                    return contextResponse.data.backgrounds[0];
                }
            }

            // 2. Fallback to Global Default background
            const globalResponse = await listBackgrounds({ isGlobalDefault: true, limit: 1 });
            return globalResponse.data.backgrounds[0] || null;
        },
        enabled: !!user?.id,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: true,
    });

    return {
        background: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
};
