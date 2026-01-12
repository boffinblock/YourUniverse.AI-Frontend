import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCharactersBatch } from "@/lib/api/characters/endpoints";
import { queryKeys } from "@/lib/api";
import type { BatchDeleteCharactersResponse } from "@/lib/api/characters";
import type { ApiError } from "@/lib/api/shared/types";
import { toast } from "sonner";

interface UseDeleteCharacterOptions {
  onSuccess?: (data: BatchDeleteCharactersResponse) => void;
  onError?: (error: ApiError) => void;
  showToasts?: boolean;
}

export const useDeleteCharacter = (options?: UseDeleteCharacterOptions) => {
  const { onSuccess, onError, showToasts = true } = options || {};
  const queryClient = useQueryClient();

  // Batch deletion mutation
  const batchMutation = useMutation<
    BatchDeleteCharactersResponse,
    ApiError,
    string[]
  >({
    mutationFn: async (characterIds: string[]) => {
      const results = await deleteCharactersBatch(characterIds);
      return results;
    },
    onSuccess: (data) => {
      // Invalidate all character list queries to refresh the list
      // This ensures all filtered views update immediately
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.all });

      // Remove deleted characters from cache
      // Invalidate all detail queries to ensure deleted characters are removed
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.details() });

      if (showToasts) {
        if (data.failed === 0) {
          toast.success("Characters deleted successfully", {
            description: `${data.success} character(s) have been permanently deleted.`,
          });
        } else {
          toast.warning("Some characters could not be deleted", {
            description: `${data.success} deleted successfully, ${data.failed} failed.`,
          });
        }
      }

      onSuccess?.(data);
    },
    onError: (error) => {
      if (showToasts) {
        toast.error("Failed to delete characters", {
          description: error.message || error.error || "An error occurred while deleting the characters.",
        });
      }

      onError?.(error);
    },
  });

  return {
    // Batch deletion (for multiple characters)
    deleteCharactersBatch: batchMutation.mutate,
    deleteCharactersBatchAsync: batchMutation.mutateAsync,

    // Loading state
    isLoading: batchMutation.isPending,
    isSuccess: batchMutation.isSuccess,
    isError: batchMutation.isError,
    error: batchMutation.error,
    data: batchMutation.data,
    reset: () => {
      batchMutation.reset();
    },
  };
};

