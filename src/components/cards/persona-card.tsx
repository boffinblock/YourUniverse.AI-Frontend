"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderPlus, HeartPlus, Heart, Link2, MoreVertical, Save, BookmarkCheck, Share2, SquarePen, Upload, Trash, CopyPlus, MessagesSquare } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/date-utils";
import Rating from "../elements/rating";
import { Checkbox } from "../ui/checkbox";
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
import { useTogglePersonaFavourite, useTogglePersonaSaved, useDeletePersona, useDuplicatePersona, useExportEntity, useCurrentUser } from "@/hooks";
import { exportPersonaJson } from "@/lib/api/personas/endpoints";
import { getPersona, updatePersona } from "@/lib/api/personas";
import { updateCharacter } from "@/lib/api/characters";
import type { Persona } from "@/lib/api/personas";
import LinkEntityDialog, { type LinkEntityModel } from "@/components/modals/link-entity-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/shared/query-keys";
import { toast } from "sonner";

interface PersonaCardProps {
    persona: Persona;
    isSelected?: boolean;
    onSelect?: (personaId: string, isSelected: boolean) => void;
}

const PersonaCard: React.FC<PersonaCardProps> = ({
    persona,
    isSelected = false,
    onSelect
}) => {
    const { user: currentUser } = useCurrentUser();
    const isOwner = currentUser?.id === persona.userId;
    // Memoize computed values
    const formattedCreatedDate = useMemo(() => formatDate(persona.createdAt), [persona.createdAt]);
    const formattedUpdatedDate = useMemo(() => formatDate(persona.updatedAt), [persona.updatedAt]);
    const avatarUrl = useMemo(() => persona.avatar?.url || "/logo1.png", [persona.avatar?.url]);
    const avatarFallback = useMemo(() => persona.name.charAt(0).toUpperCase() || "P", [persona.name]);
    const hasTags = useMemo(() => Boolean(persona?.tags?.length), [persona?.tags]);
    const isFavourite = useMemo(() => persona.isFavourite || false, [persona.isFavourite]);
    const isSaved = useMemo(() => persona.isSaved || false, [persona.isSaved]);
    const characterCount = persona.characters?.length ?? 0;

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Link dialog state
    const [linkDialogOpen, setLinkDialogOpen] = useState(false);
    const [linkDialogModel, setLinkDialogModel] = useState<LinkEntityModel>("character");
    const queryClient = useQueryClient();

    const openLinkDialog = (model: LinkEntityModel) => {
        setLinkDialogModel(model);
        setLinkDialogOpen(true);
    };

    const handleLinkConfirm = async (selectedIds: string[]) => {
        if (selectedIds.length === 0) return;
        if (linkDialogModel === "character") {
            await Promise.all(selectedIds.map((id) => updateCharacter(id, { personaId: persona.id })));
            const count = selectedIds.length;
            toast.success(`${count} Character${count > 1 ? "s" : ""} linked successfully`);
        } else if (linkDialogModel === "lorebook") {
            await updatePersona(persona.id, { lorebookId: selectedIds[0] });
            toast.success("Lorebook linked successfully");
        }
        queryClient.invalidateQueries({ queryKey: queryKeys.personas.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.characters.all });
    };

    // Image loading state for skeleton
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Reset image state when persona/avatar changes
    useEffect(() => {
        setImageLoaded(false);
        setImageError(false);
    }, [persona.id, avatarUrl]);

    // Toggle favourite hook
    const { toggleFavourite, isLoading: isTogglingFavourite } = useTogglePersonaFavourite({
        showToasts: true,
    });

    // Toggle saved hook
    const { toggleSaved, isLoading: isTogglingSaved } = useTogglePersonaSaved({
        showToasts: true,
    });

    // Delete persona hook
    const { deletePersona, isLoading: isDeleting } = useDeletePersona({
        showToasts: true,
        onSuccess: () => {
            setDeleteDialogOpen(false);
        },
    });

    // Duplicate persona hook
    const { duplicatePersona, isDuplicating } = useDuplicatePersona({
        showToasts: true,
    });

    // Client-side Export hook (PNG/JSON)
    const { exportPng, isExporting: isExportingPng } = useExportEntity({
        showToasts: true,
    });

    const [isExportingJson, setIsExportingJson] = useState(false);

    const handleToggleFavourite = useMemo(() => {
        return () => toggleFavourite(persona.id);
    }, [persona.id, toggleFavourite]);

    const handleToggleSaved = useMemo(() => {
        return () => toggleSaved(persona.id);
    }, [persona.id, toggleSaved]);

    const handleDeleteClick = useMemo(() => {
        return () => setDeleteDialogOpen(true);
    }, []);

    const handleDuplicateClick = useMemo(() => {
        return () => duplicatePersona(persona.id);
    }, [persona.id, duplicatePersona]);

    const handleExportJsonClick = useMemo(() => {
        return async () => {
            setIsExportingJson(true);
            try {
                await exportPersonaJson(persona.id);
            } finally {
                setIsExportingJson(false);
            }
        };
    }, [persona.id]);

   

    const handleConfirmDelete = useMemo(() => {
        return () => deletePersona(persona.id);
    }, [persona.id, deletePersona]);

    return (
        <Card
            className={cn(
                "group rounded-2xl w-full overflow-hidden bg-primary/20 backdrop-blur-xl border border-white/10",
                "hover:border-primary/50 hover:bg-primary/25 hover:shadow-lg hover:shadow-primary/10",
                "transition-all duration-300 ease-out relative flex flex-row min-h-[200px]"
            )}
        >
            {/* Left: Persona image - 40% width, full height */}
            <CardHeader className="p-0 m-0 relative shrink-0 w-[40%] min-w-[40%] self-stretch overflow-hidden border-r border-white/5 rounded-l-2xl">
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 text-white drop-shadow-lg">
                    <Checkbox
                        id={`persona-${persona.id}`}
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                            onSelect?.(persona.id, checked === true);
                        }}
                        className="bg-gray-900 border-primary/80 data-[state=checked]:bg-gray-900 cursor-pointer data-[state=checked]:text-white text-white rounded-full size-6"
                    />
                </div>

                <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="size-7 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors"
                        onClick={(e) => { e.stopPropagation(); handleToggleFavourite(); }}
                        disabled={isTogglingFavourite}
                    >
                        {isFavourite ? <Heart className="size-3.5 fill-red-500 text-red-500" /> : <HeartPlus className="size-3.5" />}
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="size-7 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors"
                            >
                                <MoreVertical className="size-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="w-full space-x-4"><Link2 className="w-4 h-4 mr-4 text-white" /> Link</DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => openLinkDialog("character")}>
                                            <Link2 className="w-4 h-4 mr-2 text-white" />Link to Character
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => openLinkDialog("lorebook")}>
                                            <Link2 className="w-4 h-4 mr-2 text-white" />Link to Lorebook
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            {/* <DropdownMenuItem className="hover:bg-gray-800 transition cursor-pointer">
                                <Share2 className="w-4 h-4 mr-2 text-white" /> Share
                            </DropdownMenuItem> */}
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="w-full space-x-4"><Upload className="w-4 h-4 mr-4 text-white" /> Export</DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                       
                                        <DropdownMenuItem onClick={handleExportJsonClick} disabled={isExportingJson}>
                                            <Upload className="w-4 h-4 mr-2 text-white" />.Json
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuItem
                                className="hover:bg-gray-800 transition cursor-pointer"
                                onClick={handleToggleFavourite}
                                disabled={isTogglingFavourite}
                            >
                                {isFavourite ? (
                                    <><Heart className="w-4 h-4 mr-2 text-white fill-red-500 stroke-red-500" />Remove from Favourites</>
                                ) : (
                                    <><HeartPlus className="w-4 h-4 mr-2 text-white" />Add to Favourites</>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="hover:bg-gray-800 transition cursor-pointer"
                                onClick={handleToggleSaved}
                                disabled={isTogglingSaved}
                            >
                                {isSaved ? (
                                    <><BookmarkCheck className="w-4 h-4 mr-2 text-white fill-green-500 stroke-green-500" />Remove from Saved</>
                                ) : (
                                    <><Save className="w-4 h-4 mr-2 text-white" />Save Persona</>
                                )}
                            </DropdownMenuItem>
                            {isOwner && (
                                <Link href={`/personas/${persona.id}/edit`}>
                                    <DropdownMenuItem className="hover:bg-gray-800 transition cursor-pointer">
                                        <SquarePen className="w-4 h-4 mr-2 text-white" /> Edit
                                    </DropdownMenuItem>
                                </Link>
                            )}

                            <DropdownMenuItem
                                variant="destructive"
                                className="cursor-pointer"
                                onClick={handleDeleteClick}
                            >
                                <Trash className="mr-2 w-4 h-4 text-white" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 z-1 bg-linear-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Image with skeleton loader */}
                <div className="absolute inset-0 cursor-pointer overflow-hidden rounded-l-2xl transition-transform duration-300 group-hover:scale-105">
                    {!imageLoaded && !imageError && (
                        <Skeleton className="absolute inset-0 rounded-l-2xl bg-primary/20 animate-pulse" />
                    )}
                    {imageError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/30 text-3xl font-bold text-white/90 rounded-l-2xl">
                            {avatarFallback}
                        </div>
                    )}
                    {!imageError && (
                        <img
                            src={avatarUrl}
                            alt={persona.name}
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                            className={cn(
                                "absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300",
                                imageLoaded ? "opacity-100" : "opacity-0"
                            )}
                        />
                    )}
                </div>
            </CardHeader>

            {/* Right: Content + Footer */}
            <div className="flex flex-col flex-1 min-w-0">
                <CardContent className="space-y-2.5 py-4 px-5 flex-1">
                    <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-white font-semibold text-lg capitalize leading-tight truncate">
                            {persona.name}
                        </CardTitle>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-xs text-muted-foreground/80 font-medium tabular-nums">{characterCount} characters</span>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize font-normal">
                                {persona.rating}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Rating value={persona.rating === "NSFW" ? 5 : 3.5} size={12} readOnly={true} />
                        <span className="text-xs">({persona.rating})</span>
                    </div>
                    {hasTags && (
                        <div className="flex gap-1.5 flex-wrap">
                            {persona.tags?.slice(0, 5).map((tag, idx) => (
                                <Badge key={`${persona.id}-tag-${idx}`} variant="outline" className="text-[10px] px-2 py-0 font-normal border-white/20 text-white/70">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                    <CardDescription className="text-muted-foreground/90 text-sm line-clamp-3 leading-relaxed">
                        {persona.description || "No description"}
                    </CardDescription>
                    <div className="flex items-center justify-between text-xs text-muted-foreground/70">
                        <span className="capitalize">{persona.visibility}</span>
                        {isOwner && (
                            <Link href={`/personas/${persona.id}/edit`} onClick={(e) => e.stopPropagation()}>
                                <Button size="sm" variant="ghost" className="h-7 px-2 cursor-pointer group bg-primary/20 text-xs gap-1.5 -mr-2 rounded-full">
                                    <MessagesSquare className="w-3.5 h-3.5" />
                                    Edit
                                </Button>
                            </Link>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between items-center px-5 py-2 border-t border-white/5 text-[10px] text-muted-foreground/60 mt-auto gap-2">
                    <span>Created {formattedCreatedDate}</span>
                    <span>Updated {formattedUpdatedDate}</span>
                </CardFooter>
            </div>

            {/* Link Entity Dialog */}
            <LinkEntityDialog
                open={linkDialogOpen}
                onOpenChange={setLinkDialogOpen}
                title={linkDialogModel === "character" ? "Link to Characters" : `Link to ${linkDialogModel.charAt(0).toUpperCase() + linkDialogModel.slice(1)}`}
                description={linkDialogModel === "character" ? `Select one or more characters to link "${persona.name}" to.` : `Select a ${linkDialogModel} to link "${persona.name}" to.`}
                model={linkDialogModel}
                multiSelect={linkDialogModel === "character"}
                onConfirm={handleLinkConfirm}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="bg-primary/50 backdrop-blur-md border border-primary">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Persona</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{persona.name}"? This action cannot be undone and will permanently remove the persona.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
};

export default React.memo(PersonaCard);
