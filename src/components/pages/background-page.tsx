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
import BackgroundCard from '../cards/background-card';
import { PaginationComponent } from '../elements/pagination-element';
import SearchField from '../elements/search-field'
import { ToggleSwitch } from '../elements/toggle-switch'
const BackgroundPage = () => {
    const [page, setPage] = useState(1)

    return (
        <div className='flex flex-col h-full ' >
            <div className=' max-w-3xl mx-auto w-full space-y-4'>

                <div className='w-full flex items-center gap-x-4 mt-10'>
                    <SearchField placeholder='Search by background name or description' />

                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="rounded-full">
                                    Background Menu <Menu className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-72" align="end" >
                                <DropdownMenuGroup>
                                    <DropdownMenuItem className='gap-1'>Link Selected to Account</DropdownMenuItem>
                                    <DropdownMenuItem className='gap-1'>Make Selected  Global Default</DropdownMenuItem>
                                    <DropdownMenuItem className='gap-1'>Duplicate Selected </DropdownMenuItem>

                                    {/* Add To submenu */}
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Add to</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem>Character</DropdownMenuItem>
                                                <DropdownMenuItem>Persona</DropdownMenuItem>
                                                <DropdownMenuItem>LoreBook</DropdownMenuItem>
                                                <DropdownMenuItem>Realm</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>

                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Import</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem>Import Selected</DropdownMenuItem>
                                                <DropdownMenuItem>Bulk Import</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>

                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Export</DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem>Export Selected</DropdownMenuItem>
                                                <DropdownMenuItem>Bulk Export</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>

                                    <DropdownMenuItem className='gap-1'>Share Selected </DropdownMenuItem>
                                    <DropdownMenuItem variant='destructive' className='gap-1' >Delete Selected </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className='flex items-center justify-center gap-4 w-full '>
                    <SearchField placeholder='Search by background tag' />
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

            <div className='flex-1 mt-10'>
                <div className='grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4  gap-4'>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                        <BackgroundCard key={item} />
                    ))}
                </div>

            </div>
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

export default BackgroundPage