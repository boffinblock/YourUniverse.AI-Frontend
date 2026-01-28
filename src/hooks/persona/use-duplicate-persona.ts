"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { duplicatePersona, duplicatePersonasBatch } from "@/lib/api/personas/endpoints";
import { personaKeys } from "./use-list-personas";

interface UseDuplicatePersonaOptions {
    showToasts?: boolean;
}

/**
 * Hook for duplicating personas (single or batch)
 */
export const useDuplicatePersona = (options: UseDuplicatePersonaOptions = {}) => {
    const { showToasts = true } = options;
    const queryClient = useQueryClient();

    const duplicateSingleMutation = useMutation({
        mutationFn: (personaId: string) => duplicatePersona(personaId),
        onSuccess: (response) => {
            if (showToasts) {
                toast.success(`Duplicated "${response.data.persona.name}"`);
            }
            queryClient.invalidateQueries({ queryKey: personaKeys.lists() });
        },
        onError: (error: any) => {
            console.error("Duplication failed:", error);
            toast.error(error.message || "Failed to duplicate persona");
        },
    });

    const duplicateBatchMutation = useMutation({
        mutationFn: (personaIds: string[]) => duplicatePersonasBatch(personaIds),
        onSuccess: (response) => {
            const count = response.data.success;
            if (showToasts) {
                toast.success(`Successfully duplicated ${count} persona${count === 1 ? "" : "s"}`);
            }
            queryClient.invalidateQueries({ queryKey: personaKeys.lists() });
        },
        onError: (error: any) => {
            console.error("Batch duplication failed:", error);
            toast.error(error.message || "Failed to duplicate personas");
        },
    });

    return {
        duplicatePersona: duplicateSingleMutation.mutateAsync,
        isDuplicating: duplicateSingleMutation.isPending,
        duplicatePersonasBatch: duplicateBatchMutation.mutateAsync,
        isBatchDuplicating: duplicateBatchMutation.isPending,
    };
};
