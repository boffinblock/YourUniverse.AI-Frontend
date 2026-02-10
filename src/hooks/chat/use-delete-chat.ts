/**
 * useDeleteChat Hook
 * DELETE /api/v1/chats/:id - Permanently delete a chat and its messages
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteChat } from "@/lib/api/chats";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { ApiError } from "@/lib/api/shared/types";

interface UseDeleteChatOptions {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
  showToasts?: boolean;
}

export const useDeleteChat = (options: UseDeleteChatOptions = {}) => {
  const { onSuccess: onSuccessCallback, onError: onErrorCallback, showToasts = true } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteChat(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.all });
      if (showToasts) {
        toast.success("Chat deleted");
      }
      onSuccessCallback?.();
    },
    onError: (error: unknown) => {
      const apiErr = error as ApiError;
      if (showToasts) {
        toast.error("Failed to delete chat", {
          description: apiErr.message || apiErr.error || "Please try again.",
          duration: 5000,
        });
      }
      onErrorCallback?.(apiErr);
    },
  });

  return {
    deleteChat: mutation.mutate,
    deleteChatAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error as ApiError | null,
  };
};
