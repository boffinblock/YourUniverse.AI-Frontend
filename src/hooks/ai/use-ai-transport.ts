"use client";

import { useMemo } from "react";
import { createChatTransport, type EditContextRef } from "@/lib/ai";

/**
 * Memoized AI chat transport for useChat.
 * Recreates only when chatId changes.
 */
export function useAITransport(
  chatId?: string,
  editContextRef?: EditContextRef
) {
  return useMemo(
    () => createChatTransport(chatId, editContextRef),
    [chatId, editContextRef]
  );
}
