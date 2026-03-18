"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { toast } from "sonner";
import { createRealmChatTransport } from "@/lib/ai";
import { apiMessagesToUIMessages } from "@/lib/ai";
import { useRealmChatMessages } from "./use-realm-chat-messages";
import { listRealmChatMessages, regenerateRealmChatMessage } from "@/lib/api/realms/realm-chats";
import type { ApiMessage } from "@/lib/api/chats/types";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";

const HISTORY_LIMIT = 100;

export interface UseRealmAIChatOptions {
  realmId: string | undefined;
  chatId: string | undefined;
  onError?: (error: Error) => void;
}

/**
 * Realm AI chat: loads messages from realm chat API and sends via realm message endpoint.
 */
export function useRealmAIChat(options: UseRealmAIChatOptions) {
  const { realmId, chatId, onError } = options;

  const transport = useMemo(
    () => createRealmChatTransport(realmId, chatId),
    [realmId, chatId]
  );

  const {
    messages: apiMessages,
    isLoading: isLoadingHistory,
    refetch: refetchMessages,
  } = useRealmChatMessages({
    realmId,
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

  const prevStatusRef = React.useRef<string | undefined>(undefined);
  useEffect(() => {
    const prev = prevStatusRef.current;
    prevStatusRef.current = chat.status;
    if (prev === "streaming" && chat.status === "ready") {
      refetchMessages();
    }
  }, [chat.status, refetchMessages]);

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

  const reload = useCallback(
    async (messageId: string) => {
      if (!realmId || !chatId) return;
      try {
        await regenerateRealmChatMessage(realmId, chatId, messageId);
        const response = await listRealmChatMessages(realmId, chatId, {
          sortOrder: "asc",
          limit: HISTORY_LIMIT,
        });
        const freshMessages = (response as { data?: { messages?: ApiMessage[] } })?.data?.messages ?? [];
        chat.setMessages(
          apiMessagesToUIMessages(freshMessages as ApiMessage[]) as UIMessage[]
        );
        refetchMessages();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const friendlyMsg = msg.toLowerCase().includes("not found")
          ? "Message not found. The chat may have changed. Please refresh and try again."
          : msg;
        toast.error(friendlyMsg);
        onError?.(err instanceof Error ? err : new Error(msg));
        throw err;
      }
    },
    [realmId, chatId, chat.setMessages, refetchMessages, onError]
  );

  return {
    ...chat,
    send,
    reload,
    isLoadingHistory,
    apiMessages: apiMessages as ApiMessage[],
  };
}
