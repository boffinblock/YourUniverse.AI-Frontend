/**
 * useVerifyOtp Hook
 * Custom hook for OTP verification with TanStack Query
 * Handles Step 2 of the 2FA login process
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { verifyOtp } from "@/lib/api/auth";
import { queryKeys } from "@/lib/api/shared/query-keys";
import { storeTokens } from "@/lib/utils/token-storage";
import type { VerifyOtpRequest, VerifyOtpResponse } from "@/lib/api/auth";
import type { ApiError } from "@/lib/api/shared/types";

interface UseVerifyOtpOptions {
  onSuccess?: (data: VerifyOtpResponse) => void;
  onError?: (error: ApiError) => void;
  showToasts?: boolean;
  redirectOnSuccess?: boolean;
  redirectPath?: string;
}

export const useVerifyOtp = (options: UseVerifyOtpOptions = {}) => {
  const {
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
    showToasts = true,
    redirectOnSuccess = true,
    redirectPath = "/",
  } = options;

  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: VerifyOtpRequest) => {
      return await verifyOtp(data);
    },

    retry: (failureCount, error) => {
      if ((error as ApiError).statusCode && (error as ApiError).statusCode! >= 400 && (error as ApiError).statusCode! < 500) {
        return false;
      }
      return failureCount < 2;
    },

    retryDelay: (attemptIndex) => {
      return Math.min(1000 * 2 ** attemptIndex, 3000);
    },

    onSuccess: (response) => {
      const { data } = response;

      // Store tokens securely
      storeTokens(data.tokens);

      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });

      // Set user data in cache
      queryClient.setQueryData(queryKeys.user.current(), { user: data.user });
      queryClient.setQueryData(queryKeys.auth.user(), data.user);

      if (showToasts) {
        toast.success("Login Successful", {
          description: "Welcome back! Redirecting...",
          duration: 3000,
        });
      }

      if (onSuccessCallback) {
        onSuccessCallback(data);
      }

      if (redirectOnSuccess) {
        setTimeout(() => {
          router.push(redirectPath);
        }, 1000);
      }
    },

    onError: (error: ApiError) => {
      const errorMessage =
        error.message ||
        error.error ||
        "OTP verification failed. Please try again.";

      if (showToasts) {
        toast.error("Verification Failed", {
          description: errorMessage,
          duration: 5000,
        });
      }

      if (onErrorCallback) {
        onErrorCallback(error);
      }
    },
  });

  const verify = (data: VerifyOtpRequest) => {
    return mutation.mutate(data);
  };

  const verifyAsync = (data: VerifyOtpRequest) => {
    return mutation.mutateAsync(data);
  };

  return {
    verify,
    verifyAsync,
    status: mutation.status,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data?.data,
    error: mutation.error as ApiError | null,
    reset: mutation.reset,
  };
};

