"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { importBackground, bulkImportBackgrounds } from "@/lib/api/backgrounds";
import { queryKeys } from "@/lib/api/shared/query-keys";

interface UseImportBackgroundOptions {
  showToasts?: boolean;
}

export const useImportBackground = (options: UseImportBackgroundOptions = {}) => {
  const { showToasts = true } = options;
  const queryClient = useQueryClient();

  const importSingleMutation = useMutation({
    mutationFn: (file: File) => importBackground(file),
    onSuccess: () => {
      if (showToasts) {
        toast.success("Background imported successfully");
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.backgrounds.lists() });
    },
    onError: (error: Error) => {
      if (showToasts) {
        toast.error(error.message || "Failed to import background");
      }
    },
  });

  const importBulkMutation = useMutation({
    mutationFn: (files: File[]) => bulkImportBackgrounds(files),
    onSuccess: (response) => {
      const count = response.data?.imported ?? 0;
      if (showToasts) {
        toast.success(`Successfully imported ${count} background${count === 1 ? "" : "s"}`);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.backgrounds.lists() });
    },
    onError: (error: Error) => {
      if (showToasts) {
        toast.error(error.message || "Failed to import backgrounds");
      }
    },
  });

  return {
    importBackground: importSingleMutation.mutateAsync,
    isImporting: importSingleMutation.isPending,
    bulkImportBackgrounds: importBulkMutation.mutateAsync,
    isBulkImporting: importBulkMutation.isPending,
  };
};
