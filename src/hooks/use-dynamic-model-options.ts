/**
 * useDynamicModelOptions Hook
 * Dynamic hook that fetches options based on model name from schema rules
 */
"use client";

import { useMemo } from "react";
import { useListLorebooks } from "./lorebook/use-list-lorebooks";
import { useListCharacters } from "./character/use-list-characters";
import { useListPersonas } from "./persona/use-list-personas";
import { CustomMultiSelectOption } from "@/components/elements/custom-multi-select";

export type ModelType = "lorebook" | "character" | "persona";

export interface UseDynamicModelOptionsProps {
    /**
     * Model name from schema rules (e.g., "lorebook", "character", "persona")
     */
    model?: string;

    /**
     * Filter by category (SFW/NSFW) - only applies to models that support it
     */
    category?: "SFW" | "NSFW";

    /**
     * Whether to enable the query (default: true)
     */
    enabled?: boolean;

    /**
     * Limit the number of results (default: 100)
     */
    limit?: number;

    /**
     * Search query
     */
    search?: string;
}

/**
 * Custom hook that dynamically fetches options based on model name
 * Maps model names to their respective API hooks and formats the response
 * 
 * @param props - Configuration options
 * @returns Options array formatted for CustomMultiSelect, loading state, and error state
 * 
 * @example
 * ```tsx
 * const { options, isLoading } = useDynamicModelOptions({
 *   model: "lorebook",
 *   category: "SFW",
 *   limit: 50
 * });
 * ```
 */
export const useDynamicModelOptions = (props: UseDynamicModelOptionsProps = {}) => {
    const {
        model,
        category,
        enabled = true,
        limit = 100,
        search,
    } = props;

    // Normalize model name
    const normalizedModel = useMemo(() => {
        if (!model) return null;
        return model.toLowerCase().trim() as ModelType;
    }, [model]);

    // Fetch lorebooks
    const {
        lorebooks,
        isLoading: isLoadingLorebooks,
        isError: isErrorLorebooks,
        error: errorLorebooks,
    } = useListLorebooks({
        filters: {
            rating: category,
            limit,
            search,
            sortBy: "name",
            sortOrder: "asc",
        },
        enabled: enabled && normalizedModel === "lorebook",
        showErrorToast: false,
    });

    // Fetch characters
    const {
        characters,
        isLoading: isLoadingCharacters,
        isError: isErrorCharacters,
        error: errorCharacters,
    } = useListCharacters({
        filters: {
            rating: category,
            limit,
            search,
            sortBy: "name",
            sortOrder: "asc",
        },
        enabled: enabled && normalizedModel === "character",
        showErrorToast: false,
    });

    // Fetch personas
    const {
        personas,
        isLoading: isLoadingPersonas,
        isError: isErrorPersonas,
        error: errorPersonas,
    } = useListPersonas({
        filters: {
            rating: category,
            limit,
            search,
            sortBy: "name",
            sortOrder: "asc",
        },
        enabled: enabled && normalizedModel === "persona",
        showErrorToast: false,
    });

    // Determine loading state
    const isLoading = useMemo(() => {
        if (normalizedModel === "lorebook") return isLoadingLorebooks;
        if (normalizedModel === "character") return isLoadingCharacters;
        if (normalizedModel === "persona") return isLoadingPersonas;
        return false;
    }, [
        normalizedModel,
        isLoadingLorebooks,
        isLoadingCharacters,
        isLoadingPersonas,
    ]);

    // Determine error state
    const isError = useMemo(() => {
        if (normalizedModel === "lorebook") return isErrorLorebooks;
        if (normalizedModel === "character") return isErrorCharacters;
        if (normalizedModel === "persona") return isErrorPersonas;
        return false;
    }, [
        normalizedModel,
        isErrorLorebooks,
        isErrorCharacters,
        isErrorPersonas,
    ]);

    // Get error object
    const error = useMemo(() => {
        if (normalizedModel === "lorebook") return errorLorebooks;
        if (normalizedModel === "character") return errorCharacters;
        if (normalizedModel === "persona") return errorPersonas;
        return null;
    }, [normalizedModel, errorLorebooks, errorCharacters, errorPersonas]);

    // Format options based on model type
    const options = useMemo<CustomMultiSelectOption[]>(() => {
        if (!normalizedModel) return [];

        switch (normalizedModel) {
            case "lorebook":
                return (lorebooks || []).map((lorebook) => ({
                    label: lorebook.name,
                    value: lorebook.id,
                    meta: {
                        id: lorebook.id,
                        name: lorebook.name,
                        description: lorebook.description,
                        avatar: lorebook.avatar?.url,
                        rating: lorebook.rating,
                        visibility: lorebook.visibility,
                        entriesCount: lorebook.entries?.length || 0,
                        tags: lorebook.tags,
                        createdAt: lorebook.createdAt,
                        updatedAt: lorebook.updatedAt,
                    },
                }));

            case "character":
                return (characters || []).map((character) => ({
                    label: character.name,
                    value: character.id,
                    meta: {
                        id: character.id,
                        name: character.name,
                        description: character.description,
                        avatar: character.avatar?.url,
                        backgroundImg: character.backgroundImg?.url,
                        rating: character.rating,
                        visibility: character.visibility,
                        tags: character.tags,
                        createdAt: character.createdAt,
                        updatedAt: character.updatedAt,
                    },
                }));

            case "persona":
                return (personas || []).map((persona) => ({
                    label: persona.name,
                    value: persona.id,
                    meta: {
                        id: persona.id,
                        name: persona.name,
                        description: persona.description,
                        avatar: persona.avatar?.url,
                        backgroundImg: persona.backgroundImg?.url,
                        rating: persona.rating,
                        visibility: persona.visibility,
                        tags: persona.tags,
                        lorebookId: persona.lorebookId,
                        createdAt: persona.createdAt,
                        updatedAt: persona.updatedAt,
                    },
                }));

            default:
                return [];
        }
    }, [normalizedModel, lorebooks, characters, personas]);

    return {
        /**
         * Options array formatted for CustomMultiSelect
         */
        options,

        /**
         * Whether query is currently loading
         */
        isLoading,

        /**
         * Whether query failed
         */
        isError,

        /**
         * Error object
         */
        error,

        /**
         * Model type (normalized)
         */
        model: normalizedModel,
    };
};
