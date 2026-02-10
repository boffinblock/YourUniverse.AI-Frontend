"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Folder, MoreVertical, Pencil, Trash2 } from "lucide-react";
import ChatPanel from "@/components/elements/chat-panel";
import Container from "@/components/elements/container";
import Footer from "@/components/layout/footer";
import { useGetFolder } from "@/hooks/folder";
import { useCreateChat, useDeleteChat, useListChats } from "@/hooks/chat";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LinkToField from "@/components/elements/link-to-field";
import type { Chat } from "@/lib/api/chats";
import { toast } from "sonner";

const FOLDER_ID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

function getFolderIdFromParam(param: string | undefined): string | undefined {
  if (!param) return undefined;
  const match = param.match(FOLDER_ID_REGEX);
  return match ? match[0] : param;
}

function formatChatDate(iso: string): string {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function FolderPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const folderId = getFolderIdFromParam(params?.id);

  const [title, setTitle] = useState("");
  const [characterId, setCharacterId] = useState<string | undefined>();
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);
  const [selectCharacterDialogOpen, setSelectCharacterDialogOpen] = useState(false);
  const [dialogCharacterId, setDialogCharacterId] = useState<string | undefined>();

  const { folder, isLoading } = useGetFolder({ folderId });
  const { chats, isLoading: chatsLoading, refetch } = useListChats({
    filters: { folderId: folderId ?? "", sortBy: "updatedAt", sortOrder: "desc" },
    enabled: !!folderId,
  });
  const { createChatAsync } = useCreateChat({ showToasts: false });
  const { deleteChatAsync, isDeleting } = useDeleteChat({ showToasts: true });

  const folderName = folder?.name ?? "Folder";

  const handleConfirmDeleteChat = useCallback(async () => {
    if (!chatToDelete) return;
    try {
      await deleteChatAsync(chatToDelete.id);
      setChatToDelete(null);
      refetch();
    } catch {
      // Error handled by hook
    }
  }, [chatToDelete, deleteChatAsync, refetch]);

  const handleCreateChat = useCallback(async () => {
    if (!folderId) return;
    if (!characterId) {
      setDialogCharacterId(undefined);
      setSelectCharacterDialogOpen(true);
      return;
    }
    try {
      const res = await createChatAsync({
        title: title || undefined,
        characterId: characterId ?? undefined,
        folderId,
      });
      if (res?.chat?.id) {
        refetch();
        router.push(`/folders/${folderId}/c/${res.chat.id}`);
      }
    } catch {
      // Error handled by hook
    }
  }, [folderId, title, characterId, createChatAsync, refetch, router]);

  const handleConfirmSelectCharacter = useCallback(async () => {
    const idToUse = dialogCharacterId;
    if (!idToUse) {
      toast.error("Please select a character first, then continue chatting");
      return;
    }
    setSelectCharacterDialogOpen(false);
    setCharacterId(idToUse);
    if (!folderId) return;
    try {
      const res = await createChatAsync({
        title: title || undefined,
        characterId: idToUse,
        folderId,
      });
      if (res?.chat?.id) {
        refetch();
        router.push(`/folders/${folderId}/c/${res.chat.id}`);
      }
    } catch {
      // Error handled by hook
    }
  }, [dialogCharacterId, folderId, title, createChatAsync, refetch, router]);

  const chatListSlug = folderId && folderName ? `${folderId}-${folderName.toLowerCase().replace(/\s+/g, "-")}` : "";

  return (
    <div className="flex-1 flex flex-col relative">
      <div className="flex-1">
        <Container className="h-full w-full pt-20">
          <div className={cn("flex-1 flex flex-col relative h-full", !chatsLoading && chats.length === 0 && "pt-40")}>
            <div className="flex gap-x-2 items-center text-3xl min-w-0 mb-4">
              <Folder className="text-white shrink-0" />
              {isLoading ? (
                <Skeleton className="h-8 w-48 bg-white/10 rounded" />
              ) : (
                <h4 className="text-white font-thin truncate">{folderName}</h4>
              )}
            </div>

            <div className="mb-6">
              <ChatPanel
                footer={false}
                placeholder={`New chat in ${folderName}`}
                characterSelection
                onChange={setTitle}
                onSelectchar={setCharacterId}
                handleSubmit={handleCreateChat}
              />
            </div>

            {chatsLoading && (
              <div className="mt-4 space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg bg-white/10" />
                ))}
              </div>
            )}
            {!chatsLoading && chats.length > 0 && folderId && (
              <div className="mt-4">
                <ul className="divide-y divide-primary/60">
                  {chats.map((chat) => (
                    <li
                      key={chat.id}
                      className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-3 px-2 hover:bg-primary/30 hover:backdrop-blur-2xl transition-colors rounded-lg"
                    >
                      <Link
                        href={chatListSlug ? `/folders/${chatListSlug}/c/${chat.id}` : "#"}
                        className="min-w-0 flex-1"
                      >
                        <p className="font-medium text-white truncate group-hover:text-white">
                          {chat.title || "New chat"}
                        </p>
                        <p className="text-sm text-white/60 truncate mt-0.5">
                          {chat.messageCount ? `${chat.messageCount} message${chat.messageCount !== 1 ? "s" : ""}` : ""}
                        </p>
                      </Link>
                      <div className="flex items-center gap-1 shrink-0 mt-1 sm:mt-0">
                        <span className="text-xs text-white/80 group-hover:hidden">
                          {formatChatDate(chat.updatedAt)}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                className="h-6 w-6 text-white/80 hover:text-white hover:bg-white/10"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-[#1a1a1a] border-white/10 text-white"
                            >
                              <DropdownMenuItem className="cursor-pointer text-xs flex items-center gap-2 hover:bg-white/10">
                                <Pencil className="h-3 w-3" /> Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer text-xs flex items-center gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setChatToDelete(chat);
                                }}
                              >
                                <Trash2 className="h-3 w-3" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="w-full absolute bottom-0">
              <Footer />
            </div>
          </div>
        </Container>
      </div>

      <AlertDialog open={!!chatToDelete} onOpenChange={(open) => !open && setChatToDelete(null)}>
        <AlertDialogContent className="bg-primary/20 backdrop-blur-sm border-primary text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete chat</AlertDialogTitle>
            <AlertDialogDescription>
              {chatToDelete
                ? `Are you sure you want to delete "${chatToDelete.title || "New chat"}"? This cannot be undone.`
                : "This chat will be permanently deleted."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-white/80">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDeleteChat();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={selectCharacterDialogOpen} onOpenChange={setSelectCharacterDialogOpen}>
        <DialogContent className="bg-primary/20 backdrop-blur-sm border-primary text-white rounded-4xl">
          <DialogHeader>
            <DialogTitle className="text-white">Select a character</DialogTitle>
            <DialogDescription className="text-white/80">
              Please select a character first, then continue chatting.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <LinkToField
              model="character"
              label="Character"
              placeholder="Search and select a character..."
              className="bg-transparent"
              value={dialogCharacterId ? [dialogCharacterId] : []}
              onValueChange={(v) => setDialogCharacterId(v?.[0])}
              multiSelect={false}
              maxCount={1}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => setSelectCharacterDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleConfirmSelectCharacter}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
