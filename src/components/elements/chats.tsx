"use client";

import ChatMessages from "./chat-messages";
import ChatPanel from "./chat-panel";
import { useAIChat } from "@/hooks/ai/use-ai-chat";
import { useCallback } from "react";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";

interface Props {
    setActivePreview?: (value: "character" | "persona" | null) => void;
    chatId?: string;
}

const Chats: React.FC<Props> = ({ setActivePreview, chatId }) => {
    const {
        messages,
        send,
        stop,
        error,
        status,
    } = useAIChat({
        chatId,
        // onError: () => {
        //     toast.error("Something went wrong", {
        //         description: "The AI response failed. Please try again.",
        //     });
        // },
    });

    const handleSubmit = useCallback(
        (message: PromptInputMessage) => {
            send(message);
        },
        [send]
    );

    return (
        <div className="h-full min-h-0 flex-1 flex flex-col relative">
            <ChatMessages
                setActivePreview={setActivePreview}
                messages={messages}
                isSending={status === "submitted"}
                isStreaming={status === "streaming"}
                error={error}
                chatId={chatId}
            />

            <ChatPanel
                chatId={chatId}
                onSubmit={handleSubmit}
                stop={stop}
                status={status}
            />
        </div>
    );
};

export default Chats;