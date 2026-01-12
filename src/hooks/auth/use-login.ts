/**
 * useLogin Hook
 * Custom hook for user login (Step 1: Request OTP) with TanStack Query
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginUser } from "@/lib/api/auth";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { LoginRequest, LoginResponse } from "@/lib/api/auth";
import type { ApiError } from "@/lib/api/shared/types";

interface UseLoginOptions {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: ApiError) => void;
  showToasts?: boolean;
  redirectOnSuccess?: boolean;
  redirectPath?: string;
}

export const useLogin = (options: UseLoginOptions = {}) => {
  const {
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
    showToasts = true,
    redirectOnSuccess = true,
    redirectPath = "/verify/otp",
  } = options;

  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      return await loginUser(data);
    },

    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if ((error as ApiError).statusCode && (error as ApiError).statusCode! >= 400 && (error as ApiError).statusCode! < 500) {
        return false;
      }
      // Retry up to 2 times for network/server errors
      return failureCount < 2;
    },

    retryDelay: (attemptIndex) => {
      return Math.min(1000 * 2 ** attemptIndex, 3000);
    },

    onSuccess: (response) => {
      const { data } = response;

      // Store userId in sessionStorage for OTP verification
      if (typeof window !== "undefined") {
        sessionStorage.setItem("loginUserId", data.userId);
        sessionStorage.setItem("verificationMethod", data.verificationMethod);
      }

      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });

      if (showToasts) {
        const method = data.verificationMethod === "email" ? "email" : "phone";
        toast.success("OTP Sent", {
          description: `We've sent a verification code to your ${method}. Please check and enter the code.`,
          duration: 5000,
        });
      }

      if (onSuccessCallback) {
        onSuccessCallback(data);
      }

      if (redirectOnSuccess) {
        // Pass userId as query param
        setTimeout(() => {
          router.push(`${redirectPath}/${data.userId}`);
        }, 1000);
      }
    },

    onError: (error: ApiError) => {
      const errorMessage =
        error.message ||
        error.error ||
        "Login failed. Please check your credentials and try again.";

      if (showToasts) {
        toast.error("Login Failed", {
          description: errorMessage,
          duration: 5000,
        });
      }

      if (onErrorCallback) {
        onErrorCallback(error);
      }
    },
  });

  const login = (data: LoginRequest) => {
    return mutation.mutate(data);
  };

  const loginAsync = (data: LoginRequest) => {
    return mutation.mutateAsync(data);
  };

  return {
    login,
    loginAsync,
    status: mutation.status,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data?.data,
    error: mutation.error as ApiError | null,
    reset: mutation.reset,
  };
};

