"use client";

import ChatMessages from "./chat-messages";
import ChatPanel from "./chat-panel";
import { useAIChat } from "@/hooks/ai/use-ai-chat";

interface Props {
    setActivePreview?: (value: "character" | "persona" | null) => void;
    chatId?: string;
}

const Chats: React.FC<Props> = ({ setActivePreview = () => { }, chatId }) => {
    const {
        messages,
        send,
        stop,
        regenerate,
        error,
        status,
        isLoadingHistory,
    } = useAIChat(chatId);

    return (
        <div className="flex h-full flex-1 flex-col min-h-0">
            <ChatMessages
                setActivePreview={setActivePreview}
                messagesFromUseChat={messages}
                isLoading={isLoadingHistory}
                isSending={status === "submitted"}
                isStreaming={status === "streaming"}
                error={error}
                onRegenerate={regenerate}
            />

            <ChatPanel
                handleSubmit={send}
                onStop={stop}
                disabled={!chatId}
                isStreaming={status === "streaming"}
                isSending={status === "submitted"}
            />
        </div>
    );
};

export default Chats;