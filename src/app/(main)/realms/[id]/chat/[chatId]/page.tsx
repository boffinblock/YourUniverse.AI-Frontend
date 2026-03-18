"use client";

import { useParams } from "next/navigation";
import RealmChat from "@/components/realms/realm-chat";
import Container from "@/components/elements/container";
import { useRealmChat } from "@/hooks/realm";
import { Skeleton } from "@/components/ui/skeleton";

export default function RealmChatPage() {
  const params = useParams<{ id: string; chatId: string }>();
  const realmId = params?.id;
  const chatId = params?.chatId;

  const { chat, isLoading, isError } = useRealmChat({
    realmId,
    chatId,
  });

  if (!realmId || !chatId) {
    return (
      <div className="flex-1 h-full flex items-center justify-center">
        <Container className="h-full w-full">
          <p className="text-destructive">Invalid realm or chat</p>
        </Container>
      </div>
    );
  }

  if (isError || (!isLoading && !chat)) {
    return (
      <div className="flex-1 h-full flex items-center justify-center">
        <Container className="h-full w-full">
          <p className="text-destructive">Chat not found</p>
        </Container>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 h-full">
        <Container className="h-full w-full">
          <div className="space-y-4 py-8">
            <Skeleton className="h-8 w-48 bg-white/10 rounded" />
            <Skeleton className="h-64 w-full bg-white/10 rounded" />
          </div>
        </Container>
      </div>
    );
  }

  return <RealmChat realmId={realmId} chatId={chatId} />;
}
