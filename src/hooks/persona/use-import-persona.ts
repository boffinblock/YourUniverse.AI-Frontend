"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { importPersona, bulkImportPersonas } from "@/lib/api/personas/endpoints";
import { personaKeys } from "./use-list-personas";

interface UseImportPersonaOptions {
    showToasts?: boolean;
}

/**
 * Hook for importing personas (single or bulk)
 */
export const useImportPersona = (options: UseImportPersonaOptions = {}) => {
    const { showToasts = true } = options;
    const queryClient = useQueryClient();

    const importSingleMutation = useMutation({
        mutationFn: (file: File) => importPersona(file),
        onSuccess: (response) => {
            if (showToasts) {
                toast.success("Persona imported successfully");
            }
            queryClient.invalidateQueries({ queryKey: personaKeys.lists() });
        },
        onError: (error: any) => {
            console.error("Import failed:", error);
            if (showToasts) {
                toast.error(error.message || "Failed to import persona");
            }
        },
    });

    const importBulkMutation = useMutation({
        mutationFn: (file: File) => bulkImportPersonas(file),
        onSuccess: (response) => {
            const count = response.data.success;
            if (showToasts) {
                toast.success(`Successfully imported ${count} persona${count === 1 ? "" : "s"}`);
            }
            queryClient.invalidateQueries({ queryKey: personaKeys.lists() });
        },
        onError: (error: any) => {
            console.error("Bulk import failed:", error);
            if (showToasts) {
                toast.error(error.message || "Failed to import personas");
            }
        },
    });

    return {
        importPersona: importSingleMutation.mutateAsync,
        isImporting: importSingleMutation.isPending,
        importBulkPersonas: importBulkMutation.mutateAsync,
        isBulkImporting: importBulkMutation.isPending,
    };
};
