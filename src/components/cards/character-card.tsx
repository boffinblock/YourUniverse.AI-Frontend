"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FolderPlus, HeartPlus, Heart, Link2, MoreVertical, Save, BookmarkCheck, Share2, SquarePen, Upload, Trash, CopyPlus, MessageSquareMore, MessagesSquare } from "lucide-react";
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
import { useToggleFavourite, useToggleSaved, useDeleteCharacter, useDuplicateCharacter, useExportCharacter, useExportEntity } from "@/hooks";
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
    const avatarUrl = useMemo(() => character.avatar?.url || "/logo1.png", [character.avatar?.url]);
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

    // Export character hook (Server-side)
    const { exportCharacter, isLoading: isExportingJson } = useExportCharacter({
        showToasts: true,
    });

    // Client-side Export hook (PNG/JSON)
    const { exportPng, isExporting: isExportingPng } = useExportEntity({
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

    // Handle JSON export click
    const handleExportJsonClick = useMemo(() => {
        return () => {
            exportCharacter(character.id, "json");
        };
    }, [character.id, exportCharacter]);

    // Handle PNG export click
    const handleExportPngClick = useMemo(() => {
        return () => {
            // Prepare clean character data for embedding
            const exportData = {
                name: character.name,
                description: character.description,
                scenario: character.scenario,
                summary: character.summary,
                rating: character.rating,
                visibility: character.visibility,
                tags: character.tags,
                firstMessage: character.firstMessage,
                alternateMessages: character.alternateMessages,
                exampleDialogues: character.exampleDialogues,
                authorNotes: character.authorNotes,
                characterNotes: character.characterNotes,
                exportedAt: new Date().toISOString(),
                version: "1.0",
                source: "BoffinBlocks"
            };
            exportPng(exportData, character.name, character.avatar?.url);
        };
    }, [character, exportPng]);

    const chatCount = character.chatCount ?? 0;
    const chatCountFormatted = chatCount >= 1000 ? `${(chatCount / 1000).toFixed(1)}k` : chatCount.toString();

    return (
        <Card
            className={cn(
                "group rounded-2xl w-full overflow-hidden bg-primary/20 backdrop-blur-xl border border-white/10",
                "hover:border-primary/50 hover:bg-primary/25 hover:shadow-lg hover:shadow-primary/10",
                "transition-all duration-300 ease-out relative flex flex-row min-h-[200px]"
            )}
        >
            {/* Left: Character image - 40% width, full height */}
            <CardHeader className="p-0 m-0 relative shrink-0 w-[40%] min-w-[40%] self-stretch overflow-hidden border-r border-white/5 rounded-l-2xl">
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 text-white drop-shadow-lg">
                    <Checkbox
                        id={`character-${character.id}`}
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                            onSelect?.(character.id, checked === true);
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
                        <DropdownMenuContent
                            align="end"
                        // className=" bg-gray-900 text-white border border-gray-800"
                        >
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="w-full  space-x-4"><Link2 className="w-4 h-4 mr-4 text-white" /> Link</DropdownMenuSubTrigger>
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

                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="w-full  space-x-4"><Upload className="w-4 h-4 mr-4 text-white" />  Export</DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem
                                            onClick={handleExportPngClick}
                                            disabled={isExportingPng}
                                        >
                                            <Upload className="w-4 h-4 mr-2 text-white" />.Png
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={handleExportJsonClick}
                                            disabled={isExportingJson}
                                        >
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
                            <Link href={`/chat/new/char/${character.id}`}>
                                <DropdownMenuItem className="hover:bg-gray-800 transition cursor-pointer">
                                    <Chat className=" mr-2 w-4  h-4 text-white " /> Chat With Me
                                </DropdownMenuItem>
                            </Link>
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
                {/* Gradient overlay for better text contrast */}
                <div className="absolute inset-0 z-1 bg-linear-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <Avatar className="absolute inset-0 cursor-pointer rounded-none w-full h-full transition-transform duration-300 group-hover:scale-105">
                    <AvatarImage
                        src={avatarUrl}
                        alt={character.name}
                        className="aspect-auto object-cover object-center w-full h-full brightness-75"
                    />
                    <AvatarFallback className="rounded-none w-full h-full bg-primary/30 text-3xl font-bold text-white/90 flex items-center justify-center">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </CardHeader>

            {/* Right: Content + Footer */}
            <div className="flex flex-col flex-1 min-w-0">
                <CardContent className="space-y-2.5 py-4 px-5 flex-1">
                    <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-white font-semibold text-lg capitalize leading-tight truncate">
                            {character.name}
                        </CardTitle>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-xs text-muted-foreground/80 font-medium tabular-nums">{tokens.toLocaleString()} tokens</span>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize font-normal">
                                {character.rating}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Rating value={3.5} size={12} readOnly={true} />
                        <span className="text-xs">({chatCountFormatted} chats)</span>
                    </div>
                    {hasTags && (
                        <div className="flex gap-1.5 flex-wrap">
                            {character.tags?.slice(0, 5).map((tag, idx) => (
                                <Badge key={`${character.id}-tag-${idx}`} variant="outline" className="text-[10px] px-2 py-0 font-normal border-white/20 text-white/70">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                    <CardDescription className="text-muted-foreground/90 text-sm line-clamp-3 leading-relaxed">
                        {character.description || "No description"}
                    </CardDescription>
                    <div className="flex items-center justify-between text-xs text-muted-foreground/70">
                        <span className="capitalize">{character.visibility}</span>
                        <Link href={`/chat/new/char/${character.id}`} onClick={(e) => e.stopPropagation()}>
                            <Button size="sm" variant="ghost" className="h-7 px-2 cursor-pointer group bg-primary/20 text-xs gap-1.5 -mr-2 rounded-full">
                                <MessagesSquare className="w-3.5 h-3.5 " />
                                Chat
                            </Button>
                        </Link>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between items-center px-5 py-2 border-t border-white/5 text-[10px] text-muted-foreground/60 mt-auto gap-2">
                    <span>Created {formattedCreatedDate}</span>
                    <span>Updated {formattedUpdatedDate}</span>
                </CardFooter>
            </div>

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
