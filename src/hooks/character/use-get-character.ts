/**
 * useGetCharacter Hook
 * Custom hook for fetching a single character with TanStack Query
 */
"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getCharacter } from "@/lib/api/characters";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { GetCharacterResponse } from "@/lib/api/characters";
import type { ApiError } from "@/lib/api/shared/types";

/**
 * Options for fetching a character
 */
interface UseGetCharacterOptions {
  /**
   * Whether to require authentication (default: false)
   */
  requireAuth?: boolean;

  /**
   * Whether to enable the query (default: true)
   */
  enabled?: boolean;

  /**
   * Stale time in milliseconds (default: 5 minutes)
   */
  staleTime?: number;

  /**
   * Cache time in milliseconds (default: 10 minutes)
   */
  cacheTime?: number;

  /**
   * Whether to refetch on window focus (default: true)
   */
  refetchOnWindowFocus?: boolean;

  /**
   * Whether to refetch on mount (default: true)
   */
  refetchOnMount?: boolean;

  /**
   * Retry configuration
   */
  retry?: boolean | number | ((failureCount: number, error: ApiError) => boolean);

  /**
   * Callback fired on successful fetch
   */
  onSuccess?: (data: GetCharacterResponse) => void;

  /**
   * Callback fired on fetch error
   */
  onError?: (error: ApiError) => void;

  /**
   * Whether to show error toast notifications (default: false)
   */
  showErrorToast?: boolean;
}

/**
 * Custom hook for fetching a single character
 * @param characterId - Character UUID
 * @param options - Configuration options for the query
 * @returns Query object with character data, loading state, and error state
 */
export const useGetCharacter = (
  characterId: string | undefined,
  options: UseGetCharacterOptions = {}
) => {
  const {
    requireAuth = false,
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus = true,
    refetchOnMount = true,
    retry = (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        return false;
      }
      return failureCount < 3;
    },
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
    showErrorToast = false,
  } = options;

  const query = useQuery({
    queryKey: queryKeys.characters.detail(characterId || ""),
    queryFn: async () => {
      if (!characterId) {
        throw new Error("Character ID is required");
      }
      const response = await getCharacter(characterId, { requireAuth });
      return response.data;
    },
    enabled: enabled && !!characterId,
    staleTime,
    gcTime: cacheTime,
    refetchOnWindowFocus,
    refetchOnMount,
    retry,
    onSuccess: onSuccessCallback,
    onError: (error: ApiError) => {
      if (onErrorCallback) {
        onErrorCallback(error);
      }

      if (showErrorToast) {
        const errorMessage =
          error.message ||
          error.error ||
          "Failed to load character. Please try again.";

        toast.error("Failed to Load Character", {
          description: errorMessage,
          duration: 5000,
        });
      }
    },
  });

  return {
    /**
     * Character data
     */
    character: query.data?.character,

    /**
     * Full response data
     */
    data: query.data,

    /**
     * Query status
     */
    status: query.status,

    /**
     * Whether query is currently fetching
     */
    isLoading: query.isLoading,

    /**
     * Whether query is currently refetching
     */
    isRefetching: query.isRefetching,

    /**
     * Whether query completed successfully
     */
    isSuccess: query.isSuccess,

    /**
     * Whether query failed
     */
    isError: query.isError,

    /**
     * Error object
     */
    error: query.error as ApiError | null,

    /**
     * Manually refetch the character
     */
    refetch: query.refetch,
  };
};

