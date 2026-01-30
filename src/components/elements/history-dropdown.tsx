"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import {
    Edit3,
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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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
import { Skeleton } from "@/components/ui/skeleton";
import { FolderModal } from "../modals/create-folder-modal";
import { useListFolders, useCreateFolder, useUpdateFolder, useDeleteFolder } from "@/hooks";
import type { Folder as FolderType } from "@/lib/api/folders";

interface Character {
    id: number;
    name: string;
    avatar?: string;
    description: string;
}

const recentChats: Character[] = [
    { id: 1, name: "Project Assistant", avatar: "https://github.com/shadcn.png", description: "Your AI assistant for coding projects." },
    { id: 2, name: "Lore Master", avatar: "https://randomuser.me/api/portraits/women/44.jpg", description: "Keeper of the universe's history." },
    { id: 3, name: "System Debugger", avatar: "https://randomuser.me/api/portraits/men/32.jpg", description: "Helping you fix those pesky bugs." },
    { id: 4, name: "UI Specialist", avatar: "https://randomuser.me/api/portraits/women/68.jpg", description: "Expert in frontend designs." },
    { id: 5, name: "Data Analyst", avatar: "https://randomuser.me/api/portraits/men/45.jpg", description: "Crunching numbers for you." },
];

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

const ChatItem = ({ char }: { char: Character }) => (
    <div className="flex items-center justify-between px-2 group py-1 hover:bg-white/5 rounded-lg">
        <div className="flex items-center gap-x-2">
            <Avatar className="size-6 brightness-90 group-hover:brightness-100 transition duration-300">
                {char.avatar ? (
                    <AvatarImage src={char.avatar} alt={char.name} className="object-cover" />
                ) : (
                    <AvatarFallback>{char.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                )}
            </Avatar>
            <span className="text-sm text-white/80 cursor-pointer group-hover:text-white transition duration-300 truncate max-w-[120px]">
                {char.name}
            </span>
        </div>

        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-white/40 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10 text-white">
                <DropdownMenuItem className="hover:bg-white/10 cursor-pointer text-xs flex items-center gap-2">
                    <Edit3 className="h-3 w-3" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-red-500/10 text-red-400 hover:text-red-400 cursor-pointer text-xs flex items-center gap-2">
                    <Trash2 className="h-3 w-3" /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
);

const HistoryDropdown = () => {
    const [renameModalOpen, setRenameModalOpen] = useState(false);
    const [folderToRename, setFolderToRename] = useState<FolderType | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [folderToDelete, setFolderToDelete] = useState<FolderType | null>(null);

    const { folders, isLoading: foldersLoading, refetch: refetchFolders } = useListFolders({
        filters: { sortBy: "updatedAt", sortOrder: "desc" },
    });

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
                            <div className="max-h-[160px] overflow-y-auto pr-1 custom-scrollbar space-y-1">
                                {foldersLoading ? (
                                    <FolderListSkeleton count={4} />
                                ) : (
                                    folders.map((folder) => (
                                        <div
                                            key={folder.id}
                                            className="group px-2 flex items-center justify-between w-full pr-1 py-0.5 rounded-lg hover:bg-white/5 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <FolderIcon className="h-4.5 w-4.5 text-white/60 transition-transform duration-200" />
                                                <span className="text-white/80 group-hover:text-white transition duration-300 truncate max-w-[120px] cursor-pointer">
                                                    {folder.name}
                                                </span>
                                            </div>

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
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Recent Chats Section */}
                <AccordionItem value="recent" className="border-none">
                    <AccordionTrigger className="hover:no-underline py-2 text-white/60 hover:text-white text-sm font-semibold uppercase tracking-wider">
                        Your Chats
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-1 max-h-[177px] overflow-y-auto pr-1 custom-scrollbar mt-1">
                            {recentChats.slice(0, 5).map((chat) => (
                                <ChatItem key={chat.id} char={chat} />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

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
                                ? `Are you sure you want to delete "${folderToDelete.name}"? Chats in this folder will become uncategorized.`
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
