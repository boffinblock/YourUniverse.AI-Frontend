/**
 * useRealmChats Hook
 * GET /api/v1/realms/:realmId/chats - List chats for a realm
 */
"use client";

import { useQuery } from "@tanstack/react-query";
import {
  listRealmChats,
  type RealmChatListResponse,
} from "@/lib/api/realms/realm-chats";
import { queryKeys } from "@/lib/api/shared/query-keys";

interface UseRealmChatsOptions {
  realmId: string | undefined;
  params?: {
    page?: number;
    limit?: number;
    sortBy?: "createdAt" | "updatedAt";
    sortOrder?: "asc" | "desc";
  };
  enabled?: boolean;
}

export function useRealmChats(options: UseRealmChatsOptions) {
  const { realmId, params, enabled = true } = options;

  const query = useQuery({
    queryKey: queryKeys.realms.realmChatList(realmId ?? "", params),
    queryFn: async () => {
      if (!realmId) throw new Error("Realm ID is required");
      const response = await listRealmChats(realmId, params);
      const inner = (response as { data?: RealmChatListResponse }).data;
      return inner ?? { chats: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };
    },
    enabled: !!realmId && enabled,
  });

  return {
    chats: query.data?.chats ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
