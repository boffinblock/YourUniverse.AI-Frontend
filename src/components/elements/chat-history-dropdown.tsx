"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    ChevronRight,
    Edit3,
    FolderPlus,
    Menu,
    Save,
    Trash2,
    XCircle,
} from "lucide-react";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";

import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Card } from "../ui/card";

const chatFolders = [
    {
        id: "folder_001",
        name: "Project Discussions",
        date: "2025-11-12",
        chats: [
            { id: "chat_001", name: "UI Update Chat", date: "2025-11-12" },
            { id: "chat_002", name: "API Integration Notes", date: "2025-11-11" },
        ],
    },

    {
        id: "folder_002",
        name: "Personal Ideas",
        date: "2025-11-10",
        chats: [
            { id: "chat_003", name: "AI Voice Concept", date: "2025-11-10" },
            { id: "chat_004", name: "UI Theme Exploration", date: "2025-11-09" },
        ],
    },

    {
        id: "folder_003",
        name: "Bug Reports",
        date: "2025-11-08",
        chats: [
            { id: "chat_005", name: "Validation Issue Fix", date: "2025-11-08" },
            { id: "chat_006", name: "Redux Optimization", date: "2025-11-07" },
        ],
    },
];

const ChatHistoryDropdown = () => {
    const [openFolder, setOpenFolder] = useState<string | null>(null);
    const [checked, setChecked] = useState<Record<string, boolean>>({});

    const toggleChecked = (id: string) => {
        setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="border min-w-[250px] rounded-2xl border-primary bg-primary/30 backdrop-blur-sm w-full p-4">
            <div className="space-y-1">
                <div className="flex gap-x-2 items-center">
                    <Input
                        type="text"
                        placeholder="Search"
                        className="rounded-xl !bg-transparent w-full"
                    />

                    {/* MAIN MENU BUTTON */}
                    <NavigationMenu delayDuration={999999}>
                        <NavigationMenuList>
                            <NavigationMenuItem className="">
                                <NavigationMenuTrigger className="!p-0 !bg-transparent rounded-xl">
                                    <Button className="rounded-xl">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </NavigationMenuTrigger>

                                <NavigationMenuContent className="h-fit absolute bg-primary/30 border-primary left-50 whitespace-nowrap backdrop-blur-3xl ">
                                    <Card className="  border w-fit rounded-2xl border-primary text-muted-foreground  p-1">

                                        <div className="px-3 py-1.5 text-sm font-semibold text-muted-foreground">
                                            Chat Menu
                                        </div>

                                        <div className="border-t border-primary mt-1" />

                                        <div className="flex flex-col text-white gap-2 p-2">
                                            <button className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-primary">
                                                <Save className="w-4 h-4" />
                                                <span>Save Current Chat</span>
                                            </button>

                                            <button className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-primary">
                                                <FolderPlus className="w-4 h-4" />
                                                <span>Create Chat Folder</span>
                                            </button>

                                            <button className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-primary">
                                                <Edit3 className="w-4 h-4" />
                                                <span>Rename Selected Chat or Folder</span>
                                            </button>

                                            <div className="border-t border-primary" />

                                            <button className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-primary text-destructive">
                                                <Trash2 className="w-4 h-4" />
                                                <span>Delete Current Chat</span>
                                            </button>

                                            <button className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-primary text-destructive">
                                                <XCircle className="w-4 h-4" />
                                                <span>Delete Selected Chats & Folders</span>
                                            </button>
                                        </div>
                                    </Card>

                                </NavigationMenuContent>

                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="mt-4">
                    <h2 className="text-white">Folders</h2>
                </div>

                {/* FOLDER LIST */}
                <div className="relative border border-primary text-white rounded-xl">
                    {chatFolders.map((folder) => {
                        const isOpen = openFolder === folder.id;

                        return (
                            <div
                                key={folder.id}
                                className="relative flex items-center gap-2 w-full border-b border-primary last:border-none py-2 px-4 hover:bg-primary/20 cursor-pointer"
                                onClick={() =>
                                    setOpenFolder((prev) => (prev === folder.id ? null : folder.id))
                                }
                            >
                                {/* Folder Checkbox */}
                                <Checkbox
                                    id={`folder-${folder.id}`}
                                    className="bg-black/30 border-primary data-[state=checked]:bg-gray-900 cursor-pointer data-[state=checked]:text-white text-white rounded-full size-5"
                                />

                                {/* Folder Name */}
                                <span className="flex-1 whitespace-nowrap">{folder.name}</span>

                                {/* Arrow */}
                                <ChevronRight
                                    className={`ml-2 h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-90" : ""
                                        }`}
                                />

                                {/* RIGHT-SIDE POP OUT PANEL */}
                                {isOpen && (
                                    <div
                                        className="
                                            absolute top-0 left-full ml-6 
                                            w-72 max-h-[300px] 
                                            overflow-y-auto
                                            rounded-xl border border-primary 
                                            bg-primary/30 backdrop-blur-xl 
                                            shadow-xl p-2 
                                            z-20
                                            animate-in fade-in slide-in-from-left-4 duration-300
                                        "
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="space-y-2">
                                            {folder.chats.map((chat) => (
                                                <div
                                                    key={chat.id}
                                                    className="flex items-center gap-2 border border-primary rounded-xl py-1 px-3 hover:bg-primary/20"
                                                >
                                                    {/* Chat Checkbox */}
                                                    <Checkbox
                                                        id={`chat-${chat.id}`}
                                                        checked={!!checked[chat.id]}
                                                        onCheckedChange={() => toggleChecked(chat.id)}
                                                        className="bg-black/30 border-primary data-[state=checked]:bg-gray-900 cursor-pointer data-[state=checked]:text-white text-white rounded-full size-5"
                                                    />

                                                    {/* Link */}
                                                    <Link
                                                        href={`/chat/${chat.id}`}
                                                        className="flex-1 py-1 text-white"
                                                    >
                                                        {chat.name}
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>


            </div>
        </div>
    );
};

export default ChatHistoryDropdown;
