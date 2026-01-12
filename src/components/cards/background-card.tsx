import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Download, FolderSymlink, Image as ImageIcon, MoreVertical, User, Users } from 'lucide-react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox';

const BackgroundCard: React.FC = ({ ...props }) => {
    return (
        <div {...props} className=' relative rounded-[2rem] border border-primary bg-primary/30 backdrop-blur-2xl  overflow-hidden group  aspect-video   '>
            <Avatar className="  w-full h-full rounded-none  brightness-75   ">
                <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                    className="object-cover group-hover:scale-105 rounded-none duration-500"
                />
                <AvatarFallback className="  bg-primary/10  text-white  object-cover group-hover:scale-105 rounded-none duration-500">
                    CN
                </AvatarFallback>
            </Avatar>
            <div className=' absolute top-0 left-0  w-full   flex justify-between items-center p-2'>

                <Checkbox
                    id="terms"
                    className="bg-gray-900 border-none data-[state=checked]:bg-gray-900 cursor-pointer data-[state=checked]:text-white text-white rounded-full size-5"
                />
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
                        <DropdownMenuItem className="hover:bg-gray-800 transition cursor-pointer">
                            <ImageIcon className="w-4 h-4 mr-2" /> Set as Default Global Background
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-gray-800 transition cursor-pointer">
                            <User className="w-4 h-4 mr-2" /> Link to Character
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-gray-800 transition cursor-pointer">
                            <Users className="w-4 h-4 mr-2" /> Link to Persona
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-gray-800 transition cursor-pointer">
                            <FolderSymlink className="w-4 h-4 mr-2" /> Link to Realm
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-gray-800 transition cursor-pointer">
                            <Download className="w-4 h-4 mr-2" /> Download
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

        </div>
    )
}

export default BackgroundCard