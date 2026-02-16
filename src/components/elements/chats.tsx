"use client";

import ChatMessages from "./chat-messages";
import ChatPanel from "./chat-panel";
import { useAIChat } from "@/hooks/ai/use-ai-chat";
import { toast } from "sonner";

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