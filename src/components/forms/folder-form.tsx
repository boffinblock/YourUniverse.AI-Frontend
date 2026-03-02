"use client"
import React from "react";
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
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import DynamicForm from "../elements/form-elements/dynamic-form";
import { FolderSchema } from "@/schemas/folder-schema";
import { useFormikContext } from "formik";
import { useRouter } from "next/navigation";
import CharacterCard from "../cards/character-card";
import { useListCharacters, useCreateRealm } from "@/hooks";

interface Props {
    characterId?: string;
}

const FolderFormHeader = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="rounded-full">
                    Folder Menu <Menu className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-72" align="end">
                <DropdownMenuGroup>
                    <DropdownMenuItem>Show Favorite Characters Only</DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Alphabetical Order</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem>A - Z</DropdownMenuItem>
                                <DropdownMenuItem>Z - A</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const FolderFormFooter = () => {
    const { values, submitForm } = useFormikContext<any>();
    const router = useRouter();
    const { characters } = useListCharacters({
        filters: {
            limit: 100,
        },
    });

    const selectedCharacterIds = values.characters || [];

    // Deduplicate characters by ID to avoid visual duplicates
    const uniqueCharacters = Array.from(new Map(characters.map(char => [char.id, char])).values());
    const selectedCharacters = uniqueCharacters.filter(char => selectedCharacterIds.includes(char.id));

    return (
        <div className="w-full space-y-10">
            {/* Selected Characters Section */}
            <div className="border border-primary bg-primary/30 backdrop-blur-md min-h-[300px] rounded-4xl py-6 px-4 overflow-hidden flex flex-col">
                <h3 className="text-white text-xl font-semibold mb-6 px-2 flex items-center gap-2">
                    <Menu className="h-5 w-5 text-primary" /> Selected Characters ({selectedCharacters.length})
                </h3>
                <div className="flex-1 overflow-y-auto px-2">
                    {selectedCharacters.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {selectedCharacters.map((char) => (
                                <Card
                                    key={char.id}
                                    className="rounded-2xl border border-gray-800 bg-[#0c0046] text-white p-4 flex items-center gap-4 hover:border-primary hover:bg-primary/10 duration-300"
                                >
                                    <Avatar className="size-16 aspect-square rounded-full border border-primary/30">
                                        <AvatarImage
                                            src={char.avatar?.url || "/logo1.png"}
                                            alt={char.name}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="rounded-full bg-primary/20 text-primary">
                                            {char.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col text-center min-w-0">
                                        <h2 className="font-semibold text-gray-200 text-lg truncate">{char.name}</h2>
                                        <p className="text-gray-400 text-xs line-clamp-2 mt-1">
                                            {char.description || "No description provided."}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400 opacity-60">
                            <p>No characters selected</p>
                            <p className="text-sm italic">Add characters using the dropdown above</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end items-center gap-4 pt-4">

                <Button
                    type="button"
                    onClick={() => submitForm()}
                    className="px-8 bg-primary/90 text-white hover:bg-primary rounded-full font-semibold hover:shadow-primary/20 duration-300"
                >
                    Create Realm
                </Button>
            </div>
        </div>
    );
}

const FolderForm: React.FC<Props> = () => {
    const router = useRouter();
    const { createRealm } = useCreateRealm({
        onSuccess: () => {
            router.push("/realms");
        }
    });

    return (
        <div className="py-10 h-full">
            <DynamicForm
                schema={FolderSchema}
                onSubmit={(values: any) => {
                    const mappedData = {
                        name: values.folderName,
                        description: values.description,
                        tags: values.tags,
                        rating: values.rating,
                        visibility: "private", // Default to private as per schema/backend
                        characterIds: values.characters,
                    };
                    createRealm(mappedData as any);
                }}
                button={false} // Disable the default submit button in DynamicForm
                footerChildren={<FolderFormFooter />}
            >
                <FolderFormHeader />
            </DynamicForm>
        </div>
    );
};

export default FolderForm;
