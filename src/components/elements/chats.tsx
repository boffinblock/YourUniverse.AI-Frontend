"use client";

import ChatMessages from "./chat-messages";
import ChatPanel from "./chat-panel";
import { useAIChat } from "@/hooks/ai/use-ai-chat";
import { useCreateChat } from "@/hooks/chat";
import { useGetChat } from "@/hooks/chat/use-get-chat";
import { useCallback } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { toast } from "sonner";

interface Props {
    setActivePreview?: (value: "character" | "persona" | null) => void;
    chatId?: string;
}

const Chats: React.FC<Props> = ({ setActivePreview, chatId }) => {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams<{ id?: string; chatid?: string; char_id?: string }>();
    const { chat } = useGetChat({ chatId });
    const { createChatAsync } = useCreateChat({ showToasts: false });

    const {
        messages,
        send,
        reload,
        stop,
        error,
        status,
        apiMessages,
    } = useAIChat({
        chatId,
    });

    const handleStartNewChat = useCallback(async () => {
        if (!chat) {
            toast.error("Could not load chat details");
            return;
        }
        try {
            const res = await createChatAsync({
                characterId: chat.characterId ?? undefined,
                modelId: chat.modelId ?? undefined,
                folderId: chat.folderId ?? undefined,
            });
            const newChatId = (res as { data?: { chat?: { id: string } } })?.data?.chat?.id;
            if (!newChatId) {
                toast.error("Failed to create chat");
                return;
            }
            const isFolderContext = pathname?.includes("/folders/") && pathname?.includes("/c/");
            const isCharacterContext = pathname?.includes("/chat/") && pathname?.includes("/char/");
            if (isFolderContext && params?.id) {
                router.push(`/folders/${params.id}/c/${newChatId}`);
            } else if (isCharacterContext && (chat.characterId ?? params?.char_id)) {
                router.push(`/chat/${newChatId}/char/${chat.characterId ?? params?.char_id}`);
            } else {
                router.push(`/chat/${newChatId}/char/${chat.characterId ?? ""}`);
            }
        } catch {
            toast.error("Failed to create chat");
        }
    }, [chat, createChatAsync, pathname, params, router]);

    const handleStartWorkOnToday = useCallback((messageId: string, content?: string) => {
        toast.info("Start a work on today", {
            description: content ? `Message: ${content.slice(0, 80)}...` : undefined,
        });
    }, []);

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
                apiMessages={apiMessages}
                isSending={status === "submitted"}
                isStreaming={status === "streaming"}
                error={error}
                chatId={chatId}
                onReload={reload}
                onStartNewChat={handleStartNewChat}
                onStartWorkOnToday={handleStartWorkOnToday}
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