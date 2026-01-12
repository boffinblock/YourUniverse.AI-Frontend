/**
 * useUpdatePersona Hook
 * Custom hook for updating a persona with TanStack Query
 * Handles mutation, error states, success callbacks, and cache invalidation
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updatePersona } from "@/lib/api/personas";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { UpdatePersonaRequest, UpdatePersonaResponse } from "@/lib/api/personas";
import type { ApiError } from "@/lib/api/shared/types";

/**
 * Mutation options for updating a persona
 */
interface UseUpdatePersonaOptions {
  /**
   * Persona ID to update
   */
  personaId: string;

  /**
   * Callback fired on successful persona update
   * @param data - Persona update response data
   */
  onSuccess?: (data: UpdatePersonaResponse) => void;

  /**
   * Callback fired on persona update error
   * @param error - API error object
   */
  onError?: (error: ApiError) => void;

  /**
   * Whether to show toast notifications (default: true)
   */
  showToasts?: boolean;
}

/**
 * Custom hook for updating a persona
 * @param options - Configuration options for the mutation
 * @returns Mutation object with status, data, and mutation function
 */
export const useUpdatePersona = (options: UseUpdatePersonaOptions) => {
  const {
    personaId,
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
    showToasts = true,
  } = options;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: UpdatePersonaRequest) => {
      if (!personaId) {
        throw new Error("Persona ID is required for update");
      }
      return await updatePersona(personaId, data);
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
    /**
     * On mutation start
     * Capture old persona data for comparison
     */
    onMutate: async (variables) => {
      // Get the old persona data from cache
      const oldPersona = queryClient.getQueryData<{ persona: any }>(
        queryKeys.personas.detail(personaId)
      );
      
      // Return context with old data for use in onSuccess/onError
      return { oldPersona };
    },
    onSuccess: (response, variables, context) => {
      const { data } = response;
      const oldPersona = context?.oldPersona;

      queryClient.invalidateQueries({ queryKey: queryKeys.personas.all });

      if (data.persona) {
        queryClient.setQueryData(
          queryKeys.personas.detail(data.persona.id),
          { persona: data.persona }
        );
      }

      // Invalidate character queries if characterIds were updated
      // Note: Personas don't have characterIds in the update request,
      // but characters link to personas. When a persona is updated,
      // we should invalidate all character queries to ensure they reflect
      // any changes that might affect the persona relationship.
      // However, since personas don't directly manage characterIds,
      // we'll invalidate character queries when persona data changes
      // to ensure character pages show updated persona information.
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.all });

      if (showToasts) {
        toast.success("Persona Updated", {
          description: data.message || "Your persona has been updated successfully.",
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
        "Failed to update persona. Please try again.";

      if (showToasts) {
        toast.error("Update Failed", {
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
    updatePersona: mutation.mutate,
    updatePersonaAsync: mutation.mutateAsync,
    status: mutation.status,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data?.data,
    error: mutation.error as ApiError | null,
    reset: mutation.reset,
  };
};
