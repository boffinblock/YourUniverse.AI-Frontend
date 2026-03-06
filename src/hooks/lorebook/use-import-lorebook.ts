"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { importLorebook } from "@/lib/api/lorebooks/endpoints";
import { queryKeys } from "@/lib/api/shared/query-keys";

interface UseImportLorebookOptions {
    showToasts?: boolean;
}

export const useImportLorebook = (options: UseImportLorebookOptions = {}) => {
    const { showToasts = true } = options;
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (file: File) => importLorebook(file),
        onSuccess: () => {
            if (showToasts) {
                toast.success("Lorebook imported successfully");
            }
            queryClient.invalidateQueries({ queryKey: queryKeys.lorebooks.lists() });
        },
        onError: (error: any) => {
            console.error("Import failed:", error);
            if (showToasts) {
                toast.error(error.message || "Failed to import lorebook");
            }
        },
    });

    return {
        importLorebook: mutation.mutateAsync,
        isImporting: mutation.isPending,
    };
};
