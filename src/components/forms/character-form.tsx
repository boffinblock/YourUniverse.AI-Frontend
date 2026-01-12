"use client"
import React, { useMemo, useRef, useEffect } from "react";
import DynamicForm from "../elements/form-elements/dynamic-form";
import { characterSchema } from "@/schemas";
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
import { useCreateCharacter, useUpdateCharacter, useGetCharacter } from "@/hooks";
import type { CreateCharacterRequest, UpdateCharacterRequest } from "@/lib/api/characters";

interface Props {
    characterId?: string;
}

const CharacterForm: React.FC<Props> = ({ characterId = undefined }) => {
    const isEditMode = !!characterId;
    const formRef = useRef<{ resetForm: () => void } | null>(null);

    // Fetch character data if editing
    const { character, isLoading: isLoadingCharacter } = useGetCharacter(characterId, {
        enabled: isEditMode,
        requireAuth: true,
        showErrorToast: true,
    });

    // Create character mutation
    const {
        createCharacter,
        isLoading: isCreating,
        isSuccess: isCreateSuccess,
        reset: resetCreateMutation,
    } = useCreateCharacter({
        onSuccess: (data) => {
            // Navigate to character detail page after successful creation
        },
        showToasts: true,
    });

    // Reset form when character is created successfully
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

    // Update character mutation
    const {
        updateCharacter,
        isLoading: isUpdating,
        isSuccess: isUpdateSuccess,
    } = useUpdateCharacter({
        characterId: characterId || "",
        onSuccess: (data) => {
            // Navigate to character detail page after successful update
        },
        showToasts: true,
    });

    const isLoading = isCreating || isUpdating || isLoadingCharacter;
    const isSuccess = isCreateSuccess || isUpdateSuccess;

    /**
     * Create modified schema for edit mode (make files optional)
     */
    const formSchema = useMemo(() => {
        if (!isEditMode) return characterSchema;

        // In edit mode, make avatar and backgroundImage optional
        return characterSchema.map((field) => {
            if (field.name === "avatar" || field.name === "backgroundImage") {
                return { ...field, required: false };
            }
            return field;
        });
    }, [isEditMode]);

    /**
     * Map character data to form initial values
     */
    const initialValues = useMemo(() => {
        if (!character) return undefined;

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

        return {
            avatar: character.avatar?.url || "",
            backgroundImage: character.backgroundImg?.url || "",
            characterName: character.name || "",
            visiable: character.visibility || "private",
            rating: character.rating || "SFW",
            description: character.description || "",
            scenario: character.scenario || "",
            personality: character.summary || "",
            tags: normalizeTags(character.tags) || [],
            firstMessage: character.firstMessage || "",
            alternateMessages: Array.isArray(character.alternateMessages) ? character.alternateMessages : [],
            exampleDialogue: Array.isArray(character.exampleDialogues) ? character.exampleDialogues : [],
            authorNotes: character.authorNotes || "",
            characterNotes: character.characterNotes || "",
            persona: character.persona?.id || "",
            lorebook: character.lorebook?.id || "",
            favourite: character.isFavourite || false,
        };
    }, [character]);
    /**
     * Handle form submission
     * Maps form values to API request format
     * Validates required fields and prepares data for multipart/form-data upload
     */
    const handleSubmit = async (values: Record<string, any>) => {
        // For create mode, validate required file fields
        if (!isEditMode) {
            if (!values.avatar || !(values.avatar instanceof File)) {
                console.error("Avatar file is required");
                return;
            }
            if (!values.backgroundImage || !(values.backgroundImage instanceof File)) {
                console.error("Background image file is required");
                return;
            }
        }

        // Map form values to API request format
        const baseData = {
            name: values.characterName || "",
            description: values.description || undefined,
            scenario: values.scenario || undefined,
            summary: values.personality || undefined,
            rating: (values.rating as "SFW" | "NSFW") || "SFW",
            visibility: (values.visiable as "public" | "private") || "private",
            tags: Array.isArray(values.tags)
                ? values.tags
                : values.tags
                    ? [values.tags]
                    : undefined,
            firstMessage: values.firstMessage || undefined,
            alternateMessages: Array.isArray(values.alternateMessages)
                ? values.alternateMessages
                : values.alternateMessages
                    ? [values.alternateMessages]
                    : undefined,
            exampleDialogues: values.exampleDialogue
                ? (Array.isArray(values.exampleDialogue)
                    ? values.exampleDialogue
                    : [values.exampleDialogue])
                : undefined,
            authorNotes: values.authorNotes || undefined,
            characterNotes: values.characterNotes || undefined,
            // Handle persona - if it's an array (from multi-select), take first value; otherwise use as string
            personaId: Array.isArray(values.persona)
                ? (values.persona.length > 0 ? values.persona[0] : undefined)
                : (values.persona && values.persona.trim ? values.persona.trim() : (values.persona || undefined)),
            // Handle lorebook - if it's an array (from multi-select), take first value; otherwise use as string
            lorebookId: Array.isArray(values.lorebook)
                ? (values.lorebook.length > 0 ? values.lorebook[0] : undefined)
                : (values.lorebook && values.lorebook.trim ? values.lorebook.trim() : (values.lorebook || undefined)),
            favourite: Boolean(values.favourite),
        };

        if (isEditMode) {
            // Update mode - only include changed fields
            const updateData: UpdateCharacterRequest = {
                ...baseData,
            };

            // Handle avatar - only include if it's a new File, otherwise keep existing
            if (values.avatar instanceof File) {
                updateData.avatar = values.avatar;
            } else if (typeof values.avatar === "string" && values.avatar !== character?.avatar?.url) {
                updateData.avatar = values.avatar;
            }

            // Handle backgroundImage - only include if it's a new File, otherwise keep existing
            if (values.backgroundImage instanceof File) {
                updateData.backgroundImage = values.backgroundImage;
            } else if (typeof values.backgroundImage === "string" && values.backgroundImage !== character?.backgroundImg?.url) {
                updateData.backgroundImage = values.backgroundImage;
            }

            // Handle personaId - allow null to unlink
            // Handle both array (multi-select) and string (single-select) formats
            const personaValue = Array.isArray(values.persona)
                ? (values.persona.length > 0 ? values.persona[0] : "")
                : (values.persona || "");

            if (personaValue === "" || personaValue === null || personaValue === undefined) {
                updateData.personaId = null;
            } else if (personaValue !== character?.persona?.id) {
                updateData.personaId = personaValue;
            }

            // Handle lorebookId - allow null to unlink
            // Handle both array (multi-select) and string (single-select) formats
            const lorebookValue = Array.isArray(values.lorebook)
                ? (values.lorebook.length > 0 ? values.lorebook[0] : "")
                : (values.lorebook || "");

            if (lorebookValue === "" || lorebookValue === null || lorebookValue === undefined) {
                updateData.lorebookId = null;
            } else if (lorebookValue !== character?.lorebook?.id) {
                updateData.lorebookId = lorebookValue;
            }

            // Trigger character update
            updateCharacter(updateData);
        } else {
            // Create mode - include required files
            const createData: CreateCharacterRequest = {
                ...baseData,
                avatar: values.avatar instanceof File ? values.avatar : undefined,
                backgroundImage: values.backgroundImage instanceof File ? values.backgroundImage : undefined,
            };

            // Trigger character creation
            createCharacter(createData);
        }
    };

    return (
        <div className="py-10">
            <DynamicForm
                key={character?.id || "new"}
                schema={formSchema}
                onSubmit={handleSubmit}
                initialValues={initialValues}
                formRef={formRef}
                submitButtonText={
                    isLoading
                        ? (isEditMode ? "Updating Character..." : "Creating Character...")
                        : isSuccess
                            ? (isEditMode ? "Character Updated!" : "Character Created!")
                            : (isEditMode ? "Update Character" : "Create Character")
                }
                isSubmitting={isLoading}
                submitButtonDisabled={isLoading || isSuccess || isLoadingCharacter}
            >
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button type="button" className="rounded-full" disabled={isLoading || isSuccess}>
                            Character Menu <Menu />
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
                                Link to Realm
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

export default CharacterForm;   
