/**
 * useForgotPassword Hook
 * Custom hook for forgot password requests with TanStack Query
 */
"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { forgotPassword } from "@/lib/api/auth";
import type { ForgotPasswordRequest, ForgotPasswordResponse } from "@/lib/api/auth";
import type { ApiError } from "@/lib/api/shared/types";

interface UseForgotPasswordOptions {
  onSuccess?: (data: ForgotPasswordResponse) => void;
  onError?: (error: ApiError) => void;
  showToasts?: boolean;
}

export const useForgotPassword = (options: UseForgotPasswordOptions = {}) => {
  const {
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
    showToasts = true,
  } = options;

  const mutation = useMutation({
    mutationFn: async (data: ForgotPasswordRequest) => {
      return await forgotPassword(data);
    },

    retry: false,

    onSuccess: (response) => {
      const { data } = response;

      if (showToasts) {
        toast.success("Reset Link Sent", {
          description: data.message || "If an account exists with this email, you will receive a password reset link.",
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
        "Failed to send reset link. Please try again.";

      if (showToasts) {
        toast.error("Request Failed", {
          description: errorMessage,
          duration: 5000,
        });
      }

      if (onErrorCallback) {
        onErrorCallback(error);
      }
    },
  });

  const requestReset = (data: ForgotPasswordRequest) => {
    return mutation.mutate(data);
  };

  const requestResetAsync = (data: ForgotPasswordRequest) => {
    return mutation.mutateAsync(data);
  };

  return {
    requestReset,
    requestResetAsync,
    status: mutation.status,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data?.data,
    error: mutation.error as ApiError | null,
    reset: mutation.reset,
  };
};

