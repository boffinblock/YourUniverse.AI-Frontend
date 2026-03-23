"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Folder as FolderIcon,
    FolderPlus,
    MoreVertical,
    Pencil,
    Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderModal } from "../modals/create-folder-modal";
import { useListFolders, useCreateFolder, useUpdateFolder, useDeleteFolder, useListChats, useUpdateChat, useDeleteChat, useGetCharacter, useChatMessages } from "@/hooks";
import type { Folder as FolderType } from "@/lib/api/folders";
import type { Chat } from "@/lib/api/chats";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// Skeleton for a single folder row (icon + name)
const FolderRowSkeleton = () => (
    <div className="group px-2 flex items-center justify-between w-full pr-1 py-0.5 rounded-lg">
        <div className="flex items-center gap-2">
            <Skeleton className="h-4.5 w-4.5 shrink-0 rounded bg-white/10" />
            <Skeleton className="h-4 w-24 rounded bg-white/10" />
        </div>
    </div>
);

// Skeleton for folders list (multiple rows)
const FolderListSkeleton = ({ count = 4 }: { count?: number }) => (
    <div className="space-y-1">
        {Array.from({ length: count }).map((_, i) => (
            <FolderRowSkeleton key={i} />
        ))}
    </div>
);

// Skeleton for a single chat item (avatar + name)
const ChatItemSkeleton = () => (
    <div className="flex items-center justify-between px-2 py-1 rounded-lg">
        <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 shrink-0 rounded-full bg-white/10" />
            <Skeleton className="h-4 w-28 rounded bg-white/10" />
        </div>
    </div>
);

// Skeleton for recent chats list
const ChatListSkeleton = ({ count = 5 }: { count?: number }) => (
    <div className="space-y-1">
        {Array.from({ length: count }).map((_, i) => (
            <ChatItemSkeleton key={i} />
        ))}
    </div>
);

const TRUNCATE_LENGTH = 35;

/** Chats with folderId === null (character chats) - shown in "Your Chats" */
const YourChatItem = ({
    chat,
    onRename,
    onDelete,
}: {
    chat: Chat;
    onRename: (chat: Chat) => void;
    onDelete: (chat: Chat) => void;
}) => {
    if (!chat.characterId) return null;

    const { character } = useGetCharacter(chat.characterId, {
        enabled: !!chat.characterId,
        showErrorToast: false,
    });
    const { messages } = useChatMessages({
        chatId: chat.id,
        params: { limit: 10, sortOrder: "asc" },
        enabled: !!chat.id,
    });

    const href = `/chat/${chat.id}/char/${chat.characterId}`;
    const avatarUrl = character?.avatar?.url;
    const fallbackInitial = character?.name?.charAt(0)?.toUpperCase() ?? "?";
    // Prefer explicit chat title (rename) over auto-derived preview text.
    const customTitle = chat.title?.trim();
    const userMessage = (messages as { role?: string; content?: string }[]).find((m) => m.role === "user");
    const messageContent = userMessage?.content?.trim();
    const autoLabel = messageContent
        ? (messageContent.length > TRUNCATE_LENGTH ? `${messageContent.slice(0, TRUNCATE_LENGTH)}…` : messageContent)
        : (character?.name || "Chat");
    const label = customTitle || autoLabel;

    return (
        <div className="group px-2 flex items-center justify-between w-full pr-1 py-1 hover:bg-white/5 rounded-lg">
            <Link href={href} className="flex items-center gap-x-2 min-w-0 flex-1">
                <Avatar className="size-7 shrink-0 brightness-90 group-hover:brightness-100 transition">
                    {avatarUrl ? (
                        <AvatarImage src={avatarUrl} alt={character?.name} className="object-cover" />
                    ) : null}
                    <AvatarFallback className="bg-primary/50 text-white/80 text-xs">
                        {fallbackInitial}
                    </AvatarFallback>
                </Avatar>
                <span className="text-sm text-white/80 cursor-pointer group-hover:text-white transition duration-300 truncate">
                    {label}
                </span>
            </Link>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger
                    asChild
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-white/40 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    >
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10 text-white">
                    <DropdownMenuItem
                        className="hover:bg-white/10 cursor-pointer text-xs flex items-center gap-2"
                        onClick={() => onRename(chat)}
                    >
                        <Pencil className="h-3 w-3" /> Rename title
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        variant="destructive"
                        className="hover:bg-red-500/10 text-red-400 hover:text-red-400 cursor-pointer text-xs flex items-center gap-2"
                        onClick={() => onDelete(chat)}
                    >
                        <Trash2 className="h-3 w-3" /> Delete chat
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

const HistoryDropdown = () => {
    const router = useRouter();
    const [renameModalOpen, setRenameModalOpen] = useState(false);
    const [folderToRename, setFolderToRename] = useState<FolderType | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [folderToDelete, setFolderToDelete] = useState<FolderType | null>(null);

    const [chatRenameDialogOpen, setChatRenameDialogOpen] = useState(false);
    const [chatToRename, setChatToRename] = useState<Chat | null>(null);
    const [chatRenameTitle, setChatRenameTitle] = useState("");
    const [chatDeleteDialogOpen, setChatDeleteDialogOpen] = useState(false);
    const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);

    const { folders, isLoading: foldersLoading, refetch: refetchFolders } = useListFolders({
        filters: { sortBy: "updatedAt", sortOrder: "desc" },
    });

    const { chats, isLoading: chatsLoading, refetch: refetchChats } = useListChats({
        filters: { sortBy: "updatedAt", sortOrder: "desc", page: 1, limit: 30 },
    });

    const { updateChat, isUpdating: isUpdatingChat } = useUpdateChat({
        onSuccess: () => {
            setChatRenameDialogOpen(false);
            setChatToRename(null);
            setChatRenameTitle("");
            refetchChats();
        },
    });

    const { deleteChat, isDeleting: isDeletingChat } = useDeleteChat({
        onSuccess: () => {
            setChatDeleteDialogOpen(false);
            setChatToDelete(null);
            refetchChats();
        },
    });

    /** Chats with folderId === null go to "Your Chats" */
    const yourChats = useMemo(
        () => chats.filter((c) => !c.folderId && c.characterId),
        [chats]
    );

    const { createFolder, isLoading: isCreating } = useCreateFolder({
        onSuccess: () => refetchFolders(),
    });

    const { updateFolder, isLoading: isUpdating } = useUpdateFolder({
        onSuccess: () => {
            setRenameModalOpen(false);
            setFolderToRename(null);
            refetchFolders();
        },
    });

    const { deleteFolder, isLoading: isDeleting } = useDeleteFolder({
        onSuccess: () => {
            setDeleteDialogOpen(false);
            setFolderToDelete(null);
            refetchFolders();
            router.push("/");
        },
    });

    const handleCreateFolder = useCallback(
        (name: string, description?: string | null) => {
            createFolder({ name, description: description ?? undefined });
        },
        [createFolder]
    );

    const handleRenameFolder = useCallback(
        (folderId: string, name: string, description?: string | null) => {
            updateFolder({ folderId, name, description: description ?? undefined });
        },
        [updateFolder]
    );

    const openRenameModal = useCallback((folder: FolderType) => {
        setFolderToRename(folder);
        setRenameModalOpen(true);
    }, []);

    const openDeleteDialog = useCallback((folder: FolderType) => {
        setFolderToDelete(folder);
        setDeleteDialogOpen(true);
    }, []);

    const openChatRenameDialog = useCallback((chat: Chat) => {
        setChatToRename(chat);
        setChatRenameTitle(chat.title?.trim() || "");
        setChatRenameDialogOpen(true);
    }, []);

    const openChatDeleteDialog = useCallback((chat: Chat) => {
        setChatToDelete(chat);
        setChatDeleteDialogOpen(true);
    }, []);

    const handleConfirmChatRename = useCallback(() => {
        if (chatToRename) {
            updateChat({ chatId: chatToRename.id, data: { title: chatRenameTitle.trim() || null } });
        }
    }, [chatToRename, chatRenameTitle, updateChat]);

    const handleConfirmChatDelete = useCallback(() => {
        if (chatToDelete) {
            deleteChat(chatToDelete.id);
        }
    }, [chatToDelete, deleteChat]);

    const handleConfirmDelete = useCallback(() => {
        if (folderToDelete) {
            deleteFolder(folderToDelete.id);
        }
    }, [folderToDelete, deleteFolder]);

    const isSubmitting = isCreating || isUpdating;

    return (
        <div className="border min-w-[300px] rounded-2xl border-primary bg-primary/20 backdrop-blur-md w-full p-3 shadow-xl">
            <Accordion type="multiple" defaultValue={["recent", "folders"]} className="space-y-2">
                {/* Folders Section */}
                <AccordionItem value="folders" className="border-none mb-0 pb-0">
                    <AccordionTrigger className="hover:no-underline py-2 text-white/60 hover:text-white text-sm font-semibold uppercase tracking-wider">
                        Folders
                    </AccordionTrigger>
                    <AccordionContent>
                        <FolderModal
                            mode="create"
                            onSubmitCreate={handleCreateFolder}
                            isSubmitting={isSubmitting}
                        >
                            <div className="flex items-center bg-primary/30 p-2 hover:bg-primary/50 transition-colors rounded-lg gap-2 cursor-pointer">
                                <FolderPlus className="h-4.5 w-4.5 text-white/60 transition-transform duration-200" />
                                <span className="text-white/80 group-hover:text-white transition duration-300 truncate max-w-[150px]">
                                    Create New Folder
                                </span>
                            </div>
                        </FolderModal>

                        <FolderModal
                            mode="rename"
                            folder={folderToRename ?? undefined}
                            open={renameModalOpen}
                            onOpenChange={(open) => {
                                if (!open) setFolderToRename(null);
                                setRenameModalOpen(open);
                            }}
                            onSubmitRename={handleRenameFolder}
                            isSubmitting={isSubmitting}
                        />

                        <div className="space-y-3 mt-2">
                            <ul className="max-h-[160px] overflow-y-auto pr-1 custom-scrollbar space-y-1">
                                {foldersLoading ? (
                                    <FolderListSkeleton count={4} />
                                ) : (
                                    folders.map((folder) => (
                                        <li key={folder.id}

                                            className="group px-2 flex items-center justify-between w-full pr-1 py-0.5 rounded-lg hover:bg-white/5 transition-colors"
                                        >
                                            <Link href={`/folders/${folder.id}-${folder.name.toLowerCase().replace(/ /g, '-')}`} className="flex items-center gap-2">
                                                <FolderIcon className="h-4.5 w-4.5 text-white/60 transition-transform duration-200" />
                                                <span className="text-white/80 group-hover:text-white transition duration-300 truncate max-w-[120px] cursor-pointer">
                                                    {folder.name}
                                                </span>
                                            </Link>

                                            <DropdownMenu modal={false}>
                                                <DropdownMenuTrigger
                                                    asChild
                                                    onPointerDown={(e) => e.stopPropagation()}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-white/40 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10 text-white">
                                                    <DropdownMenuItem
                                                        className="hover:bg-red-500/10 cursor-pointer text-xs flex items-center gap-2"
                                                        onClick={() => openRenameModal(folder)}
                                                    >
                                                        <Pencil className="h-3 w-3" /> Rename
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        className="hover:bg-red-500/10 cursor-pointer text-xs flex items-center gap-2"
                                                        onClick={() => openDeleteDialog(folder)}
                                                    >
                                                        <Trash2 className="h-3 w-3" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Your Chats - folderId === null (character chats from chat collection) */}
                <AccordionItem value="recent" className="border-none">
                    <AccordionTrigger className="hover:no-underline py-2 text-white/60 hover:text-white text-sm font-semibold uppercase tracking-wider">
                        Your Chats
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-1 max-h-[177px] overflow-y-auto pr-1 custom-scrollbar mt-1">
                            {chatsLoading ? (
                                <ChatListSkeleton count={3} />
                            ) : yourChats.length === 0 ? (
                                <p className="text-xs text-white/40 px-2 py-2">No chats yet. Click &quot;Chat with Character&quot; to start.</p>
                            ) : (
                                yourChats.slice(0, 5).map((chat) => (
                                    <YourChatItem
                                        key={chat.id}
                                        chat={chat}
                                        onRename={openChatRenameDialog}
                                        onDelete={openChatDeleteDialog}
                                    />
                                ))
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Chat rename dialog */}
            <Dialog
                open={chatRenameDialogOpen}
                onOpenChange={(open) => {
                    setChatRenameDialogOpen(open);
                    if (!open) {
                        setChatToRename(null);
                        setChatRenameTitle("");
                    }
                }}
            >
                <DialogContent className="bg-primary/20 backdrop-blur-sm border-primary text-white">
                    <DialogHeader>
                        <DialogTitle>Rename chat</DialogTitle>
                    </DialogHeader>
                    <div className="py-2">
                        <Input
                            value={chatRenameTitle}
                            onChange={(e) => setChatRenameTitle(e.target.value)}
                            placeholder="Chat title"
                            className="w-full"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setChatRenameDialogOpen(false)}
                            disabled={isUpdatingChat}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmChatRename}
                            disabled={isUpdatingChat}
                        >
                            {isUpdatingChat ? "Saving…" : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Chat delete confirmation */}
            <AlertDialog
                open={chatDeleteDialogOpen}
                onOpenChange={(open) => {
                    setChatDeleteDialogOpen(open);
                    if (!open) setChatToDelete(null);
                }}
            >
                <AlertDialogContent className="bg-primary/20 backdrop-blur-sm border-primary text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete chat</AlertDialogTitle>
                        <AlertDialogDescription>
                            {chatToDelete
                                ? "Are you sure you want to delete this chat? This action cannot be undone."
                                : "This chat will be permanently deleted."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="text-white/80">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmChatDelete}
                            disabled={isDeletingChat}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeletingChat ? "Deleting…" : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Folder delete dialog */}
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    setDeleteDialogOpen(open);
                    if (!open) setFolderToDelete(null);
                }}
            >
                <AlertDialogContent className="bg-primary/20 backdrop-blur-sm border-primary text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete folder</AlertDialogTitle>
                        <AlertDialogDescription>
                            {folderToDelete
                                ? `Are you sure you want to delete "${folderToDelete.name}"? All chats in this folder will also be deleted.`
                                : "This folder will be permanently deleted."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="text-white/80">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeleting ? "Deleting…" : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default HistoryDropdown;
