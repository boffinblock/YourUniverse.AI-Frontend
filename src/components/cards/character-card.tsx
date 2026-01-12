"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FolderPlus, HeartPlus, Heart, Link2, MoreVertical, Save, BookmarkCheck, Share2, SquarePen, Upload, Trash, CopyPlus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/date-utils";
import Chat from "../icons/chat";
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
import { useToggleFavourite, useToggleSaved, useDeleteCharacter, useDuplicateCharacter, useExportCharacter } from "@/hooks";
import type { Character } from "@/lib/api/characters";

interface CharacterCardProps {
    character: Character;
    isSelected?: boolean;
    onSelect?: (characterId: string, isSelected: boolean) => void;
}


const CharacterCard: React.FC<CharacterCardProps> = ({
    character,
    isSelected = false,
    onSelect
}) => {
    // Memoize computed values
    const formattedCreatedDate = useMemo(() => formatDate(character.createdAt), [character.createdAt]);
    const formattedUpdatedDate = useMemo(() => formatDate(character.updatedAt), [character.updatedAt]);
    const tokens = useMemo(() => character?.tokens ?? 0, [character?.tokens]);
    const avatarUrl = useMemo(() => character.avatar?.url || "https://github.com/shadcn.png", [character.avatar?.url]);
    const avatarFallback = useMemo(() => character.name.charAt(0).toUpperCase() || "CN", [character.name]);
    const hasTags = useMemo(() => Boolean(character?.tags?.length), [character?.tags]);
    const isFavourite = useMemo(() => character.isFavourite || false, [character.isFavourite]);
    const isSaved = useMemo(() => character.isSaved || false, [character.isSaved]);

    // Toggle favourite hook
    const { toggleFavourite, isLoading: isTogglingFavourite } = useToggleFavourite({
        showToasts: true,
    });

    // Toggle saved hook
    const { toggleSaved, isLoading: isTogglingSaved } = useToggleSaved({
        showToasts: true,
    });

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Delete character hook
    const { deleteCharactersBatch, isLoading: isDeleting } = useDeleteCharacter({
        showToasts: true,
        onSuccess: () => {
            setDeleteDialogOpen(false);
        },
    });

    // Duplicate character hook
    const { duplicateCharactersBatch, isLoading: isDuplicating } = useDuplicateCharacter({
        showToasts: true,
    });

    // Export character hook
    const { exportCharacter, isLoading: isExporting } = useExportCharacter({
        showToasts: true,
    });

    // Handle favourite toggle
    const handleToggleFavourite = useMemo(() => {
        return () => {
            toggleFavourite(character.id);
        };
    }, [character.id, toggleFavourite]);

    // Handle saved toggle
    const handleToggleSaved = useMemo(() => {
        return () => {
            toggleSaved(character.id);
        };
    }, [character.id, toggleSaved]);

    // Handle duplicate click
    const handleDuplicateClick = useMemo(() => {
        return () => {
            duplicateCharactersBatch([character.id]);
        };
    }, [character.id, duplicateCharactersBatch]);

    // Handle delete click
    const handleDeleteClick = useMemo(() => {
        return () => {
            setDeleteDialogOpen(true);
        };
    }, []);

    // Handle confirm delete
    const handleConfirmDelete = useMemo(() => {
        return () => {
            deleteCharactersBatch([character.id]);
        };
    }, [character.id, deleteCharactersBatch]);

    // Handle export click
    const handleExportClick = useMemo(() => {
        return () => {
            exportCharacter(character.id, "json");
        };
    }, [character.id, exportCharacter]);

    return (
        <Card
            className={cn(" rounded-4xl max-w-xs border overflow-hidden bg-primary/20 backdrop-filter transition-transform  backdrop-blur-lg hover:border-2  hover:border-primary  hover:scale-105 duration-500 relative gap-y-0")}
        >
            <CardHeader className="p-0 m-0  relative ">
                <div className="w-full absolute top-3 z-10 flex items-start  justify-between px-4  text-white ">
                    <div className="flex flex-col items-center gap-1 justify-center">
                        <Checkbox
                            id={`character-${character.id}`}
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                                onSelect?.(character.id, checked === true);
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
                            // className=" bg-gray-900 text-white border border-gray-800"
                            >
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="w-full  space-x-4"><Link2 className="w-4 h-4 mr-2 text-white" /> Link</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem><Link2 className="w-4 h-4 mr-2 text-white" />Link to Persona</DropdownMenuItem>
                                            <DropdownMenuItem><Link2 className="w-4 h-4 mr-2 text-white" />Link to Lorebook</DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>

                                <DropdownMenuItem className="hover:bg-gray-800 transition cursor-pointer">
                                    <FolderPlus className="w-4 h-4 mr-2 text-white" /> Add to Realm
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-gray-800 transition cursor-pointer">
                                    <Share2 className="w-4 h-4 mr-2 text-white" /> Share
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="hover:bg-gray-800 transition cursor-pointer"
                                    onClick={handleExportClick}
                                    disabled={isExporting}
                                >
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
                                            Save Character
                                        </>
                                    )}
                                </DropdownMenuItem>
                                <Link href={`/characters/${character.id}/edit`}>
                                    <DropdownMenuItem className="hover:bg-gray-800 transition cursor-pointer">
                                        <SquarePen className="w-4 h-4 mr-2 text-white" /> Edit
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem className="hover:bg-gray-800 transition cursor-pointer">
                                    <Chat className=" mr-2 w-4  h-4 text-white " /> Chat With Me
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="hover:bg-gray-800 transition cursor-pointer"
                                    onClick={handleDuplicateClick}
                                    disabled={isDuplicating}
                                >
                                    <CopyPlus className=" mr-2 w-4  h-4 text-white " /> Duplicate Character
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    variant="destructive"
                                    className="cursor-pointer"
                                    onClick={handleDeleteClick}
                                    disabled={isDeleting}
                                >
                                    <Trash className=" mr-2 w-4  h-4 text-white " /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                </div>
                <Avatar className="cursor-pointer rounded-none w-full  h-44 hover:scale-105 duration-500  transition brightness-60 ">
                    <AvatarImage
                        src={avatarUrl}
                        alt={character.name}
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
                    <CardTitle className="text-white/80 text-xl font-semibold capitalize">{character.name}</CardTitle>
                    <span className="text-xs text-gray-400">Tokens:- {tokens}</span>
                </div>
                <div className=" -mt-1 flex items-center gap-2 text-gray-400 ">
                    <Rating value={3.5} size={14} readOnly={true} />
                    <span className="text-xs">(25k)</span>
                </div>
                {hasTags && (
                    <div className="flex gap-2 flex-wrap ">
                        {character.tags?.map((tag, idx) => (
                            <Badge key={`${character.id}-tag-${idx}`}>
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
                <CardDescription className="text-gray-400 text-sm line-clamp-3">
                    {character.description}
                </CardDescription>
                <div className="w-full  flex items-center justify-between text-xs text-gray-300">
                    <span className="">({character.visibility}) </span>
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

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="bg-primary/50 backdrop-blur-md border border-primary">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Character</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{character.name}"? This action cannot be undone and will permanently remove the character.
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

export default React.memo(CharacterCard);
