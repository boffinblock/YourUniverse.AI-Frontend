"use client";

import ChatMessages from "./chat-messages";
import ChatPanel from "./chat-panel";
import { useAIChat } from "@/hooks/ai/use-ai-chat";
import { useCreateChat } from "@/hooks/chat";
import { useGetChat } from "@/hooks/chat/use-get-chat";
import { useGetCharacter } from "@/hooks";
import { useCallback, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { toast } from "sonner";
import Container from "./container";
import { cn } from "@/lib/utils";
import CharacterPreview from "./character-preview";
import PersonaPreview from "./persona-preview";

interface Props {
    setActivePreview?: (value: "character" | "persona" | null) => void;
    chatId?: string;
}

const Chats: React.FC<Props> = ({ setActivePreview: setActivePreviewProp, chatId }) => {
    const [activePreview, setActivePreview] = useState<'character' | 'persona' | null>(null);

    const isCharacterPreview = activePreview === 'character';
    const isPersonaPreview = activePreview === 'persona';

    const router = useRouter();
    const pathname = usePathname();
    const params = useParams<{ id?: string; chatid?: string; char_id?: string }>();
    const { chat } = useGetChat({ chatId });
    const { character } = useGetCharacter(chat?.characterId ?? undefined, {
        enabled: !!chat?.characterId,
    });
    const { createChatAsync } = useCreateChat({ showToasts: false });

    const {
        messages,
        send,
        reload,
        edit,
        removeMessage,
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

    const handleSubmit = useCallback(
        (message: PromptInputMessage) => {
            send(message);
        },
        [send]
    );

    return (

        <ResizablePanelGroup
            orientation="horizontal"
            className="min-h-[200px]  rounded-lg  md:min-w-[450px]"
        >
            <ResizablePanel defaultSize={isCharacterPreview || isPersonaPreview ? "80%" : "100%"}>
                <Container className={cn('h-full w-full', (isCharacterPreview || isPersonaPreview) && "float-right")} >
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
                            onEditMessage={edit}
                            onDeleteMessage={removeMessage}
                            onStartNewChat={handleStartNewChat}
                            authorNotes={character?.authorNotes}
                            characterNotes={character?.characterNotes}
                            characterName={character?.name}
                            characterAvatar={character?.avatar?.url}
                        />

                        <ChatPanel
                            chatId={chatId}
                            onSubmit={handleSubmit}
                            stop={stop}
                            status={status}
                        />
                    </div>
                </Container>
            </ResizablePanel>

            {(isCharacterPreview || isPersonaPreview) && (
                <ResizableHandle withHandle className="bg-primary" />
            )}
            {(isCharacterPreview || isPersonaPreview) && (
                <ResizablePanel defaultSize="20%">
                    {isCharacterPreview && (
                        <CharacterPreview
                            characterId={chat?.characterId ?? undefined}
                            onClose={() => setActivePreview(null)}
                        />
                    )}
                    {isPersonaPreview && (
                        <PersonaPreview
                            personaId={character?.persona?.id}
                            onClose={() => setActivePreview(null)}
                        />
                    )}
                </ResizablePanel>
            )}

        </ResizablePanelGroup>

    );
};

export default Chats;