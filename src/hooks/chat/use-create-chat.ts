/**
 * useCreateChat Hook
 * POST /api/v1/chats - Create a new chat (optional folderId, characterId, modelId, title)
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createChat } from "@/lib/api/chats";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { CreateChatRequest, CreateChatResponse } from "@/lib/api/chats";
import type { ApiError } from "@/lib/api/shared/types";

interface UseCreateChatOptions {
  onSuccess?: (data: CreateChatResponse) => void;
  onError?: (error: ApiError) => void;
  showToasts?: boolean;
}

export const useCreateChat = (options: UseCreateChatOptions = {}) => {
  const { onSuccess: onSuccessCallback, onError: onErrorCallback, showToasts = true } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreateChatRequest) => {
      const response = await createChat(data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.all });
      if (showToasts) {
        toast.success("Chat created");
      }
      onSuccessCallback?.(data);
    },
    onError: (error: unknown) => {
      const apiErr = error as ApiError;
      if (showToasts) {
        toast.error("Failed to create chat", {
          description: apiErr.message || apiErr.error || "Please try again.",
          duration: 5000,
        });
      }
      onErrorCallback?.(apiErr);
    },
  });

  return {
    createChat: mutation.mutate,
    createChatAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error as ApiError | null,
    data: mutation.data,
  };
};
