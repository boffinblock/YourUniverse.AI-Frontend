"use client"
import React from "react";
import { LogOut, Menu, Trash2 } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button";
import DynamicForm from "../elements/form-elements/dynamic-form";
import { profileSchema } from "@/schemas/profile-schema";
import { useLogout } from "@/hooks";
interface Props {
    characterId?: string;
}

const ProfileForm: React.FC<Props> = () => {
    const { logout, isLoading } = useLogout();

    return (
        <div className="py-10">
            <DynamicForm
                schema={profileSchema}
                onSubmit={(values) => {
                    console.log("Form Submitted:", values);
                }}
            >
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button>
                            Account Menu <Menu />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                Change Username <span className="ml-auto text-xs text-muted-foreground">(once every 24 hours)</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Change / Update Email <span className="ml-auto text-xs text-muted-foreground">(once every 24 hours)</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Change / Update Password
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                Bulk Export Your Universe
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={(e) => {
                                e.preventDefault();
                                if (!isLoading) logout();
                            }}>
                                Logout
                                <DropdownMenuShortcut><LogOut className="size-4" /></DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive"  >
                                Delete
                                <DropdownMenuShortcut><Trash2 className="size-4 text-destructive" /></DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </DynamicForm>
        </div>
    );
};

export default ProfileForm;
