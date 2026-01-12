/**
 * useRegister Hook
 * Custom hook for user registration with TanStack Query
 * Handles mutation, error states, success callbacks, and optimistic updates
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerUser } from "@/lib/api/auth";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { RegisterRequest, RegisterResponse } from "@/lib/api/auth";
import type { ApiError } from "@/lib/api/shared/types";

/**
 * Mutation options for registration
 */
interface UseRegisterOptions {
  /**
   * Callback fired on successful registration
   * @param data - Registration response data
   */
  onSuccess?: (data: RegisterResponse) => void;

  /**
   * Callback fired on registration error
   * @param error - API error object
   */
  onError?: (error: ApiError) => void;

  /**
   * Whether to show toast notifications (default: true)
   */
  showToasts?: boolean;

  /**
   * Whether to redirect after successful registration (default: true)
   * Redirects to email verification page
   */
  redirectOnSuccess?: boolean;
}

/**
 * Custom hook for user registration
 * @param options - Configuration options for the mutation
 * @returns Mutation object with status, data, and mutation function
 */
export const useRegister = (options: UseRegisterOptions = {}) => {
  const {
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
    showToasts = true,
    redirectOnSuccess = true,
  } = options;

  const queryClient = useQueryClient();
  const router = useRouter();

  /**
   * Registration mutation
   * Uses TanStack Query's useMutation with advanced features:
   * - Retry logic (3 attempts with exponential backoff)
   * - Error handling with toast notifications
   * - Success handling with cache invalidation
   * - Optimistic updates (if needed in future)
   */
  const mutation = useMutation({
    mutationFn: async (data: RegisterRequest) => {
      return await registerUser(data);
    },

    /**
     * Retry configuration
     * Retries failed requests up to 3 times with exponential backoff
     */
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if ((error as ApiError).statusCode && (error as ApiError).statusCode! >= 400 && (error as ApiError).statusCode! < 500) {
        return false;
      }
      // Retry up to 3 times for network/server errors
      return failureCount < 3;
    },

    retryDelay: (attemptIndex) => {
      // Exponential backoff: 1s, 2s, 4s
      return Math.min(1000 * 2 ** attemptIndex, 4000);
    },

    /**
     * On mutation success
     * Handles success state, cache invalidation, and callbacks
     */
    onSuccess: (response) => {
      const { data } = response;

      // Invalidate auth-related queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });

      // Optionally set user data in cache for immediate access
      queryClient.setQueryData(
        queryKeys.auth.user(),
        data.user
      );

      // Show success toast
      if (showToasts) {
        toast.success("Registration Successful", {
          description: data.message || "Please check your email to verify your account.",
          duration: 5000,
        });
      }

      // Execute custom success callback
      if (onSuccessCallback) {
        onSuccessCallback(data);
      }

      // Redirect to email verification sent page
      if (redirectOnSuccess) {
        // Small delay to allow toast to be visible
        setTimeout(() => {
          // Pass email as query param for display
          const emailParam = data.user?.email ? `?email=${encodeURIComponent(data.user.email)}` : "";
          router.push(`/verify-email-sent${emailParam}`);
        }, 1000);
      }
    },

    /**
     * On mutation error
     * Handles error state, error messages, and callbacks
     */
    onError: (error: ApiError) => {
      // Extract error message
      const errorMessage =
        error.message ||
        error.error ||
        "Registration failed. Please try again.";

      // Show error toast
      if (showToasts) {
        toast.error("Registration Failed", {
          description: errorMessage,
          duration: 5000,
        });
      }

      // Execute custom error callback
      if (onErrorCallback) {
        onErrorCallback(error);
      }
    },

    /**
     * On mutation settle (both success and error)
     * Can be used for cleanup or analytics
     */
    onSettled: () => {
      // Any cleanup or analytics tracking can go here
    },
  });

  /**
   * Register function wrapper
   * Provides a cleaner API for calling the mutation
   */
  const register = (data: RegisterRequest) => {
    return mutation.mutate(data);
  };

  /**
   * Register async function wrapper
   * Returns a promise for use in async/await patterns
   */
  const registerAsync = (data: RegisterRequest) => {
    return mutation.mutateAsync(data);
  };

  return {
    /**
     * Mutation function
     * Call this to trigger registration
     */
    register,

    /**
     * Async mutation function
     * Returns a promise
     */
    registerAsync,

    /**
     * Mutation status
     * - idle: Not started
     * - pending: In progress
     * - error: Failed
     * - success: Completed successfully
     */
    status: mutation.status,

    /**
     * Whether mutation is currently pending
     */
    isLoading: mutation.isPending,

    /**
     * Whether mutation completed successfully
     */
    isSuccess: mutation.isSuccess,

    /**
     * Whether mutation failed
     */
    isError: mutation.isError,

    /**
     * Response data (available after success)
     */
    data: mutation.data?.data,

    /**
     * Error object (available after error)
     */
    error: mutation.error as ApiError | null,

    /**
     * Reset mutation state
     * Useful for clearing error/success states
     */
    reset: mutation.reset,
  };
};

