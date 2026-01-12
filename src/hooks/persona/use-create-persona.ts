/**
 * useCreatePersona Hook
 * Custom hook for creating a persona with TanStack Query
 * Handles mutation, error states, success callbacks, and cache invalidation
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPersona } from "@/lib/api/personas";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { CreatePersonaRequest, CreatePersonaResponse } from "@/lib/api/personas";
import type { ApiError } from "@/lib/api/shared/types";

/**
 * Mutation options for creating a persona
 */
interface UseCreatePersonaOptions {
  /**
   * Callback fired on successful persona creation
   * @param data - Persona creation response data
   */
  onSuccess?: (data: CreatePersonaResponse) => void;

  /**
   * Callback fired on persona creation error
   * @param error - API error object
   */
  onError?: (error: ApiError) => void;

  /**
   * Whether to show toast notifications (default: true)
   */
  showToasts?: boolean;
}

/**
 * Custom hook for creating a persona
 * @param options - Configuration options for the mutation
 * @returns Mutation object with status, data, and mutation function
 */
export const useCreatePersona = (options: UseCreatePersonaOptions = {}) => {
  const {
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
    showToasts = true,
  } = options;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreatePersonaRequest) => {
      return await createPersona(data);
    },
    retry: (failureCount, error) => {
      if ((error as ApiError).statusCode && (error as ApiError).statusCode! >= 400 && (error as ApiError).statusCode! < 500) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => {
      return Math.min(1000 * 2 ** attemptIndex, 4000);
    },
    onSuccess: (response) => {
      const { data } = response;

      queryClient.invalidateQueries({ queryKey: queryKeys.personas.all });

      if (data.persona) {
        queryClient.setQueryData(
          queryKeys.personas.detail(data.persona.id),
          data.persona
        );
      }

      if (showToasts) {
        toast.success("Persona Created", {
          description: data.message || "Your persona has been created successfully.",
          duration: 5000,
        });
      }

      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error.message ||
        error.error ||
        "Failed to create persona. Please try again.";

      if (showToasts) {
        toast.error("Creation Failed", {
          description: errorMessage,
          duration: 5000,
        });
      }

      if (onErrorCallback) {
        onErrorCallback(error);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.personas.lists() });
    },
  });

  return {
    createPersona: mutation.mutate,
    createPersonaAsync: mutation.mutateAsync,
    status: mutation.status,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data?.data,
    error: mutation.error as ApiError | null,
    reset: mutation.reset,
  };
};
