/**
 * useListChats Hook
 * GET /api/v1/chats - List chats with optional filters (folderId, characterId, etc.)
 */
"use client";

import { useQuery } from "@tanstack/react-query";
import { listChats } from "@/lib/api/chats";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { ListChatsParams, ListChatsResponse } from "@/lib/api/chats";
import type { ApiError } from "@/lib/api/shared/types";

interface UseListChatsOptions {
  filters?: ListChatsParams;
  enabled?: boolean;
}

export const useListChats = (options: UseListChatsOptions = {}) => {
  const { filters = {}, enabled = true } = options;

  const query = useQuery({
    queryKey: queryKeys.chats.list(filters as Record<string, unknown>),
    queryFn: async () => {
      const response = await listChats(filters);
      return response.data;
    },
    enabled,
    staleTime: 60 * 1000,
  });

  return {
    chats: query.data?.chats ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as ApiError | null,
    refetch: query.refetch,
  };
};
