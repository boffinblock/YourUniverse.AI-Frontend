"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useCreateRealmChat } from "@/hooks/realm";
import { Skeleton } from "@/components/ui/skeleton";
import Container from "@/components/elements/container";

export default function NewRealmChatPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const realmId = params?.id;

  const { createRealmChatAsync, isCreating } = useCreateRealmChat({
    realmId,
    showToasts: false,
  });

  const createAndRedirect = useCallback(async () => {
    if (!realmId) return;
    try {
      const res = await createRealmChatAsync({});
      const newChatId = (res as { data?: { chat?: { id: string } } })?.data?.chat?.id ?? (res as { chat?: { id: string } })?.chat?.id;
      if (newChatId) {
        router.replace(`/realms/${realmId}/chat/${newChatId}`, { scroll: false });
      }
    } catch {
      router.push(`/realms/${realmId}`);
    }
  }, [realmId, createRealmChatAsync, router]);

  useEffect(() => {
    if (!realmId) return;
    createAndRedirect();
  }, [realmId, createAndRedirect]);

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
