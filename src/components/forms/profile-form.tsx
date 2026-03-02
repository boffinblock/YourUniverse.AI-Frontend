"use client";
import React, { useMemo } from "react";
import { LogOut, Menu, Trash2, Loader2 } from "lucide-react";

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
import { useLogout, useCurrentUser, useUpdateProfile, useUpdateProfilePicture } from "@/hooks";
interface Props {
    characterId?: string;
}

const ProfileForm: React.FC<Props> = () => {
    const { logout, isLoading: isLoggingOut } = useLogout();
    const { user, isLoading: isUserLoading } = useCurrentUser();
    const { updateProfile, isLoading: isUpdatingProfile } = useUpdateProfile();
    const { updateProfilePicture, isLoading: isUpdatingAvatar } = useUpdateProfilePicture();

    const initialValues = useMemo(() => {
        if (!user) return {};
        return {
            avatar: user.avatar,
            username: user.username,
            email: user.email,
            visiable: user.profileVisibility,
            rating: user.profileRating,
            theme: user.theme,
            fontStyle: user.fontStyle,
            fontSize: user.fontSize,
            language: user.language,
            tags: user.tagsToFollow,
            "tag-to-avoid": user.tagsToAvoid,
            aboutme: user.aboutMe,
            following: user.following,
            plan: user.subscriptionPlan,
        };
    }, [user]);

    const handleSubmit = async (values: any) => {
        try {
            // 1. Update text profile fields
            const profileData: any = {
                username: values.username,
                aboutMe: values.aboutme,
                theme: values.theme,
                fontStyle: values.fontStyle,
                fontSize: values.fontSize,
                language: values.language,
                tagsToFollow: values.tags,
                tagsToAvoid: values["tag-to-avoid"],
                profileVisibility: values.visiable,
                profileRating: values.rating,
                subscriptionPlan: values.plan,
            };

            await updateProfile(profileData);

            // 2. Update avatar if it's a new File (not just the existing URL string)
            if (values.avatar instanceof File) {
                await updateProfilePicture(values.avatar);
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    if (isUserLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="py-10">
            <DynamicForm
                schema={profileSchema}
                initialValues={initialValues}
                isSubmitting={isUpdatingProfile || isUpdatingAvatar}
                onSubmit={handleSubmit}
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
                                if (!isLoggingOut) logout();
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
