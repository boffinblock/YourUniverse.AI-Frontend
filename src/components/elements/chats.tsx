"use client";

import React, { useCallback, useMemo } from "react";
import ChatMessages from "./chat-messages";
import ChatPanel from "./chat-panel";
import { useChatMessages } from "@/hooks/chat";
import { useSendMessage } from "@/hooks/chat/use-send-message";
import type { ApiMessageLike } from "./chat-messages";

interface Props {
    setActivePreview?: (value: "character" | "persona" | null) => void;
    chatId?: string;
}

function uiMessagesToApiLike(messages: { id: string; role: string; parts?: { type: string; text?: string }[] }[]): ApiMessageLike[] {
    return messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: (m.parts?.find((p) => p.type === "text") as { text?: string } | undefined)?.text ?? "",
    }));
}

const Chats: React.FC<Props> = ({ setActivePreview = () => { }, chatId }) => {
    const { messages: apiMessages, isLoading, refetch } = useChatMessages({
        chatId,
        params: { sortOrder: "asc" },
        enabled: !!chatId,
    });

    const {
        messages: chatMessages,
        streamMessageAsync,
        stopStreaming,
        pauseStreaming,
        isSending,
        isStreaming,
        isPaused,
    } = useSendMessage({
        chatId,
        initialMessages: apiMessages,
        onStreamFinish: () => refetch(),
        showToasts: true,
    });

    const displayMessages = useMemo(
        () => (chatId && chatMessages.length > 0 ? uiMessagesToApiLike(chatMessages) : apiMessages),
        [chatId, chatMessages, apiMessages]
    );

    const handleSendMessage = useCallback(
        async (content: string) => {
            if (!content.trim() || !chatId) return;
            await streamMessageAsync({ content: content.trim(), role: "user" });
        },
        [chatId, streamMessageAsync]
    );

    const handleStop = useCallback(() => {
        stopStreaming();
    }, [stopStreaming]);

    const handlePause = useCallback(() => {
        pauseStreaming();
    }, [pauseStreaming]);

    return (
        <div className="flex h-full flex-1 flex-col relative min-h-0">
            <ChatMessages
                setActivePreview={setActivePreview}
                messagesFromApi={displayMessages}
                isLoading={!!chatId && isLoading && chatMessages.length === 0}
                isSending={isSending}
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