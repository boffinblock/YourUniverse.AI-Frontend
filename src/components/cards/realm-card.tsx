import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardDescription } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "../ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    MoreVertical,
    SquarePen,
    HeartPlus,
    Heart,
    Trash
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import ChatIcon from "../icons/chat";
import { useUpdateRealm, useDeleteRealm, useToggleFavouriteRealm, useRealmChats } from "@/hooks";


interface Character {
    id: string;
    name: string;
    avatar?: { url: string };
    description?: string;
}

interface Realm {
    id: string;
    name: string;
    tags?: string[];
    description?: string;
    characters?: Character[];
    isFavourite?: boolean;
    rating?: "SFW" | "NSFW";
    visibility?: "public" | "private";
}
interface RealmCardProps {
    folder: Realm;
}

const RealmCard: React.FC<RealmCardProps> = ({
    folder, ...props
}) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const { chats: realmChats } = useRealmChats({
        realmId: folder.id,
        params: { limit: 3, sortBy: "updatedAt", sortOrder: "desc" },
    });

    const { deleteRealm, isDeleting } = useDeleteRealm({
        onSuccess: () => setDeleteDialogOpen(false)
    });

    const { toggleFavourite, isToggling } = useToggleFavouriteRealm();

    const isFavourite = folder.isFavourite || false;

    return (
        <div {...props} className="group relative rounded-4xl transition-all duration-500 ">
            {/* Folder Tab Effect */}
            <div className="absolute -top-10 left-0 h-10 w-32 bg-primary/30 backdrop-blur-xl border-t border-x border-primary/30 rounded-t-2xl flex items-center px-4">
                <div className="flex items-center gap-2">
                    <Checkbox
                        id={`realm-${folder.id}`}
                        className="size-5 border-primary/80 rounded-full bg-black/20 data-[state=checked]:bg-black/30 data-[state=checked]:border-primary"
                    />
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{folder?.rating}</span>
                </div>
            </div>

            {/* Main Card Body */}
            <Card className="relative overflow-hidden p-6 rounded-none rounded-b-3xl rounded-tr-3xl border  backdrop-blur-3xl border-white/10   group-hover:border-primary/50 transition-colors duration-500 bg-primary/20 ">
                {/* Glow Effect */}
                <div className="absolute -right-20 -top-20 size-40 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 size-40 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative z-10 space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1 flex-1">
                            <h2 className="text-xl font-bold text-white/80 group-hover:text-white transition-colors duration-300 tracking-tight">
                                {folder.name}
                            </h2>
                            <div className="flex gap-1.5 flex-wrap">
                                {folder.tags?.map((tag: string, idx: number) => (
                                    <Badge
                                        key={idx}
                                        className="bg-primary/10 text-foreground-muted/80 border-primary/50 text-sm px-3 py-1 "
                                    >
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="bg-primary/50 hover:bg-primary/70 size-8 text-white/70 hover:text-white rounded-full transition-all"
                                >
                                    <MoreVertical className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                    className="hover:bg-primary/20 transition cursor-pointer"
                                    onClick={() => toggleFavourite(folder.id, isFavourite)}
                                    disabled={isToggling}
                                >
                                    {isFavourite ? (
                                        <>
                                            <Heart className="w-4 h-4 mr-2 text-red-500 fill-red-500" />
                                            Remove Favourite
                                        </>
                                    ) : (
                                        <>
                                            <HeartPlus className="w-4 h-4 mr-2" />
                                            Add to Favourites
                                        </>
                                    )}
                                </DropdownMenuItem>

                                <Link href={`/realms/${folder.id}/edit`}>
                                    <DropdownMenuItem className="hover:bg-primary/20 transition cursor-pointer">
                                        <SquarePen className="w-4 h-4 mr-2" /> Edit
                                    </DropdownMenuItem>
                                </Link>

                                <Link href={`/realms/${folder.id}/chat`}>
                                    <DropdownMenuItem className="hover:bg-primary/20 transition cursor-pointer">
                                        <ChatIcon className="text-white w-4 h-4 mr-2" /> Chat with {folder.name}
                                    </DropdownMenuItem>
                                </Link>

                                <DropdownMenuItem
                                    variant="destructive"
                                    className="cursor-pointer"
                                    onClick={() => setDeleteDialogOpen(true)}
                                    disabled={isDeleting}
                                >
                                    <Trash className="w-4 h-4 mr-2" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Description */}
                    <CardDescription className="text-white/70 text-sm leading-relaxed line-clamp-3 italic">
                        "{folder.description}"
                    </CardDescription>

                    {/* Characters Section */}
                    {folder.characters && folder.characters.length > 0 && (
                        <div className="pt-2 border-t border-white/10">
                            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-3">Members</h3>
                            <Accordion type="single" collapsible className="w-full space-y-2 border-none">
                                {folder.characters.map((char: Character) => (
                                    <AccordionItem
                                        key={char.id}
                                        value={`item-${char.id}`}
                                        className="border-none bg-primary/10 rounded-xl overflow-hidden px-1 transition-all "
                                    >
                                        <AccordionTrigger className="flex items-center text-white/90 py-2 px-3 hover:no-underline group/item">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <Avatar className="size-8 border border-white/30  transition-all duration-500">
                                                        {char.avatar?.url ? (
                                                            <AvatarImage
                                                                src={char.avatar.url}
                                                                alt={char.name}
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <AvatarFallback className="bg-primary/20 text-[10px]">
                                                                {char.name.slice(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                </div>
                                                <span className="text-sm font-medium tracking-wide">{char.name}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-3">
                                            <div className=" ">
                                                <p className="text-white/50 text-xs leading-relaxed italic line-clamp-5">
                                                    {char.description || "No description available for this initiate."}
                                                </p>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    )}

                    {/* Recent realm chats */}
                    {/* {realmChats.length > 0 && (
                        <div className="pt-2 border-t border-white/10">
                            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">Recent chats</h3>
                            <ul className="space-y-1">
                                {realmChats.map((chat: { id: string; title?: string | null }) => (
                                    <li key={chat.id}>
                                        <Link
                                            href={`/realms/${folder.id}/chat/${chat.id}`}
                                            className="text-sm text-white/70 hover:text-white transition-colors line-clamp-1"
                                        >
                                            {chat.title || "Untitled chat"}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )} */}
                </div>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>

                <AlertDialogContent className="bg-primary/50 backdrop-blur-md border border-primary">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Realm</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{folder.name}"? This action cannot be undone and will permanently remove the character.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteRealm(folder.id)}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default RealmCard;
