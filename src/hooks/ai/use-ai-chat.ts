"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { useAITransport } from "./use-ai-transport";
import { useChatMessages } from "@/hooks/chat/use-chat-messages";
import { apiMessagesToUIMessages } from "@/lib/ai";
import type { ApiMessage } from "@/lib/api/chats/types";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";

const HISTORY_LIMIT = 100;

export interface UseAIChatOptions {
  chatId?: string;
  onError?: (error: Error) => void;
}

/**
 * AI chat with message persistence.
 * Follows [AI SDK UI Chatbot Message Persistence](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-message-persistence):
 * - Loads existing messages via `messages` prop
 * - Uses prepareSendMessagesRequest to send only the last message (backend loads history from DB)
 */
export function useAIChat(chatIdOrOptions?: string | UseAIChatOptions) {
  const options: UseAIChatOptions =
    typeof chatIdOrOptions === "string"
      ? { chatId: chatIdOrOptions }
      : chatIdOrOptions ?? {};

  const { chatId, onError } = options;
  const transport = useAITransport(chatId);
  const { messages: apiMessages, isLoading: isLoadingHistory } = useChatMessages({
    chatId,
    params: { sortOrder: "asc", limit: HISTORY_LIMIT },
  });

  const initialMessages = useMemo(() => {
    const messages = (apiMessages ?? []) as ApiMessage[];
    return apiMessagesToUIMessages(messages) as UIMessage[];
  }, [apiMessages]);

  const chat = useChat({
    id: chatId,
    transport,
    messages: initialMessages,
    onError: (err) => onError?.(err),
  });

  useEffect(() => {
    if (isLoadingHistory || apiMessages.length === 0 || chat.messages.length > 0) return;
    chat.setMessages(apiMessagesToUIMessages(apiMessages as ApiMessage[]) as UIMessage[]);
  }, [isLoadingHistory, apiMessages, chat.messages.length, chat.setMessages]);

  const send = useCallback(
    (message: PromptInputMessage) => {
      const hasText = Boolean(message.text?.trim());
      const hasFiles = Boolean(message.files?.length);

      if (!chatId || (!hasText && !hasFiles)) return;

      chat.sendMessage({
        text: message.text?.trim() || "",
        files: message.files?.length ? message.files : undefined,
      });
    },
    [chatId, chat.sendMessage]
  );

  return {
    ...chat,
    send,
    isLoadingHistory,
  };
}
