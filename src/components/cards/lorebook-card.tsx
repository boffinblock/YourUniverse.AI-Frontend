"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderPlus, HeartPlus, Heart, Link2, MoreVertical, Save, BookmarkCheck, Share2, SquarePen, Upload, Trash, BookOpen } from "lucide-react";
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
import { useToggleLorebookFavourite, useToggleLorebookSaved, useDeleteLorebook } from "@/hooks";
import type { Lorebook } from "@/lib/api/lorebooks";
import { updateCharacter } from "@/lib/api/characters";
import { updatePersona } from "@/lib/api/personas";
import { exportLorebook } from "@/lib/api/lorebooks";
import LinkEntityDialog, { type LinkEntityModel } from "@/components/modals/link-entity-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/shared/query-keys";
import { toast } from "sonner";

interface LorebookCardProps {
    lorebook: Lorebook;
    isSelected?: boolean;
    onSelect?: (lorebookId: string, isSelected: boolean) => void;
}

const LorebookCard: React.FC<LorebookCardProps> = ({
    lorebook,
    isSelected = false,
    onSelect
}) => {
    const formattedCreatedDate = useMemo(() => formatDate(lorebook.createdAt), [lorebook.createdAt]);
    const formattedUpdatedDate = useMemo(() => formatDate(lorebook.updatedAt), [lorebook.updatedAt]);
    const avatarUrl = useMemo(() => lorebook.avatar?.url || "/logo1.png", [lorebook.avatar?.url]);
    const avatarFallback = useMemo(() => lorebook.name.charAt(0).toUpperCase() || "LB", [lorebook.name]);
    const hasTags = useMemo(() => Boolean(lorebook?.tags?.length), [lorebook?.tags]);
    const isFavourite = useMemo(() => lorebook.isFavourite || false, [lorebook.isFavourite]);
    const isSaved = useMemo(() => lorebook.isSaved || false, [lorebook.isSaved]);
    const entriesCount = lorebook.entriesCount ?? lorebook.entries?.length ?? 0;

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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
            await Promise.all(selectedIds.map((id) => updateCharacter(id, { lorebookId: lorebook.id })));
        } else if (linkDialogModel === "persona") {
            await Promise.all(selectedIds.map((id) => updatePersona(id, { lorebookId: lorebook.id })));
        }
        const count = selectedIds.length;
        const label = linkDialogModel.charAt(0).toUpperCase() + linkDialogModel.slice(1);
        toast.success(`${count} ${label}${count > 1 ? "s" : ""} linked successfully`);
        queryClient.invalidateQueries({ queryKey: queryKeys.lorebooks.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.characters.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.personas.all });
    };

    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await exportLorebook(lorebook.id);
            toast.success("Lorebook exported as V2 JSON");
        } catch (error: any) {
            toast.error("Export failed", { description: error.message || "Could not export lorebook" });
        } finally {
            setIsExporting(false);
        }
    };

    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageLoaded(false);
        setImageError(false);
    }, [lorebook.id, avatarUrl]);

    const { toggleFavourite, isLoading: isTogglingFavourite } = useToggleLorebookFavourite({ showToasts: true });
    const { toggleSaved, isLoading: isTogglingSaved } = useToggleLorebookSaved({ showToasts: true });
    const { deleteLorebook, isLoading: isDeleting } = useDeleteLorebook({
        showToasts: true,
        onSuccess: () => setDeleteDialogOpen(false),
    });

    const handleToggleFavourite = useMemo(() => () => toggleFavourite(lorebook.id), [lorebook.id, toggleFavourite]);
    const handleToggleSaved = useMemo(() => () => toggleSaved(lorebook.id), [lorebook.id, toggleSaved]);
    const handleDeleteClick = useMemo(() => () => setDeleteDialogOpen(true), []);
    const handleConfirmDelete = useMemo(() => () => deleteLorebook(lorebook.id), [lorebook.id, deleteLorebook]);

    return (
        <Card
            className={cn(
                "group rounded-2xl w-full overflow-hidden bg-primary/20 backdrop-blur-xl border border-white/10",
                "hover:border-primary/50 hover:bg-primary/25 hover:shadow-lg hover:shadow-primary/10",
                "transition-all duration-300 ease-out relative flex flex-row min-h-[200px]"
            )}
        >
            {/* Left: Image - 40% width */}
            <CardHeader className="p-0 m-0 relative shrink-0 w-[40%] min-w-[40%] self-stretch overflow-hidden border-r border-white/5 rounded-l-2xl">
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 text-white drop-shadow-lg">
                    <Checkbox
                        id={`lorebook-${lorebook.id}`}
                        checked={isSelected}
                        onCheckedChange={(checked) => onSelect?.(lorebook.id, checked === true)}
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
                            <Button size="icon" variant="ghost" className="size-7 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors">
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
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => openLinkDialog("persona")}>
                                            <Link2 className="w-4 h-4 mr-2 text-white" />Link to Persona
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            {/* <DropdownMenuItem className="hover:bg-gray-800 transition cursor-pointer">
                                <FolderPlus className="w-4 h-4 mr-2 text-white" /> Add to Realm
                            </DropdownMenuItem> */}
                            {/* <DropdownMenuItem className="hover:bg-gray-800 transition cursor-pointer">
                                <Share2 className="w-4 h-4 mr-2 text-white" /> Share
                            </DropdownMenuItem> */}
                            <DropdownMenuItem className="hover:bg-gray-800 transition cursor-pointer" onClick={handleExport} disabled={isExporting}>
                                <Upload className="w-4 h-4 mr-2 text-white" /> {isExporting ? "Exporting..." : "Export"}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-gray-800 transition cursor-pointer" onClick={handleToggleFavourite} disabled={isTogglingFavourite}>
                                {isFavourite ? <><Heart className="w-4 h-4 mr-2 text-white fill-red-500 stroke-red-500" />Remove from Favourites</> : <><HeartPlus className="w-4 h-4 mr-2 text-white" />Add to Favourites</>}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-gray-800 transition cursor-pointer" onClick={handleToggleSaved} disabled={isTogglingSaved}>
                                {isSaved ? <><BookmarkCheck className="w-4 h-4 mr-2 text-white fill-green-500 stroke-green-500" />Remove from Saved</> : <><Save className="w-4 h-4 mr-2 text-white" />Save Lorebook</>}
                            </DropdownMenuItem>
                            <Link href={`/lorebooks/${lorebook.id}/edit`}>
                                <DropdownMenuItem className="hover:bg-gray-800 transition cursor-pointer">
                                    <SquarePen className="w-4 h-4 mr-2 text-white" /> Edit
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={handleDeleteClick}>
                                <Trash className="mr-2 w-4 h-4 text-white" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="absolute inset-0 z-1 bg-linear-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

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
                            alt={lorebook.name}
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
                            {lorebook.name}
                        </CardTitle>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-xs text-muted-foreground/80 font-medium tabular-nums">{entriesCount} entries</span>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize font-normal">
                                {lorebook.rating}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Rating value={lorebook.rating === "NSFW" ? 5 : 3.5} size={12} readOnly={true} />
                        <span className="text-xs">({lorebook.rating})</span>
                    </div>
                    {hasTags && (
                        <div className="flex gap-1.5 flex-wrap">
                            {lorebook.tags?.slice(0, 5).map((tag, idx) => (
                                <Badge key={`${lorebook.id}-tag-${idx}`} variant="outline" className="text-[10px] px-2 py-0 font-normal border-white/20 text-white/70">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                    <CardDescription className="text-muted-foreground/90 text-sm line-clamp-3 leading-relaxed">
                        {lorebook.description || "No description"}
                    </CardDescription>
                    <div className="flex items-center justify-between text-xs text-muted-foreground/70">
                        <span className="capitalize">{lorebook.visibility}</span>
                        <Link href={`/lorebooks/${lorebook.id}/edit`} onClick={(e) => e.stopPropagation()}>
                            <Button size="sm" variant="ghost" className="h-7 px-2 cursor-pointer group bg-primary/20 text-xs gap-1.5 -mr-2 rounded-full">
                                <BookOpen className="w-3.5 h-3.5" />
                                Edit
                            </Button>
                        </Link>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between items-center px-5 py-2 border-t border-white/5 text-[10px] text-muted-foreground/60 mt-auto gap-2">
                    <span>Created {formattedCreatedDate}</span>
                    <span>Updated {formattedUpdatedDate}</span>
                </CardFooter>
            </div>

            <LinkEntityDialog
                open={linkDialogOpen}
                onOpenChange={setLinkDialogOpen}
                title={`Link to ${linkDialogModel.charAt(0).toUpperCase() + linkDialogModel.slice(1)}${linkDialogModel === "character" || linkDialogModel === "persona" ? "s" : ""}`}
                description={`Select ${linkDialogModel === "character" || linkDialogModel === "persona" ? "one or more " + linkDialogModel + "s" : "a " + linkDialogModel} to link "${lorebook.name}" to.`}
                model={linkDialogModel}
                multiSelect={linkDialogModel === "character" || linkDialogModel === "persona"}
                onConfirm={handleLinkConfirm}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="bg-primary/50 backdrop-blur-md border border-primary">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Lorebook</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{lorebook.name}"? This action cannot be undone and all associated entries will be permanently deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
};

export default React.memo(LorebookCard);
