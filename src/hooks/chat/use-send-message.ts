/**
 * useSendMessage Hook
 * POST /api/v1/chats/:id/messages - Send message to LLM with streaming support
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { flushSync } from "react-dom";
import { toast } from "sonner";
import { sendMessage, streamMessage } from "@/lib/api/chats";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { SendMessageRequest, SendMessageResponse } from "@/lib/api/chats";
import type { ApiError } from "@/lib/api/shared/types";
import { useState, useCallback, useRef, useEffect } from "react";

interface UseSendMessageOptions {
  chatId: string | undefined;
  onSuccess?: (data: SendMessageResponse) => void;
  onError?: (error: ApiError) => void;
  showToasts?: boolean;
}

export const useSendMessage = (options: UseSendMessageOptions) => {
  const { chatId, onSuccess: onSuccessCallback, onError: onErrorCallback, showToasts = true } = options;
  const queryClient = useQueryClient();

  // Streaming state
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation({
    mutationFn: async (body: SendMessageRequest) => {
      if (!chatId) throw new Error("Chat ID is required");
      const response = await sendMessage(chatId, body);
      return response.data;
    },
    onSuccess: (data) => {
      if (chatId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.chats.messages(chatId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.chats.all });
      }
      onSuccessCallback?.(data);
    },
    onError: (error: unknown) => {
      const apiErr = error as ApiError;
      if (showToasts) {
        toast.error("Failed to send message", {
          description: apiErr.message || apiErr.error || "Please try again.",
          duration: 5000,
        });
      }
      onErrorCallback?.(apiErr);
    },
  });

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setIsPaused(false);
    setStreamingContent("");
  }, []);

  const pauseStreaming = useCallback(() => {
    if (abortControllerRef.current && isStreaming) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsPaused(true);
      setIsStreaming(false);
    }
  }, [isStreaming]);

  // Cleanup: Stop streaming when chatId changes or component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setIsStreaming(false);
      setIsPaused(false);
      setStreamingContent("");
    };
  }, [chatId]);

  const streamMessageAsync = useCallback(
    async (body: SendMessageRequest): Promise<void> => {
      if (!chatId) throw new Error("Chat ID is required");

      // Cancel any existing stream
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setIsStreaming(true);
      setIsPaused(false);
      setStreamingContent("");

      try {
        await streamMessage(
          chatId,
          body,
          {
            onChunk: (content: string) => {
              if (abortController.signal.aborted) return;
              // Force immediate DOM update so each token paints (avoids React batching)
              flushSync(() => {
                setStreamingContent((prev) => prev + content);
              });
            },
            onDone: (messageId, usage) => {
              setIsStreaming(false);
              setIsPaused(false);
              setStreamingContent("");
              abortControllerRef.current = null;

              if (chatId) {
                queryClient.invalidateQueries({ queryKey: queryKeys.chats.messages(chatId) });
                queryClient.invalidateQueries({ queryKey: queryKeys.chats.all });
              }
            },
            onError: (error) => {
              setIsStreaming(false);
              setIsPaused(false);
              setStreamingContent("");
              abortControllerRef.current = null;

              // Don't show error toast for user cancellation
              if (error.message !== "Stream cancelled" && showToasts) {
                toast.error("Failed to send message", {
                  description: error.message || "Please try again.",
                  duration: 5000,
                });
              }
              onErrorCallback?.({ success: false, error: error.message, statusCode: 500 });
            },
          },
          abortController.signal
        );
      } catch (error) {
        setIsStreaming(false);
        setIsPaused(false);
        setStreamingContent("");
        abortControllerRef.current = null;
        throw error;
      }
    },
    [chatId, queryClient, showToasts, onErrorCallback]
  );

  return {
    sendMessage: mutation.mutate,
    sendMessageAsync: mutation.mutateAsync,
    streamMessageAsync,
    stopStreaming,
    pauseStreaming,
    isSending: mutation.isPending,
    isStreaming,
    isPaused,
    streamingContent,
    error: mutation.error as ApiError | null,
    data: mutation.data,
  };
};
