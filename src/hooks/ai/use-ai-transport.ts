"use client";

import { useMemo } from "react";
import { createChatTransport } from "@/lib/ai";

/**
 * Memoized AI chat transport for useChat.
 * Recreates only when chatId changes.
 */
export function useAITransport(chatId?: string) {
  return useMemo(() => createChatTransport(chatId), [chatId]);
}
