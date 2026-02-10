"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import { useCallback, useEffect, useMemo } from "react";
import { getAccessToken } from "@/lib/utils/token-storage";

export type ApiMessageLike = { id: string; role: string; content: string };

interface UseSendMessageOptions {
  chatId: string | undefined;
  /** Initial messages from API (GET /chats/:id/messages). Synced into useChat when provided. */
  initialMessages?: ApiMessageLike[];
  /** Call when stream finishes so parent can refetch messages. */
  onStreamFinish?: () => void;
  showToasts?: boolean;
}

function apiMessagesToUIMessages(api: ApiMessageLike[]) {
  return api.map((m) => ({
    id: m.id,
    role: m.role as "user" | "assistant" | "system",
    parts: [{ type: "text" as const, text: m.content }],
  }));
}

export function useSendMessage(options: UseSendMessageOptions) {
  const { chatId, initialMessages = [], onStreamFinish, showToasts = false } = options;

  const transport = useMemo(
    () =>
      new TextStreamChatTransport({
        api: "/api/chat/stream",
        credentials: "include",
        body: chatId ? { chatId } : undefined,
        fetch: (url, init) => {
          const token = getAccessToken();
          const headers = new Headers(init?.headers);
          if (token) headers.set("Authorization", `Bearer ${token}`);
          return fetch(url, { ...init, headers });
        },
      }),
    [chatId]
  );

  const initialUIMessages = useMemo(
    () => apiMessagesToUIMessages(initialMessages),
    [initialMessages]
  );

  const {
    messages,
    setMessages,
    sendMessage,
    stop,
    status,
    error,
    clearError,
  } = useChat({
    id: chatId ?? "no-chat",
    transport,
    messages: initialUIMessages as never,
    onFinish: () => {
      onStreamFinish?.();
    },
    onError: (err) => {
      if (showToasts) {
        try {
          const msg = err?.message ?? "Something went wrong";
          if (typeof window !== "undefined" && "toast" in window) {
            (window as { toast?: (opts: { description?: string }) => void }).toast?.({ description: msg });
          }
        } catch {
          console.error(err);
        }
      }
    },
    experimental_throttle: undefined,
  });

  useEffect(() => {
    if (!chatId || initialMessages.length === 0) return;
    setMessages(apiMessagesToUIMessages(initialMessages) as never);
  }, [chatId, setMessages, initialMessages]);

  const streamMessageAsync = useCallback(
    async (opts: { content: string; role?: string }) => {
      if (!chatId) return;
      await sendMessage({ text: opts.content });
    },
    [chatId, sendMessage]
  );

  const isStreaming = status === "streaming";
  const isSending = status === "submitted" || status === "streaming";
  const lastMessage = messages[messages.length - 1];
  const streamingContent =
    isStreaming && lastMessage?.role === "assistant"
      ? (lastMessage.parts?.find((p) => p.type === "text") as { text?: string } | undefined)?.text ?? ""
      : undefined;

  return {
    messages,
    streamMessageAsync,
    stopStreaming: stop,
    pauseStreaming: () => { },
    isSending,
    isStreaming,
    isPaused: false,
    streamingContent,
    error,
    clearError,
    setMessages,
  };
}
