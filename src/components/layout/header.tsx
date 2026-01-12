"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Add this import
import { motion, AnimatePresence } from "framer-motion";
import Container from "../elements/container";
import ToolTipElement from "../elements/tooltip-element";
import { cn } from "@/lib/utils";

// ------- Icons -------
// ... your icon imports ...
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
import ChatHistoryDropdown from "../elements/chat-history-dropdown";



const Header: React.FC = () => {
  const pathname = usePathname(); // Get current route
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openSubDropdown, setOpenSubDropdown] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [pulsingIndex, setPulsingIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
console.warn(openSubDropdown)
  // --- Sync active index with current route ---
  interface HeaderItem { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; title: string; href?: string; iconClassName?: string; dropdown?: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; title: string; href?: string; type?: string; createdAt?: string; children?: { id: string; title: string, createdAt: string }[]; }[]; }
  // ------- Data -------
  const folderData = [
    { id: "chat-001", title: "Character A", createdAt: "31-01-1998" },
    { id: "chat-002", title: "Character B", createdAt: "01-03-2000" },
    { id: "chat-003", title: "Character C", createdAt: "15-08-2005" },
  ];

  const headerItems: HeaderItem[] = [
    {
      icon: Chat,
      title: "Chat",
      iconClassName: "h-16 w-16 text-primary",
      dropdown: [
        { icon: ModelSelection, type: "button", title: "Search Saved Chat" },
        { icon: LlmSettings, type: "button", title: "Saved Chat Menu" },
        {
          icon: Lorebook,
          title: "Folder Name 1",
          createdAt: "23-02-2002",
          children: folderData,
        },
        {
          icon: Lorebook,
          title: "Folder Name 2",
          createdAt: "12-05-2010",
          children: folderData,
        },
      ],
    },
    {
      icon: Models,
      title: "All Models",
      href: "/models",
      iconClassName: "h-24 w-24 text-primary",
      dropdown: [
        { icon: ModelSelection, title: "Model Selection", href: "/models-selection" },
        { icon: LlmSettings, title: "Model Tuning", href: "/models-tuning" },
      ],
    },
    {
      icon: YourUniverse,
      title: "Your Universe",
      href: "/universe",
      iconClassName: "h-24 w-24 text-primary",
      dropdown: [
        { icon: CharacterV1, title: "Characters", href: "/characters" },
        { icon: PersonaV1, title: "Personas", href: "/personas" },
        { icon: Lorebook, title: "Lorebook", href: "/lorebooks" },
        { icon: Folders, title: "Folders", href: "/folders" },
      ],
    },
    {
      icon: Community,
      title: "Community",
      href: "/community",
      iconClassName: "h-18 w-18 text-primary",
      dropdown: [
        { icon: Forum, title: "Forum", href: "/community/forum" },
        { icon: BugReport, title: "Bug & Feature Request", href: "/community/feature-request/create" },
      ],
    },
    {
      icon: Settings,
      title: "Settings",
      href: "/settings",
      iconClassName: "h-16 w-16 text-primary",
      dropdown: [
        { icon: Profile, title: "Profile", href: "/profile" },
        { icon: Background, title: "Background", href: "/background" },
        { icon: Download, title: "Download", href: "/download" },
        { icon: Subscriptions, title: "Subscriptions", href: "/subscriptions" },
      ],
    },
  ];

  useEffect(() => {
    // Find which header item matches the current route
    const findActiveIndex = () => {
      for (let i = 0; i < headerItems.length; i++) {
        const item = headerItems[i];

        // Check main href
        if (item.href && pathname.startsWith(item.href)) {
          return i;
        }

        // Check dropdown hrefs
        if (item.dropdown) {
          for (const drop of item.dropdown) {
            if (drop.href && pathname.startsWith(drop.href)) {
              return i;
            }
            // Check nested children (for chat routes)
            if (drop.children) {
              for (const child of drop.children) {
                if (pathname.startsWith(`/chat/${child.id}`)) {
                  return i;
                }
              }
            }
          }
        }
      }
      return null;
    };

    const newActiveIndex = findActiveIndex();
    setActiveIndex(newActiveIndex);
  }, [pathname]); // Re-run when route changes

  // --- Close dropdowns on outside click ---
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
        setOpenSubDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleSelect = () => {
    setOpenDropdown(null);
    setOpenSubDropdown(null);
    // Don't clear activeIndex here - it will be handled by the route change
  };

  // --- Glow & Pulse Logic ---
  const handleIconClick = (idx: number) => {
    setActiveIndex(idx);
    setPulsingIndex(idx);
    setOpenDropdown(openDropdown === idx ? null : idx);

    // stop pulse after 3 pulses (~2.4s)
    setTimeout(() => setPulsingIndex(null), 2400);
  };

  // const toggleSubDropdown = (idx: number) => {
  //   setOpenSubDropdown(openSubDropdown === idx ? null : idx);
  // };

  return (
    <header className="sticky top-0 z-50">
      <Container className="flex justify-center items-center py-6">
        <div className="flex items-center gap-8">
          {headerItems?.map((item, idx: number) => {
            const Icon = item.icon;
            const hasDropdown = !!item.dropdown;

            return (
              <div key={idx} className="relative">
                {hasDropdown ? (
                  <div className="relative">
                    <ToolTipElement discription={item.title}>
                      <button
                        type="button"
                        onMouseEnter={() => setHoverIndex(idx)}
                        onMouseLeave={() => setHoverIndex(null)}
                        onClick={() => handleIconClick(idx)}
                        className="focus:outline-none"
                      >
                        <Icon
                          className={cn(
                            "hover-neon transition-all duration-500 cursor-pointer",
                            item.iconClassName,
                            // Hover effects - only apply when this item is being hovered AND not active
                            hoverIndex === idx && activeIndex !== idx && "animate-soft-glow",
                            // Active effects - apply when this item is active, regardless of hover
                            activeIndex === idx && pulsingIndex !== idx && "animate-steady-glow active-neon",
                            activeIndex === idx && pulsingIndex === idx && "animate-pulse-glow active-neon"
                          )}
                        />
                      </button>
                    </ToolTipElement>

                    <AnimatePresence>
                      {openDropdown === idx && (
                        <motion.div
                          ref={dropdownRef}
                          className="absolute left-1/2 top-20 transform -translate-x-1/2 p-2 z-50"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <ul className="flex flex-col gap-2 items-center min-w-[300px]">

                            {
                              item.title === "Chat" &&
                              <ChatHistoryDropdown />
                            }
                            {item.dropdown?.map((drop, dIdx: number) => {
                              const DropIcon = drop.icon;

                              return (
                                <motion.li
                                  key={dIdx}
                                  initial={{ opacity: 0, y: -20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                >
                                  <ToolTipElement discription={drop.title}>
                                    {drop.href && (
                                      <Link href={drop.href} onClick={handleSelect}>
                                        <DropIcon className="w-16 h-16 hover-neon" />
                                      </Link>
                                    )}
                                  </ToolTipElement>
                                </motion.li>
                              );
                            })}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <ToolTipElement discription={item.title}>
                    <Link
                      href={item.href || "#"}
                      onMouseEnter={() => setHoverIndex(idx)}
                      onMouseLeave={() => setHoverIndex(null)}
                      onClick={() => handleIconClick(idx)}
                    >
                      <Icon
                        className={cn(
                          "transition-all duration-500 cursor-pointer",
                          item.iconClassName,
                          // Hover effects
                          hoverIndex === idx && activeIndex !== idx && "animate-soft-glow",
                          // Active effects
                          activeIndex === idx && pulsingIndex !== idx && "animate-steady-glow active-neon",
                          activeIndex === idx && pulsingIndex === idx && "animate-pulse-glow active-neon"
                        )}
                      />
                    </Link>
                  </ToolTipElement>
                )



                }
              </div>
            );
          })}
        </div>
      </Container>
    </header>
  );
};

export default Header;