/**
 * useChatMessages Hook
 * GET /api/v1/chats/:id/messages - List messages for a chat
 */
"use client";

import { useQuery } from "@tanstack/react-query";
import { listMessages } from "@/lib/api/chats";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { ListMessagesParams } from "@/lib/api/chats";
import type { ApiError } from "@/lib/api/shared/types";

interface UseChatMessagesOptions {
  chatId: string | undefined;
  params?: ListMessagesParams;
  enabled?: boolean;
}

export const useChatMessages = (options: UseChatMessagesOptions) => {
  const { chatId, params = {}, enabled = true } = options;

  const query = useQuery({
    queryKey: queryKeys.chats.messages(chatId ?? ""),
    queryFn: async () => {
      if (!chatId) throw new Error("Chat ID is required");
      const response = await listMessages(chatId, {
        ...params,
        sortOrder: params.sortOrder ?? "asc",
      });
      // ApiResponse<T> has { success, data: T, message } - return data for direct access
      return response.data;
    },
    enabled: !!chatId && enabled,
    staleTime: 30 * 1000,
  });

  // ApiResponse = { success, data: { messages, pagination }, message }
  const apiResponse = query.data as { data?: { messages?: unknown[]; pagination?: unknown } } | undefined;
  const listData = apiResponse?.data;
  return {
    messages: listData?.messages ?? [],
    pagination: listData?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as ApiError | null,
    refetch: query.refetch,
  };
};
