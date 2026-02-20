/**
 * useUpdateChat Hook
 * PATCH /api/v1/chats/:id - Update chat (title, folderId, modelId)
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateChat } from "@/lib/api/chats";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { UpdateChatRequest } from "@/lib/api/chats";
import type { ApiError } from "@/lib/api/shared/types";

interface UseUpdateChatOptions {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
  showToasts?: boolean;
}

export const useUpdateChat = (options: UseUpdateChatOptions = {}) => {
  const { onSuccess: onSuccessCallback, onError: onErrorCallback, showToasts = true } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ chatId, data }: { chatId: string; data: UpdateChatRequest }) => {
      const response = await updateChat(chatId, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.detail(variables.chatId) });
      if (showToasts) {
        toast.success("Chat updated");
      }
      onSuccessCallback?.();
    },
    onError: (error: unknown) => {
      const apiErr = error as ApiError;
      if (showToasts) {
        toast.error("Failed to update chat", {
          description: apiErr.message || apiErr.error || "Please try again.",
          duration: 5000,
        });
      }
      onErrorCallback?.(apiErr);
    },
  });

  return {
    updateChat: mutation.mutate,
    updateChatAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error as ApiError | null,
    data: mutation.data,
  };
};
