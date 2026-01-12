"use client"
import React, { useRef, useEffect, useMemo } from "react";
import DynamicForm from "../elements/form-elements/dynamic-form";
import { lorebookSchema } from "@/schemas";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Copy, Link as LinkIcon, Trash2, Upload, Download, Folder, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { useCreateLorebook, useUpdateLorebook, useGetLorebook } from "@/hooks";
import type { CreateLorebookRequest, UpdateLorebookRequest, CreateLorebookEntryInput, LorebookEntry } from "@/lib/api/lorebooks";

interface Props {
    lorebookId?: string;
}

const LorebookForm: React.FC<Props> = ({ lorebookId }) => {
    const isEditMode = !!lorebookId;
    const formRef = useRef<{ resetForm: () => void } | null>(null);

    // Fetch lorebook data if editing
    const { lorebook, isLoading: isLoadingLorebook } = useGetLorebook(lorebookId || "", {
        enabled: isEditMode,
        requireAuth: true,
        showErrorToast: true,
    });

    // Create lorebook mutation
    const {
        createLorebook,
        isLoading: isCreating,
        isSuccess: isCreateSuccess,
        reset: resetCreateMutation,
    } = useCreateLorebook({
        onSuccess: (data) => {

        },
        showToasts: true,
    });

    // Update lorebook mutation
    const {
        updateLorebook,
        isLoading: isUpdating,
        isSuccess: isUpdateSuccess,
    } = useUpdateLorebook({
        lorebookId: lorebookId || "",
        onSuccess: (data) => {
            // Navigate to lorebook detail page after successful update
        },
        showToasts: true,
    });

    const isLoading = isCreating || isUpdating || isLoadingLorebook;
    const isSuccess = isCreateSuccess || isUpdateSuccess;

    // Reset form after successful creation (only in create mode)
    useEffect(() => {
        if (isCreateSuccess && !isEditMode && formRef.current) {
            // Reset form to default values
            formRef.current.resetForm();
            // Reset mutation state after a short delay
            setTimeout(() => {
                resetCreateMutation();
            }, 100);
        }
    }, [isCreateSuccess, isEditMode, resetCreateMutation]);

    /**
     * Create modified schema for edit mode (make avatar optional)
     */
    const formSchema = useMemo(() => {
        if (!isEditMode) return lorebookSchema;

        // In edit mode, make avatar optional
        return lorebookSchema.map((field) => {
            if (field.name === "avatar") {
                return { ...field, required: false };
            }
            return field;
        });
    }, [isEditMode]);

    /**
     * Map lorebook data to form initial values
     */
    const initialValues = useMemo(() => {
        if (!lorebook) return undefined;

        // Normalize tags to ensure they're always string[] and lowercase (to match MultiSelect option values)
        const normalizeTags = (tags: unknown): string[] => {
            if (Array.isArray(tags)) {
                return tags
                    .filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
                    .map(tag => tag.toLowerCase().trim()); // Convert to lowercase to match MultiSelect option values
            }
            if (typeof tags === 'string') {
                if (tags.includes(',')) {
                    return tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0);
                }
                return tags.trim() ? [tags.trim().toLowerCase()] : [];
            }
            return [];
        };

        // Handle characters - extract IDs from the characters array
        const getCharacterIds = (): string[] => {
            if (Array.isArray(lorebook.characters) && lorebook.characters.length > 0) {
                return lorebook.characters.map((char: any) => char.id).filter((id: string) => id);
            }
            return [];
        };

        // Handle personas - extract IDs from the personas array
        const getPersonaIds = (): string[] => {
            if (Array.isArray(lorebook.personas) && lorebook.personas.length > 0) {
                return lorebook.personas.map((persona: any) => persona.id).filter((id: string) => id);
            }
            return [];
        };

        return {
            avatar: lorebook.avatar?.url || "",
            lorebookName: lorebook.name || "",
            visiable: lorebook.visibility || "private",
            rating: lorebook.rating || "SFW",
            description: lorebook.description || "",
            tags: normalizeTags(lorebook.tags) || [],
            entries: Array.isArray(lorebook.entries) && lorebook.entries.length > 0
                ? lorebook.entries.map((entry: LorebookEntry) => ({
                    keywords: entry.keywords || [],
                    context: entry.context || "",
                    isEnabled: entry.isEnabled !== undefined ? entry.isEnabled : true,
                    priority: entry.priority || 0,
                }))
                : [],
            Characters: getCharacterIds(),
            persona: getPersonaIds(),
            favourite: lorebook.isFavourite || false,
        };
    }, [lorebook]);

    /**
     * Handle form submission
     * Maps form values to API request format
     */
    const handleSubmit = async (values: Record<string, any>) => {
        // For create mode, validate required file fields
        if (!isEditMode) {
            if (!values.avatar || !(values.avatar instanceof File)) {
                console.error("Avatar file is required");
                return;
            }
        }

        // Process entries - format: { keywords: string[], context: string }[]
        let entries: CreateLorebookEntryInput[] | undefined = undefined;

        if (values.entries && Array.isArray(values.entries)) {
            // Entries field format: { keywords: string[], context: string }[]
            // Backend expects same format: { keywords: string[], context: string }[]
            const convertedEntries: CreateLorebookEntryInput[] = [];
            let priority = 1;

            values.entries.forEach((entry: any) => {
                if (entry && entry.keywords && Array.isArray(entry.keywords) && entry.context) {
                    // Filter out empty keywords and ensure at least one keyword
                    const validKeywords = entry.keywords
                        .map((k: string) => k.trim())
                        .filter((k: string) => k.length > 0);

                    // Only include entries that have at least one keyword AND context
                    if (validKeywords.length > 0 && entry.context.trim().length > 0) {
                        convertedEntries.push({
                            keywords: validKeywords,
                            context: entry.context.trim(),
                            priority: priority++,
                            isEnabled: entry.isEnabled !== undefined ? entry.isEnabled : true,
                        });
                    }
                } else if (entry && entry.keyword && entry.context) {
                    // Legacy format: { keyword: string, context: string } - convert to array
                    const keyword = entry.keyword.trim();
                    if (keyword.length > 0 && entry.context.trim().length > 0) {
                        convertedEntries.push({
                            keywords: [keyword],
                            context: entry.context.trim(),
                            priority: priority++,
                            isEnabled: entry.isEnabled !== undefined ? entry.isEnabled : true,
                        });
                    }
                }
            });

            // In edit mode, always set entries (even if empty) to allow clearing entries
            // In create mode, only set if there are valid entries
            if (isEditMode) {
                entries = convertedEntries; // Can be empty array
            } else {
                entries = convertedEntries.length > 0 ? convertedEntries : undefined;
            }
        } else if (isEditMode) {
            // If entries field is missing in edit mode, send empty array to clear entries
            entries = [];
        }

        // Process avatar - handle file upload or URL
        let avatar: File | string | undefined = undefined;
        if (values.avatar) {
            if (typeof values.avatar === 'string') {
                // Direct URL string
                avatar = values.avatar;
            } else if (values.avatar instanceof File) {
                // File object
                avatar = values.avatar;
            } else if (values.avatar?.url) {
                // Already in the correct format - extract URL string
                avatar = values.avatar.url;
            } else if (values.avatar?.file) {
                // File object wrapped in an object
                avatar = values.avatar.file;
            }
        }

        // Map form values to API request format
        const baseData = {
            name: values.lorebookName || "",
            description: values.description || undefined,
            visibility: (values.visiable as "public" | "private") || "private",
            rating: (values.rating as "SFW" | "NSFW") || "SFW",
            tags: Array.isArray(values.tags) ? values.tags : values.tags ? [values.tags] : undefined,
            favourite: Boolean(values.favourite),
            // Handle Characters and persona - ensure they're arrays
            characterIds: Array.isArray(values.Characters)
                ? values.Characters.filter((id: any) => id && typeof id === 'string' && id.trim().length > 0)
                : (values.Characters && typeof values.Characters === 'string' && values.Characters.trim())
                    ? [values.Characters.trim()]
                    : undefined,
            personaIds: Array.isArray(values.persona)
                ? values.persona.filter((id: any) => id && typeof id === 'string' && id.trim().length > 0)
                : (values.persona && typeof values.persona === 'string' && values.persona.trim())
                    ? [values.persona.trim()]
                    : undefined,
        };

        if (isEditMode) {
            // Update mode - always include entries (even if empty) to allow clearing entries
            const updateData: UpdateLorebookRequest = {
                ...baseData,
                entries: entries || [], // Always send entries array (empty array means clear all entries)
            };

            // Handle avatar - only include if it's a new File, otherwise keep existing
            if (avatar instanceof File) {
                updateData.avatar = avatar;
            } else if (typeof avatar === "string" && avatar !== lorebook?.avatar?.url) {
                updateData.avatar = avatar;
            }

            // Trigger lorebook update
            updateLorebook(updateData);
        } else {
            // Create mode - include required files and entries
            const createData: CreateLorebookRequest = {
                ...baseData,
                avatar: avatar instanceof File ? avatar : undefined,
                entries: entries && entries.length > 0 ? entries : undefined,
            };

            // Trigger lorebook creation
            createLorebook(createData);
        }
    };

    return (
        <div className="py-10">
            <DynamicForm
                key={lorebook?.id || "new"}
                schema={formSchema}
                onSubmit={handleSubmit}
                initialValues={initialValues}
                formRef={formRef}
                submitButtonText={
                    isLoading
                        ? (isEditMode ? "Updating Lorebook..." : "Creating Lorebook...")
                        : isSuccess
                            ? (isEditMode ? "Lorebook Updated!" : "Lorebook Created!")
                            : (isEditMode ? "Update Lorebook" : "Create Lorebook")
                }
                isSubmitting={isLoading}
                submitButtonDisabled={isLoading || isSuccess || isLoadingLorebook}
            >
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button type="button" className="rounded-full" disabled={isLoading || isSuccess}>
                            Lorebook Menu <Menu />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-64" align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                Duplicate
                                <DropdownMenuShortcut><Copy className="size-4" /></DropdownMenuShortcut>
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                Link to Account
                                <DropdownMenuShortcut><LinkIcon className="size-4" /></DropdownMenuShortcut>
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                Clear All Fields
                                <DropdownMenuShortcut><RotateCcw className="size-4" /></DropdownMenuShortcut>
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                Import
                                <DropdownMenuShortcut><Upload className="size-4" /></DropdownMenuShortcut>
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                Export
                                <DropdownMenuShortcut><Download className="size-4" /></DropdownMenuShortcut>
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                Link to Folder
                                <DropdownMenuShortcut><Folder className="size-4" /></DropdownMenuShortcut>
                            </DropdownMenuItem>

                            <DropdownMenuItem variant="destructive" >
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

export default LorebookForm;
