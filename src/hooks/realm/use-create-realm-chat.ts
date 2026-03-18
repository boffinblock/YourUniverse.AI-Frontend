/**
 * useCreateRealmChat Hook
 * POST /api/v1/realms/:realmId/chats - Create a new realm chat
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createRealmChat,
  type CreateRealmChatRequest,
  type CreateRealmChatResponse,
} from "@/lib/api/realms/realm-chats";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { ApiError } from "@/lib/api/shared/types";

interface UseCreateRealmChatOptions {
  realmId: string | undefined;
  onSuccess?: (data: CreateRealmChatResponse) => void;
  onError?: (error: ApiError) => void;
  showToasts?: boolean;
}

export function useCreateRealmChat(options: UseCreateRealmChatOptions) {
  const {
    realmId,
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
    showToasts = true,
  } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (body?: CreateRealmChatRequest) => {
      if (!realmId) throw new Error("Realm ID is required");
      const response = await createRealmChat(realmId, body);
      return response.data;
    },
    onSuccess: (data) => {
      if (realmId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.realms.realmChatList(realmId),
        });
      }
      if (showToasts) toast.success("Realm chat created");
      onSuccessCallback?.(data);
    },
    onError: (error: unknown) => {
      const apiErr = error as ApiError;
      if (showToasts) {
        toast.error("Failed to create realm chat", {
          description: apiErr.message || apiErr.error || "Please try again.",
          duration: 5000,
        });
      }
      onErrorCallback?.(apiErr);
    },
  });

  return {
    createRealmChat: mutation.mutate,
    createRealmChatAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error as ApiError | null,
    data: mutation.data,
  };
}
