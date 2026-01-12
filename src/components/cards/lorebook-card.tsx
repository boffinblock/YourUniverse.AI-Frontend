"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FolderPlus, HeartPlus, Heart, Link2, MoreVertical, Save, BookmarkCheck, Share2, SquarePen, Upload, Trash } from "lucide-react";
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
    // Memoize computed values
    const formattedCreatedDate = useMemo(() => formatDate(lorebook.createdAt), [lorebook.createdAt]);
    const formattedUpdatedDate = useMemo(() => formatDate(lorebook.updatedAt), [lorebook.updatedAt]);
    const entriesCount = useMemo(() => lorebook?.entries?.length ?? 0, [lorebook?.entries]);
    const avatarUrl = useMemo(() => lorebook.avatar?.url || "https://github.com/shadcn.png", [lorebook.avatar?.url]);
    const avatarFallback = useMemo(() => lorebook.name.charAt(0).toUpperCase() || "LB", [lorebook.name]);
    const hasTags = useMemo(() => Boolean(lorebook?.tags?.length), [lorebook?.tags]);
    const isFavourite = useMemo(() => lorebook.isFavourite || false, [lorebook.isFavourite]);
    const isSaved = useMemo(() => lorebook.isSaved || false, [lorebook.isSaved]);

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Toggle favourite hook
    const { toggleFavourite, isLoading: isTogglingFavourite } = useToggleLorebookFavourite({
        showToasts: true,
    });

    // Toggle saved hook
    const { toggleSaved, isLoading: isTogglingSaved } = useToggleLorebookSaved({
        showToasts: true,
    });

    // Delete lorebook hook
    const { deleteLorebook, isLoading: isDeleting } = useDeleteLorebook({
        showToasts: true,
        onSuccess: () => {
            setDeleteDialogOpen(false);
        },
    });

    // Handle favourite toggle
    const handleToggleFavourite = useMemo(() => {
        return () => {
            toggleFavourite(lorebook.id);
        };
    }, [lorebook.id, toggleFavourite]);

    // Handle saved toggle
    const handleToggleSaved = useMemo(() => {
        return () => {
            toggleSaved(lorebook.id);
        };
    }, [lorebook.id, toggleSaved]);

    // Handle delete click
    const handleDeleteClick = useMemo(() => {
        return () => {
            setDeleteDialogOpen(true);
        };
    }, []);

    // Handle confirm delete
    const handleConfirmDelete = useMemo(() => {
        return () => {
            deleteLorebook(lorebook.id);
        };
    }, [lorebook.id, deleteLorebook]);

    return (
        <Card
            className={cn(" rounded-4xl max-w-xs  border overflow-hidden bg-primary/20 backdrop-filter transition-transform  backdrop-blur-lg hover:border-2  hover:border-primary  hover:scale-105 duration-500 relative gap-y-0")}
        >
            <CardHeader className="p-0 m-0  relative ">
                <div className="w-full absolute top-3 z-10 flex items-start  justify-between px-4  text-white ">
                    <div className="flex flex-col items-center gap-1 justify-center">
                        <Checkbox
                            id={`lorebook-${lorebook.id}`}
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                                onSelect?.(lorebook.id, checked === true);
                            }}
                            className="bg-gray-900 border-primary/80 data-[state=checked]:bg-gray-900 cursor-pointer data-[state=checked]:text-white text-white rounded-full size-6"
                        />
                    </div>

                    <div className="flex items-center gap-1">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="bg-gray-900 size-6"
                                >
                                    <MoreVertical className="size-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                            >
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="w-full  space-x-4"><Link2 className="w-4 h-4 mr-2 text-white" /> Link</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem><Link2 className="w-4 h-4 mr-2 text-white" />Link to Character</DropdownMenuItem>
                                            <DropdownMenuItem><Link2 className="w-4 h-4 mr-2 text-white" />Link to Persona</DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>

                                <DropdownMenuItem className="hover:bg-gray-800 transition cursor-pointer">
                                    <FolderPlus className="w-4 h-4 mr-2 text-white" /> Add to Realm
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-gray-800 transition cursor-pointer">
                                    <Share2 className="w-4 h-4 mr-2 text-white" /> Share
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-gray-800 transition cursor-pointer">
                                    <Upload className="w-4 h-4 mr-2 text-white" /> Export
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="hover:bg-gray-800 transition cursor-pointer"
                                    onClick={handleToggleFavourite}
                                    disabled={isTogglingFavourite}
                                >
                                    {isFavourite ? (
                                        <>
                                            <Heart className="w-4 h-4 mr-2 text-white fill-red-500 stroke-red-500" />
                                            Remove from Favourites
                                        </>
                                    ) : (
                                        <>
                                            <HeartPlus className="w-4 h-4 mr-2 text-white" />
                                            Add to Favourites
                                        </>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="hover:bg-gray-800 transition cursor-pointer"
                                    onClick={handleToggleSaved}
                                    disabled={isTogglingSaved}
                                >
                                    {isSaved ? (
                                        <>
                                            <BookmarkCheck className="w-4 h-4 mr-2 text-white fill-green-500 stroke-green-500" />
                                            Remove from Saved
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2 text-white" />
                                            Save Lorebook
                                        </>
                                    )}
                                </DropdownMenuItem>
                                <Link href={`/lorebooks/${lorebook.id}/edit`}>
                                    <DropdownMenuItem className="hover:bg-gray-800 transition cursor-pointer">
                                        <SquarePen className="w-4 h-4 mr-2 text-white" /> Edit
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem
                                    variant="destructive"
                                    className="hover:bg-gray-800 transition cursor-pointer"
                                    onClick={handleDeleteClick}
                                >
                                    <Trash className="w-4 h-4 mr-2 text-white" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                </div>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent className="bg-primary/30 backdrop-blur-sm border-primary ">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Delete Lorebook?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete "{lorebook.name}"? This action cannot be undone and all associated entries will be permanently deleted.
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
                <Avatar className="cursor-pointer rounded-none w-full  h-44 hover:scale-105 duration-500  transition brightness-60 ">
                    <AvatarImage
                        src={avatarUrl}
                        alt={lorebook.name}
                        className="object-cover"
                    />
                    <AvatarFallback className="cursor-pointer rounded-none w-full h-full hover:scale-105 duration-500  transition brightness-75">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </CardHeader>

            {/* Content */}
            <CardContent className="space-y-2 py-2  px-4 flex-1 h-full ">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-white/80 text-xl font-semibold">{lorebook.name}</CardTitle>
                    <span className="text-xs text-gray-400">Tokens:- {entriesCount}</span>
                </div>
                <div className=" -mt-1 flex items-center gap-2 text-gray-400 ">
                    <Rating value={lorebook.rating === "NSFW" ? 5 : 3.5} size={14} readOnly={true} />
                    <span className="text-xs">({lorebook.rating})</span>
                </div>
                {hasTags && (
                    <div className="flex gap-2 flex-wrap ">
                        {lorebook.tags?.map((tag, idx) => (
                            <Badge key={`${lorebook.id}-tag-${idx}`}>
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
                <CardDescription className="text-gray-400 text-sm line-clamp-3">
                    {lorebook.description || "No description available"}
                </CardDescription>
                <div className="w-full  flex items-center justify-between text-xs text-gray-300">
                    <span className="">({lorebook.visibility}) </span>
                    <span className="">-- Author Name </span>
                </div>
            </CardContent>

            <CardFooter className="flex justify-between px-4 py-2  border-t border-primary/70 text-[10px] text-gray-500">
                <div>
                    Created:- {formattedCreatedDate}
                </div>
                <div>
                    Updated:- {formattedUpdatedDate}
                </div>
            </CardFooter>
        </Card>
    );
};

export default React.memo(LorebookCard);
