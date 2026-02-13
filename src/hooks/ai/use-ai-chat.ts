"use client";

import { useChat } from "@ai-sdk/react";
import { useAITransport } from "./use-ai-transport";

export interface UseAIChatOptions {
  chatId?: string;
  onError?: (error: Error) => void;
}

/**
 * Simple live chat - no history, one-by-one messages only.
 */
export function useAIChat(chatIdOrOptions?: string | UseAIChatOptions) {
  const options: UseAIChatOptions =
    typeof chatIdOrOptions === "string"
      ? { chatId: chatIdOrOptions }
      : chatIdOrOptions ?? {};

  const { chatId, onError } = options;
  const transport = useAITransport(chatId);

  const chat = useChat({
    id: chatId,
    transport,
    onError: (err) => onError?.(err),
  });

  const send = (text: string) => {
    if (!chatId) return;
    if (!text.trim()) return;
    chat.sendMessage({ text });
  };

  return {
    ...chat,
    send,
  };
}
