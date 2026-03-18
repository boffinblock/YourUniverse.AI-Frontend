/**
 * useRealmChatMessages Hook
 * GET /api/v1/realms/:realmId/chats/:chatId/messages
 */
"use client";

import { useQuery } from "@tanstack/react-query";
import {
  listRealmChatMessages,
  type ListMessagesParams,
} from "@/lib/api/realms/realm-chats";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { ApiError } from "@/lib/api/shared/types";

interface UseRealmChatMessagesOptions {
  realmId: string | undefined;
  chatId: string | undefined;
  params?: ListMessagesParams;
  enabled?: boolean;
}

export function useRealmChatMessages(options: UseRealmChatMessagesOptions) {
  const { realmId, chatId, params = {}, enabled = true } = options;

  const query = useQuery({
    queryKey: queryKeys.realms.realmChatMessages(realmId ?? "", chatId ?? ""),
    queryFn: async () => {
      if (!realmId || !chatId) throw new Error("Realm ID and Chat ID are required");
      const response = await listRealmChatMessages(realmId, chatId, {
        ...params,
        sortOrder: params.sortOrder ?? "asc",
      });
      return response.data as { messages: unknown[]; pagination: unknown };
    },
    enabled: !!realmId && !!chatId && enabled,
  });

  const listData = query.data;
  return {
    messages: listData?.messages ?? [],
    pagination: listData?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as ApiError | null,
    refetch: query.refetch,
  };
}
