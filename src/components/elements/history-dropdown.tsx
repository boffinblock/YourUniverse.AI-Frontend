"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    ChevronRight,
    Edit3,
    Folder,
    FolderPlus,
    MoreVertical,
    Save,
    Trash2,
} from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Card } from "../ui/card";
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
import { CreateFolderModal } from "../modals/create-folder-modal";

interface Character {
    id: number;
    name: string;
    avatar?: string;
    description: string;
}

interface Folder {
    id: number;
    name: string;
    tags: string[];
    description: string;
    characters: Character[];
}

const recentChats: Character[] = [
    { id: 1, name: "Project Assistant", avatar: "https://github.com/shadcn.png", description: "Your AI assistant for coding projects." },
    { id: 2, name: "Lore Master", avatar: "https://randomuser.me/api/portraits/women/44.jpg", description: "Keeper of the universe's history." },
    { id: 3, name: "System Debugger", avatar: "https://randomuser.me/api/portraits/men/32.jpg", description: "Helping you fix those pesky bugs." },
    { id: 4, name: "UI Specialist", avatar: "https://randomuser.me/api/portraits/women/68.jpg", description: "Expert in frontend designs." },
    { id: 5, name: "Data Analyst", avatar: "https://randomuser.me/api/portraits/men/45.jpg", description: "Crunching numbers for you." },
    { id: 6, name: "DevOps Engineer", avatar: "https://randomuser.me/api/portraits/men/21.jpg", description: "Handling your deployments." },
];

const folderItems: Folder[] = [
    {
        id: 1,
        name: "AI Projects",
        tags: ["AI", "ML", "NLP"],
        description: "Contains AI project files, models, and datasets.",
        characters: [
            { id: 101, name: "ChatGPT", avatar: "https://github.com/shadcn.png", description: "Conversational AI model." },
            { id: 102, name: "Gemma", avatar: "https://randomuser.me/api/portraits/women/68.jpg", description: "NLP specialist AI." },
        ]
    },
    {
        id: 2,
        name: "Design Assets",
        tags: ["UI", "UX", "Figma"],
        description: "Wireframes, prototypes, icons, and design files.",
        characters: [
            { id: 201, name: "Alice", avatar: "https://randomuser.me/api/portraits/women/44.jpg", description: "Lead UI designer." },
            { id: 202, name: "Bob", avatar: "https://randomuser.me/api/portraits/men/32.jpg", description: "UX designer." },
        ]
    },
    {
        id: 3,
        name: "Marketing",
        tags: ["Ads"],
        description: "Campaigns and assets.",
        characters: []
    },
    {
        id: 4,
        name: "Research",
        tags: ["Papers"],
        description: "Scientific papers.",
        characters: []
    },
    {
        id: 5,
        name: "Finance",
        tags: ["Reports"],
        description: "Financial reports.",
        characters: []
    },
    {
        id: 6,
        name: "HR",
        tags: ["Policies"],
        description: "Company policies.",
        characters: []
    }
];

const ChatItem = ({ char }: { char: Character }) => (
    <div className="flex items-center justify-between group py-1">
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
    return (
        <div className="border min-w-[300px] rounded-2xl border-primary bg-primary/20 backdrop-blur-md w-full p-3 shadow-xl">
            <Accordion type="multiple" defaultValue={["recent", "folders"]} className="space-y-2">

                {/* Folders Section */}
                <AccordionItem value="folders" className="border-none mb-0 pb-0">
                    <AccordionTrigger className="hover:no-underline py-2 text-white/60 hover:text-white text-sm font-semibold uppercase tracking-wider">
                        Folders
                    </AccordionTrigger>
                    <AccordionContent>
                        <CreateFolderModal>
                            <div className="flex items-center bg-primary/30 p-2 hover:bg-primary/50 transition-colors rounded-lg gap-2 cursor-pointer">
                                <FolderPlus className="h-4.5 w-4.5 text-white/60 transition-transform duration-200" />
                                <span className="text-white/80 group-hover:text-white transition duration-300 truncate max-w-[150px]">
                                    Create New Folder
                                </span>
                            </div>
                        </CreateFolderModal>
                        <div className="space-y-3  mt-2">
                            {/* Folders List */}
                            <div className="max-h-[160px] overflow-y-auto pr-1 custom-scrollbar space-y-1">
                                {folderItems.map((folder) => (
                                    <div key={folder.id} className="group px-2 flex items-center justify-between w-full pr-1 py-0.5 rounded-lg hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <Folder className="h-4.5 w-4.5 text-white/60 transition-transform duration-200" />
                                            <span className="text-white/80 group-hover:text-white transition duration-300 truncate max-w-[120px] cursor-pointer">
                                                {folder.name}
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
                                ))}
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
        </div>
    );
};

export default HistoryDropdown;
