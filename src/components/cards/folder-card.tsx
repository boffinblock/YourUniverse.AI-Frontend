import React from "react";
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
import Favourite from "../icons/favourite";


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
interface FolderCardProps {
    folder: Folder;
}

const FolderCard: React.FC<FolderCardProps> = ({
    folder, ...props
}) => {
    return (
        <div {...props} className="rounded-4xl">
            <Card className="p-4 relative rounded-none rounded-b-3xl h-auto rounded-tr-3xl border-t-8 border-t-primary bg-primary/30 space-y-3">
                {/* Folder type label */}
                <div className="absolute flex items-center gap-2 bg-primary -left-[1px] -top-8 w-fit rounded-tl-3xl rounded-tr-3xl px-4 py-1.5 text-sm">
                     <Checkbox
                    id="terms"
                    className="bg-gray-900 border-none data-[state=checked]:bg-gray-900 cursor-pointer data-[state=checked]:text-white text-white rounded-full size-5"
                />
                    <span className="w-[100px]"></span>
                </div>

                {/* Folder Name & Tags */}
                <div className="space-y-1">
                     <Favourite className="absolute top-2 right-3" active={false} />
                    <h2 className="text-lg text-white/80">{folder.name}</h2>
                    <div className="flex gap-2 flex-wrap">
                        {folder.tags.map((tag: string, idx: number) => (
                            <Badge key={idx}>{tag}</Badge>
                        ))}
                    </div>
                </div>

                {/* Folder Description */}
                <CardDescription className="line-clamp-3 p-0 text-xs">
                    {folder.description}
                </CardDescription>

                {/* Characters Accordion */}
                {folder.characters.length > 0 && (
                    <div className="space-y-2">
                        <Accordion type="single" collapsible className="w-full">
                            {folder.characters.map((char: Character) => (
                                <AccordionItem
                                    key={char.id}
                                    value={`item-${char.id}`}
                                    className="border-gray-600"
                                >
                                    <AccordionTrigger className="text-white/80 py-2 cursor-pointer">
                                        <div className="flex items-center gap-x-2">
                                            <Avatar className="cursor-pointer size-6 hover:scale-105 duration-500 transition brightness-60">
                                                {char.avatar ? (
                                                    <AvatarImage
                                                        src={char.avatar}
                                                        alt={char.name}
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <AvatarFallback>{char.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                )}
                                            </Avatar>
                                            {char.name}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-balance">
                                        <p className="text-muted line-clamp-3">{char.description}</p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default FolderCard;
