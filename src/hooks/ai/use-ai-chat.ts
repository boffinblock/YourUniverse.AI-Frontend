"use client";

import { useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { useChatMessages } from "@/hooks/chat/use-chat-messages";
import { queryKeys } from "@/lib/api/shared/query-keys";
import { useAITransport } from "./use-ai-transport";
import {
  apiMessagesToUIMessages,
  type ApiMessage,
} from "@/lib/ai";

export interface UseAIChatOptions {
  /** Chat ID - required for sending messages */
  chatId?: string;
  /** Called when a non-recoverable error occurs */
  onError?: (error: Error) => void;
}

export function useAIChat(chatIdOrOptions?: string | UseAIChatOptions) {
  const options: UseAIChatOptions =
    typeof chatIdOrOptions === "string"
      ? { chatId: chatIdOrOptions }
      : chatIdOrOptions ?? {};
  const { chatId, onError } = options;
  const queryClient = useQueryClient();

  // 1. Load persisted messages (React Query)
  const { messages: apiMessages, isLoading } = useChatMessages({
    chatId,
    params: { limit: 100, sortOrder: "asc" },
    enabled: !!chatId,
  });

  // 2. Convert to AI SDK UIMessage format for useChat initial state
  const initialMessages = useMemo(
    () => apiMessagesToUIMessages(apiMessages as ApiMessage[]),
    [apiMessages]
  );

  // 3. Transport (custom backend with dynamic auth)
  const transport = useAITransport(chatId);

  // 4. AI SDK useChat
  const chat = useChat({
    id: chatId,
    messages: initialMessages,
    transport,
    onFinish: () => {
      if (!chatId) return;
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats.messages(chatId),
      });
    },
    onError: (err) => {
      onError?.(err);
    },
  });

  const send = (text: string) => {
    if (!text.trim() || !chatId) return;
    chat.sendMessage({ text });
  };

  return {
    ...chat,
    send,
    isLoadingHistory: isLoading,
  };
}
