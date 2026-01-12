"use client"
import React from "react";
import Container from "../elements/container";
import Link from "next/link";
import { usePathname } from "next/navigation";
// icons
import Chat from "@/components/icons/chat";
import Models from "@/components/icons/models";
import Settings from "@/components/icons/settings";
import Community from "@/components/icons/community";
import ModelSelection from "@/components/icons/model-selection";
import LlmSettings from "@/components/icons/llm-settings";
import CharacterV1 from "@/components/icons/character-v1";
import PersonaV1 from "@/components/icons/persona-v1";
import Lorebook from "@/components/icons/lorebook";
import Forum from "@/components/icons/forum";
import BugReport from "@/components/icons/bug-report";
import Profile from "@/components/icons/profile";
import Background from "@/components/icons/background";
import Download from "@/components/icons/download";
import Subscriptions from "@/components/icons/subscriptions";
import YourUniverse from "../icons/your-universe";
import Folders from "../icons/folders";

// shadcn navigation menu
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils";
import ChatHistoryDropdown from "../elements/chat-history-dropdown";
import ToolTipElement from "../elements/tooltip-element";
type SvgIcon = React.FC<React.SVGProps<SVGSVGElement>>;
interface HeaderItem {
    icon: SvgIcon;
    title: string;
    href?: string;
    iconClassName?: string;
    dropdown?: {
        icon: SvgIcon;
        title: string;
        href?: string;
        iconClassName?: string,
    }[];
}

const Header2 = () => {
    const pathname = usePathname();

    const headerItems: HeaderItem[] = [
        {
            icon: Chat,
            title: "Chat",
            href: "/chat",
            iconClassName: "h-16 w-16",
            dropdown: [
                { icon: ModelSelection, title: "Search Saved Chat", href: "/chat/search" },
                { icon: LlmSettings, title: "Saved Chat Menu", href: "/chat/saved" },
            ],
        },
        {
            icon: Models,
            title: "Models",
            href: "/models",
            iconClassName: "h-24 w-24",
            dropdown: [
                { icon: ModelSelection, title: "Model Selection", href: "/models-selection" },
                { icon: LlmSettings, title: "Model Tuning", href: "/models-tuning" },
            ],
        },
        {
            icon: YourUniverse,
            title: "Your Universe",
            href: "/universe",
            iconClassName: "h-25 w-25",
            dropdown: [
                { icon: CharacterV1, title: "Characters", href: "/characters" },
                { icon: PersonaV1, title: "Personas", href: "/personas" },
                { icon: Lorebook, title: "Lorebook", href: "/lorebooks" },
                { icon: Folders, title: "Realms", href: "/folders" },
            ],
        },
        {
            icon: Community,
            title: "Community",
            href: "/community",
            iconClassName: "h-18 w-18",
            dropdown: [
                { icon: Forum, title: "Forum", href: "/community/forum" },
                { icon: BugReport, title: "Bug & Feature Request", href: "/community/feature-request/create" },
            ],
        },
        {
            icon: Settings,
            title: "Settings",
            href: "/settings",
            iconClassName: "h-16 w-16",
            dropdown: [
                { icon: Profile, iconClassName: "h-16 w-16", title: "Profile", href: "/profile" },
                { icon: Background, iconClassName: "h-16 w-16", title: "Background", href: "/background" },
                { icon: Download, iconClassName: "h-16 w-16", title: "Download", href: "/download" },
                { icon: Subscriptions, iconClassName: "h-16 w-16", title: "Subscriptions", href: "/subscriptions" },
            ],
        },
    ];

    // 🔥 Helper: check if this main item or any of its dropdown items matches pathname
    const isActive = (item: HeaderItem) => {
        if (item.href && pathname.startsWith(item.href)) return true;
        if (item.dropdown?.some(d => d.href && pathname.startsWith(d.href))) return true;
        return false;
    };

    return (
        <header className="sticky top-0 z-50">
            <Container className="flex justify-center items-center py-4">
                <div className="flex items-center gap-x-10">
                    {headerItems.map((item, idx) => {
                        const Icon = item.icon;
                        const active = isActive(item);

                        return (
                            <NavigationMenu key={idx} className="h-fit py-6" delayDuration={999999}
                            >
                                <NavigationMenuList className="">
                                    <NavigationMenuItem className="">
                                        <ToolTipElement discription={item.title}>

                                            {/* TRIGGER */}
                                            <NavigationMenuTrigger className="!bg-transparent items-center flex p-0 shadow-none">
                                                <Icon
                                                    className={cn(
                                                        "cursor-pointer transition-all duration-300 hover-neon",
                                                        item.iconClassName,
                                                        active && "active-neon"
                                                    )}
                                                />
                                            </NavigationMenuTrigger>
                                        </ToolTipElement>

                                        {/* DROPDOWN CONTENT */}
                                        {item.dropdown && (
                                            <NavigationMenuContent className=" p-6 pt-0 ">
                                                {
                                                    item.title === "Chat" &&
                                                    <ChatHistoryDropdown />
                                                }
                                                <ul className="">
                                                    {item.title !== "Chat" && item.dropdown.map((drop, dIdx) => {
                                                        const DropIcon = drop.icon;
                                                        const dropActive =
                                                            drop.href && pathname.startsWith(drop.href);

                                                        return (
                                                            <li key={dIdx} className="py-1">
                                                                <ToolTipElement discription={drop.title}>

                                                                    <NavigationMenuLink className="" asChild>
                                                                        <Link href={drop.href || "#"} className=" ">
                                                                            <DropIcon
                                                                                className={cn(
                                                                                    "cursor-pointer transition-all hover-neon ",
                                                                                    "h-16 w-16",
                                                                                    dropActive &&
                                                                                    "active-neon"
                                                                                )}

                                                                            />
                                                                        </Link>
                                                                    </NavigationMenuLink>
                                                                </ToolTipElement>

                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </NavigationMenuContent>
                                        )}
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        );
                    })}

                </div>
            </Container>
        </header>
    );
};

export default Header2;
