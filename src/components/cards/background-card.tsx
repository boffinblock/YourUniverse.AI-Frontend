import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Download, FolderSymlink, Image as ImageIcon, MoreVertical, Trash2, Globe } from 'lucide-react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox';
import type { Background } from '@/lib/api/backgrounds';
import LinkBackgroundDialog from '../elements/link-background-dialog';

interface BackgroundCardProps {
    background: Background;
    selected?: boolean;
    onSelectChange?: (id: string, checked: boolean) => void;
    onSetDefault?: (id: string) => void;
    onDownload?: (id: string) => void;
    onDelete?: (id: string) => void;
    className?: string;
}

const BackgroundCard: React.FC<BackgroundCardProps> = ({
    background,
    selected = false,
    onSelectChange,
    onSetDefault,
    onDownload,
    onDelete,
    className = '',
    ...props
}) => {
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

    const imageUrl = typeof background.image === 'object' && background.image?.url
        ? background.image.url
        : typeof background.image === 'string'
            ? background.image
            : undefined;

    const handleCheckboxChange = (checked: boolean) => {
        onSelectChange?.(background.id, checked);
    };

    return (
        <>
            <div {...props} className={`relative rounded-4xl border border-primary bg-primary/30 backdrop-blur-2xl overflow-hidden group aspect-video ${className}`}>
                <Avatar className="w-full h-full rounded-none brightness-75">
                    <AvatarImage
                        src={imageUrl}
                        alt={background.name || 'Background'}
                        className="object-cover group-hover:scale-105 rounded-none duration-500"
                    />
                    <AvatarFallback className="bg-primary/10 text-white object-cover group-hover:scale-105 rounded-none duration-500">
                        {background.name?.charAt(0)?.toUpperCase() || 'BG'}
                    </AvatarFallback>
                </Avatar>
                <div className='absolute top-0 left-0 w-full flex justify-between items-center p-2'>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id={`background-${background.id}`}
                            checked={selected}
                            onCheckedChange={handleCheckboxChange}
                            className="bg-gray-900 border-none data-[state=checked]:bg-gray-900 cursor-pointer data-[state=checked]:text-white text-white rounded-full size-5"
                        />
                        {background.isGlobalDefault && (
                            <div className="bg-primary px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] text-white font-medium border border-white/20">
                                <Globe className="size-2.5" />
                                Default
                            </div>
                        )}
                        {(background.characterId || background.personaId || background.realmId) && (
                            <div className="bg-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] text-white font-medium border border-white/20">
                                <FolderSymlink className="size-2.5" />
                                Linked
                            </div>
                        )}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="bg-gray-900 text-white size-6"
                            >
                                <MoreVertical className="size-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="bg-gray-900 text-white border border-gray-800"
                        >
                            <DropdownMenuItem
                                className="hover:bg-gray-800 transition cursor-pointer"
                                onClick={() => onSetDefault?.(background.id)}
                            >
                                <ImageIcon className="w-4 h-4 mr-2" /> Set as Default Global Background
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="hover:bg-gray-800 transition cursor-pointer"
                                onClick={() => setIsLinkDialogOpen(true)}
                            >
                                <FolderSymlink className="w-4 h-4 mr-2" /> Link to Entity...
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="hover:bg-gray-800 transition cursor-pointer"
                                onClick={() => onDownload?.(background.id)}
                            >
                                <Download className="w-4 h-4 mr-2" /> Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="hover:bg-red-900 transition cursor-pointer text-red-500 hover:text-red-400"
                                onClick={() => onDelete?.(background.id)}
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <LinkBackgroundDialog
                open={isLinkDialogOpen}
                onOpenChange={setIsLinkDialogOpen}
                backgroundId={background.id}
                backgroundName={""}
            />
        </>
    )
}

export default BackgroundCard
