"use client";

import ChatMessages from "@/components/elements/chat-messages";
import ChatPanel from "@/components/elements/chat-panel";
import Container from "@/components/elements/container";
import { useGetRealm, useRealmAIChat } from "@/hooks/realm";
import { useCreateRealmChat } from "@/hooks/realm";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { toast } from "sonner";

interface RealmChatProps {
  realmId: string;
  chatId: string;
}

export default function RealmChat({ realmId, chatId }: RealmChatProps) {
  const router = useRouter();
  const { realm } = useGetRealm(realmId);
  const { createRealmChatAsync } = useCreateRealmChat({ realmId, showToasts: false });

  const {
    messages,
    send,
    reload,
    stop,
    error,
    status,
    apiMessages,
  } = useRealmAIChat({ realmId, chatId });

  const handleStartNewChat = useCallback(async () => {
    try {
      const res = await createRealmChatAsync({});
      const newChatId = (res as { data?: { chat?: { id: string } } })?.data?.chat?.id ?? (res as { chat?: { id: string } })?.chat?.id;
      if (newChatId) {
        router.push(`/realms/${realmId}/chat/${newChatId}`);
      } else {
        toast.error("Failed to create chat");
      }
    } catch {
      toast.error("Failed to create chat");
    }
  }, [realmId, createRealmChatAsync, router]);

  const handleStartWorkOnToday = useCallback((_messageId: string, _content?: string) => {
    toast.info("Start a work on today");
  }, []);

  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
      send(message);
    },
    [send]
  );

  return (
    <Container className="h-full w-full">
      <div className="h-full min-h-0 flex-1 flex flex-col relative">
        <ChatMessages
          setActivePreview={() => {}}
          messages={messages}
          apiMessages={apiMessages}
          isSending={status === "submitted"}
          isStreaming={status === "streaming"}
          error={error}
          chatId={chatId}
          onReload={reload}
          onStartNewChat={handleStartNewChat}
          onStartWorkOnToday={handleStartWorkOnToday}
          characterName={realm?.name}
        />

        <ChatPanel
          chatId={chatId}
          onSubmit={handleSubmit}
          stop={stop}
          status={status}
        />
      </div>
    </Container>
  );
}
