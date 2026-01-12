import { useMutation, useQueryClient } from "@tanstack/react-query";
import { duplicateCharactersBatch } from "@/lib/api/characters/endpoints";
import { queryKeys } from "@/lib/api";
import type { BatchDuplicateCharactersResponse } from "@/lib/api/characters";
import type { ApiError } from "@/lib/api/shared/types";
import { toast } from "sonner";

interface UseDuplicateCharacterOptions {
  onSuccess?: (data: BatchDuplicateCharactersResponse) => void;
  onError?: (error: ApiError) => void;
  showToasts?: boolean;
}

export const useDuplicateCharacter = (options?: UseDuplicateCharacterOptions) => {
  const { onSuccess, onError, showToasts = true } = options || {};
  const queryClient = useQueryClient();

  // Batch duplication mutation
  const batchMutation = useMutation<
    BatchDuplicateCharactersResponse,
    ApiError,
    string[]
  >({
    mutationFn: async (characterIds: string[]) => {
      const response = await duplicateCharactersBatch(characterIds);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate all character list queries to refresh the list
      // This ensures all filtered views update immediately with the new duplicated character
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.all });

      // Invalidate specific character queries for the duplicated characters
      data.characters.forEach((character) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.characters.detail(character.id)
        });
      });

      if (showToasts) {
        toast.success("Characters duplicated successfully", {
          description: data.message || `${data.characters.length} character(s) have been created.`,
        });
      }

      onSuccess?.(data);
    },
    onError: (error) => {
      if (showToasts) {
        toast.error("Failed to duplicate characters", {
          description: error.message || error.error || "An error occurred while duplicating the characters.",
        });
      }

      onError?.(error);
    },
  });

  return {
    // Batch duplication (optimized for multiple characters)
    duplicateCharactersBatch: batchMutation.mutate,
    duplicateCharactersBatchAsync: batchMutation.mutateAsync,

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

