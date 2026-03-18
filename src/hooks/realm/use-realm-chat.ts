/**
 * useRealmChat Hook
 * GET /api/v1/realms/:realmId/chats/:chatId - Get one realm chat
 */
"use client";

import { useQuery } from "@tanstack/react-query";
import { getRealmChat } from "@/lib/api/realms/realm-chats";
import { queryKeys } from "@/lib/api/shared/query-keys";

interface UseRealmChatOptions {
  realmId: string | undefined;
  chatId: string | undefined;
  enabled?: boolean;
}

export function useRealmChat(options: UseRealmChatOptions) {
  const { realmId, chatId, enabled = true } = options;

  const query = useQuery({
    queryKey: queryKeys.realms.realmChatDetail(realmId ?? "", chatId ?? ""),
    queryFn: async () => {
      if (!realmId || !chatId) throw new Error("Realm ID and Chat ID are required");
      const response = await getRealmChat(realmId, chatId);
      return response.data;
    },
    enabled: !!realmId && !!chatId && enabled,
  });

  return {
    chat: query.data?.chat ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
