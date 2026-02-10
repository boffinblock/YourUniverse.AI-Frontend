"use client";

import React, { useCallback, useState, useMemo, useEffect } from "react";
import ChatMessages from "./chat-messages";
import ChatPanel from "./chat-panel";
import { useChatMessages, useSendMessage } from "@/hooks/chat";
import type { ApiMessageLike } from "./chat-messages";

interface Props {
    setActivePreview?: (value: "character" | "persona" | null) => void;
    chatId?: string;
}

const Chats: React.FC<Props> = ({ setActivePreview = () => { }, chatId }) => {
    const { messages, isLoading, refetch } = useChatMessages({
        chatId,
        params: { sortOrder: "asc" },
        enabled: !!chatId,
    });

    const {
        streamMessageAsync,
        stopStreaming,
        pauseStreaming,
        isSending,
        isStreaming,
        isPaused,
        streamingContent
    } = useSendMessage({
        chatId,
        showToasts: true,
    });

    // Optimistic user message state
    const [optimisticUserMessage, setOptimisticUserMessage] = useState<ApiMessageLike | null>(null);

    // Clear optimistic message when real message appears in API messages
    useEffect(() => {
        if (optimisticUserMessage && messages) {
            const realMessageExists = messages.some(
                (msg) => msg.role === "user" && msg.content === optimisticUserMessage.content
            );
            if (realMessageExists) {
                setOptimisticUserMessage(null);
            }
        }
    }, [messages, optimisticUserMessage]);

    // Combine API messages with optimistic and streaming messages
    const displayMessages = useMemo(() => {
        const baseMessages = chatId && messages ? messages : [];

        // Check if optimistic message already exists in API messages (to avoid duplicates)
        const optimisticExists = optimisticUserMessage && baseMessages.some(
            (msg) => msg.role === "user" && msg.content === optimisticUserMessage.content
        );

        // Add optimistic user message if present and not already in API messages
        const messagesWithOptimistic = optimisticUserMessage && !optimisticExists
            ? [...baseMessages, optimisticUserMessage]
            : baseMessages;

        return messagesWithOptimistic;
    }, [messages, optimisticUserMessage, chatId]);

    const handleSendMessage = useCallback(
        async (content: string) => {
            if (!content.trim() || !chatId) return;

            const trimmedContent = content.trim();

            // Optimistically add user message to UI immediately
            const tempUserMessage: ApiMessageLike = {
                id: `temp-user-${Date.now()}`,
                role: "user",
                content: trimmedContent,
            };
            setOptimisticUserMessage(tempUserMessage);

            try {
                await streamMessageAsync({ content: trimmedContent, role: "user" });
                // Optimistic message will be cleared when real message appears (via displayMessages logic)
                // Don't clear here to avoid flash - let it be replaced naturally
            } catch (error) {
                // Remove optimistic message on error
                setOptimisticUserMessage(null);
            }
        },
        [chatId, streamMessageAsync]
    );

    const handleStop = useCallback(() => {
        stopStreaming();
        setOptimisticUserMessage(null);
    }, [stopStreaming]);

    const handlePause = useCallback(() => {
        pauseStreaming();
    }, [pauseStreaming]);

    return (
        <div className="flex h-full flex-1 flex-col relative min-h-0">
            <ChatMessages
                setActivePreview={setActivePreview}
                messagesFromApi={displayMessages}
                isLoading={!!chatId && isLoading && !optimisticUserMessage}
                streamingContent={isStreaming ? streamingContent : undefined}
                isStreaming={isStreaming}
            />
            <ChatPanel
                handleSubmit={chatId ? handleSendMessage : undefined}
                placeholder={isSending ? "Sending…" : "Type a message..."}
                isStreaming={isStreaming}
                isPaused={isPaused}
                onStop={isStreaming ? handleStop : undefined}
                onPause={isStreaming ? handlePause : undefined}
            />
        </div>
    );
};

export default Chats;