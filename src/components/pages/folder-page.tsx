"use client"
import React, { useState } from 'react'
import { Menu } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button'
import { PaginationComponent } from '../elements/pagination-element';
import FolderCard from '../cards/folder-card';
import { MasonryGrid } from '../elements/masonry-grid'
import Link from 'next/link'
import SearchField from '../elements/search-field'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DataNotFound from '../elements/data-not-found'
import { ToggleSwitch } from '../elements/toggle-switch'
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

export const folderItems: Folder[] = [
    {
        id: 1,
        name: "AI Projects",
        tags: ["AI", "ML", "NLP"],
        description: "Contains AI project files, models, and datasets.",
        characters: [
            { id: 101, name: "ChatGPT", avatar: "https://github.com/shadcn.png", description: "Conversational AI model." },
            { id: 102, name: "Gemma", avatar: "https://randomuser.me/api/portraits/women/68.jpg", description: "NLP specialist AI." },
            { id: 103, name: "Gemma", avatar: "https://randomuser.me/api/portraits/women/68.jpg", description: "NLP specialist AI." },

            { id: 104, name: "Gemma", avatar: "https://randomuser.me/api/portraits/women/68.jpg", description: "NLP specialist AI." },

            { id: 105, name: "Gemma", avatar: "https://randomuser.me/api/portraits/women/68.jpg", description: "NLP specialist AI." },

            { id: 106, name: "Gemma", avatar: "https://randomuser.me/api/portraits/women/68.jpg", description: "NLP specialist AI." },

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
            { id: 203, name: "Bob", avatar: "https://randomuser.me/api/portraits/men/32.jpg", description: "UX designer." },
            { id: 204, name: "Bob", avatar: "https://randomuser.me/api/portraits/men/32.jpg", description: "UX designer." },
        ]
    },
    {
        id: 3,
        name: "Marketing",
        tags: ["Campaign", "Social", "Ads"],
        description: "Marketing campaigns and social media assets.",
        characters: [
            { id: 301, name: "Eve", avatar: "https://randomuser.me/api/portraits/women/22.jpg", description: "Marketing strategist." },
            { id: 302, name: "Eve", avatar: "https://randomuser.me/api/portraits/women/22.jpg", description: "Marketing strategist." },

        ]
    },
    {
        id: 4,
        name: "Product Docs",
        tags: ["Docs", "Specs", "Guides"],
        description: "Technical documentation, guides, and manuals.",
        characters: [
            { id: 401, name: "John", avatar: "https://randomuser.me/api/portraits/men/10.jpg", description: "Technical writer." },
            { id: 402, name: "Sara", avatar: "https://randomuser.me/api/portraits/women/12.jpg", description: "Docs reviewer." }
        ]
    },
    {
        id: 5,
        name: "Research Papers",
        tags: ["AI", "Data", "ML"],
        description: "Collection of AI research papers and studies.",
        characters: [
            { id: 501, name: "Dr. Smith", avatar: "https://randomuser.me/api/portraits/men/45.jpg", description: "Lead researcher." }
        ]
    },
    {
        id: 6,
        name: "Client Presentations",
        tags: ["Slides", "Pitch", "Demo"],
        description: "PowerPoint presentations for client meetings.",
        characters: [
            { id: 601, name: "Emma", avatar: "https://randomuser.me/api/portraits/women/55.jpg", description: "Presentation designer." }
        ]
    },
    {
        id: 7,
        name: "Finance Reports",
        tags: ["Budget", "Revenue", "Analytics"],
        description: "Monthly and quarterly financial reports.",
        characters: [
            { id: 701, name: "Mark", avatar: "https://randomuser.me/api/portraits/men/65.jpg", description: "Finance analyst." }
        ]
    },
    {
        id: 8,
        name: "HR Policies",
        tags: ["Employee", "Policy", "Guidelines"],
        description: "HR manuals, policies, and employee guides.",
        characters: [
            { id: 801, name: "Linda", avatar: "https://randomuser.me/api/portraits/women/33.jpg", description: "HR manager." }
        ]
    },
    {
        id: 9,
        name: "Development",
        tags: ["Code", "Repo", "Docs"],
        description: "Source code repositories and dev documentation.",
        characters: [
            { id: 901, name: "Tom", avatar: "https://randomuser.me/api/portraits/men/20.jpg", description: "Frontend dev." },
            { id: 902, name: "Jerry", avatar: "https://randomuser.me/api/portraits/men/21.jpg", description: "Backend dev." }
        ]
    },
    {
        id: 10,
        name: "Product Feedback",
        tags: ["Survey", "User", "Feedback"],
        description: "User surveys and product feedback reports.",
        characters: [
            { id: 1001, name: "Nina", avatar: "https://randomuser.me/api/portraits/women/18.jpg", description: "Product researcher." }
        ]
    }
];
const FolderPage = () => {
    const [page, setPage] = useState(1)

    return (
        <div className='flex flex-col h-full pt-10' >
            <div className='space-y-4 w-full max-w-3xl mx-auto'>
                <div className='flex flex-1 items-center gap-x-4 '>
                    <SearchField placeholder='Search for Realm, Character name, or description' />
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="rounded-full">
                                    Realm Menu <Menu className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-72" align="end">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>Show Favorites Only</DropdownMenuItem>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Set Default View</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem>Favourites</DropdownMenuItem>
                                                <DropdownMenuItem>Private Realms only</DropdownMenuItem>
                                                <DropdownMenuItem>Public Realms only</DropdownMenuItem>
                                                <DropdownMenuItem>Private and Public Realms</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Alphabetical Order</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem>A - Z</DropdownMenuItem>
                                                <DropdownMenuItem>Z - A</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>

                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Date Order</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem>Oldest to Newest</DropdownMenuItem>
                                                <DropdownMenuItem>Newest to Oldest</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>

                                    <Link href={"/folders/create"}><DropdownMenuItem>Create Realm</DropdownMenuItem></Link>


                                    <DropdownMenuItem variant='destructive'>Delete Realm</DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                   <div className='flex items-center justify-center gap-4 w-full '>
                        <SearchField placeholder='Search by Realm or Character Tag' />
                        <SearchField placeholder='Tags to exclude from search' />
                        <ToggleSwitch
                            options={[
                                { label: "NSFW", value: "NSFW" },
                                { label: "SFW", value: "SFW" },
                            ]}
                            defaultValue='SFW'
                        />
                    </div>
            </div>
            <Tabs defaultValue="all" className="mt-4 space-y-2 flex-1" >
                <TabsList className="w-full">
                    <TabsTrigger value="all">All </TabsTrigger>
                    <TabsTrigger value="favourite">Favourites </TabsTrigger>


                </TabsList>
                <TabsContent value="all" >
                    <div className='flex-1 mt-8'>
                        <div className='h-full w-full'>
                            <MasonryGrid
                                items={folderItems}
                                className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 "
                                renderItem={(folder) => (
                                    <FolderCard
                                        folder={folder}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="favourite" >
                    <DataNotFound />

                </TabsContent>

            </Tabs>

            <div className="mt-6">
                <PaginationComponent
                    currentPage={page}
                    totalPages={10}
                    onPageChange={(p) => setPage(p)}
                />
            </div>

        </div>
    )
}

export default FolderPage