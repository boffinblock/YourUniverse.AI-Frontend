/**
 * useResetPassword Hook
 * Custom hook for password reset with TanStack Query
 */
"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { resetPassword } from "@/lib/api/auth";
import type { ResetPasswordRequest, ResetPasswordResponse } from "@/lib/api/auth";
import type { ApiError } from "@/lib/api/shared/types";

interface UseResetPasswordOptions {
  onSuccess?: (data: ResetPasswordResponse) => void;
  onError?: (error: ApiError) => void;
  showToasts?: boolean;
  redirectOnSuccess?: boolean;
  redirectPath?: string;
}

export const useResetPassword = (options: UseResetPasswordOptions = {}) => {
  const {
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
    showToasts = true,
    redirectOnSuccess = true,
    redirectPath = "/sign-in",
  } = options;

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      return await resetPassword(data);
    },

    retry: false,

    onSuccess: (response) => {
      const { data } = response;

      if (showToasts) {
        toast.success("Password Reset", {
          description: data.message || "Password reset successfully. Please login with your new password.",
          duration: 5000,
        });
      }

      if (onSuccessCallback) {
        onSuccessCallback(data);
      }

      if (redirectOnSuccess) {
        setTimeout(() => {
          router.push(redirectPath);
        }, 2000);
      }
    },

    onError: (error: ApiError) => {
      const errorMessage =
        error.message ||
        error.error ||
        "Password reset failed. Please try again.";

      if (showToasts) {
        toast.error("Reset Failed", {
          description: errorMessage,
          duration: 5000,
        });
      }

      if (onErrorCallback) {
        onErrorCallback(error);
      }
    },
  });

  const reset = (data: ResetPasswordRequest) => {
    return mutation.mutate(data);
  };

  const resetAsync = (data: ResetPasswordRequest) => {
    return mutation.mutateAsync(data);
  };

  return {
    resetPassword: reset,
    resetPasswordAsync: resetAsync,
    status: mutation.status,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data?.data,
    error: mutation.error as ApiError | null,
    reset: mutation.reset,
  };
};

