"use client";

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lightbulb } from "lucide-react";
import type { Folder } from "@/lib/api/folders";

export type FolderModalMode = "create" | "rename";

export interface FolderModalProps {
    /** "create" = new folder (optional trigger), "rename" = edit existing (controlled open) */
    mode: FolderModalMode;
    /** For rename: folder to edit */
    folder?: Folder | null;
    /** For rename: controlled open state */
    open?: boolean;
    /** For rename: open state change */
    onOpenChange?: (open: boolean) => void;
    /** For create: trigger element (e.g. "Create New Folder" button) */
    children?: React.ReactNode;
    /** Called on create submit with name (and optional description) */
    onSubmitCreate?: (name: string, description?: string | null) => void;
    /** Called on rename submit with folderId and name (and optional description) */
    onSubmitRename?: (folderId: string, name: string, description?: string | null) => void;
    /** Disable submit while API is in progress */
    isSubmitting?: boolean;
}

export const FolderModal = ({
    mode,
    folder = null,
    open: controlledOpen,
    onOpenChange,
    children,
    onSubmitCreate,
    onSubmitRename,
    isSubmitting = false,
}: FolderModalProps) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState<string | null>(null);

    const isCreate = mode === "create";
    const isRename = mode === "rename";

    const open = isRename ? controlledOpen ?? false : (controlledOpen !== undefined ? controlledOpen : internalOpen);
    const setOpen = (value: boolean) => {
        if (onOpenChange) onOpenChange(value);
        if (isCreate && controlledOpen === undefined) setInternalOpen(value);
    };

    useEffect(() => {
        if (isRename && folder) {
            setName(folder.name);
            setDescription(folder.description ?? null);
        } else if (isCreate) {
            setName("");
            setDescription(null);
        }
    }, [isRename, isCreate, folder?.id, folder?.name, folder?.description]);

    const handleOpenChange = (value: boolean) => {
        setOpen(value);
        if (!value) {
            setName(isRename && folder ? folder.name : "");
            setDescription(isRename && folder ? (folder.description ?? null) : null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = name.trim();
        if (!trimmedName) return;
        if (isCreate && onSubmitCreate) {
            onSubmitCreate(trimmedName, description ?? undefined);
            setOpen(false);
            setName("");
            setDescription(null);
        }
        if (isRename && folder && onSubmitRename) {
            onSubmitRename(folder.id, trimmedName, description ?? undefined);
            setOpen(false);
        }
    };

    const title = isCreate ? "Create Folder" : "Rename Folder";
    const submitLabel = isCreate ? "Create Folder" : "Save";
    const placeholder = "Enter Folder Name";

    const content = (
        <DialogContent
            className="bg-primary/20 backdrop-filter border-2 border-primary transition-transform backdrop-blur-lg hover:border-2 hover:border-primary duration-500 text-white w-fit p-0 overflow-hidden rounded-[24px] shadow-2xl"
            onPointerDownOutside={(e) => !isSubmitting && handleOpenChange(false)}
        >
            <div className="p-6 pt-5 space-y-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight text-white">
                        {title}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={placeholder}
                            disabled={isSubmitting}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                            autoFocus
                        />
                    </div>

                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 pr-6 flex gap-3.5">
                        <div className="shrink-0 pt-0.5">
                            <Lightbulb className="h-5 w-5 text-white/40" />
                        </div>
                        <p className="text-[14px] text-white/50 leading-snug">
                            {isCreate
                                ? "Folders keep chats, files, and custom instructions in one place. Use them for ongoing work, or just to keep things tidy."
                                : "Change the folder name. Chats inside will stay in this folder."}
                        </p>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button
                            type="submit"
                            disabled={!name.trim() || isSubmitting}
                            className="text-white/90 rounded-full px-6 py-2 transition-all duration-200 border-none shadow-none text-sm"
                        >
                            {isSubmitting ? "Saving…" : submitLabel}
                        </Button>
                    </div>
                </form>
            </div>
        </DialogContent>
    );

    if (isCreate && children !== undefined) {
        return (
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                {content}
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {content}
        </Dialog>
    );
};

/** Backward-compatible wrapper: create-only modal with trigger */
export const CreateFolderModal = ({
    children,
    onSubmitCreate,
    isSubmitting,
}: {
    children: React.ReactNode;
    onSubmitCreate?: (name: string, description?: string | null) => void;
    isSubmitting?: boolean;
}) => (
    <FolderModal
        mode="create"
        onSubmitCreate={onSubmitCreate}
        isSubmitting={isSubmitting}
    >
        {children}
    </FolderModal>
);
