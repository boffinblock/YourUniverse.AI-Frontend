/**
 * useGetChat Hook
 * GET /api/v1/chats/:id - Get chat by ID
 */
"use client";

import { useQuery } from "@tanstack/react-query";
import { getChat } from "@/lib/api/chats";
import { queryKeys } from "@/lib/api/shared/query-keys";

interface UseGetChatOptions {
  chatId: string | undefined;
  includeMessages?: boolean;
  enabled?: boolean;
}

export const useGetChat = (options: UseGetChatOptions) => {
  const {
    chatId,
    includeMessages = false,
    enabled = true,
  } = options;

  const query = useQuery({
    queryKey: [...queryKeys.chats.detail(chatId ?? ""), { includeMessages }],
    queryFn: async () => {
      if (!chatId) throw new Error("Chat ID is required");
      const response = await getChat(chatId, { includeMessages });
      return response.data;
    },
    enabled: !!chatId && enabled,
  });

  return {
    ...query,
    chat: query.data?.chat ?? null,
  };
};
