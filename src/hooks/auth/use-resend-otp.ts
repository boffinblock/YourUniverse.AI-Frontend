/**
 * useResendOtp Hook
 * Custom hook for resending OTP with TanStack Query
 * Handles OTP resend requests with rate limiting awareness
 */
"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { resendOtp } from "@/lib/api/auth";
import type { ResendOtpRequest, ResendOtpResponse } from "@/lib/api/auth";
import type { ApiError } from "@/lib/api/shared/types";

interface UseResendOtpOptions {
  onSuccess?: (data: ResendOtpResponse) => void;
  onError?: (error: ApiError) => void;
  showToasts?: boolean;
}

export const useResendOtp = (options: UseResendOtpOptions = {}) => {
  const {
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
    showToasts = true,
  } = options;

  const mutation = useMutation({
    mutationFn: async (data: ResendOtpRequest) => {
      return await resendOtp(data);
    },

    retry: false,

    onSuccess: (response) => {
      const { data } = response;

      if (showToasts) {
        toast.success("OTP Resent", {
          description: data.message || "Please check your email or SMS for the new code.",
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
        "Failed to resend OTP. Please try again.";

      if (showToasts) {
        toast.error("Resend Failed", {
          description: errorMessage,
          duration: 5000,
        });
      }

      if (onErrorCallback) {
        onErrorCallback(error);
      }
    },
  });

  const resend = (data: ResendOtpRequest) => {
    return mutation.mutate(data);
  };

  const resendAsync = (data: ResendOtpRequest) => {
    return mutation.mutateAsync(data);
  };

  return {
    resend,
    resendAsync,
    status: mutation.status,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data?.data,
    error: mutation.error as ApiError | null,
    reset: mutation.reset,
  };
};

