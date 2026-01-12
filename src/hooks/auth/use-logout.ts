/**
 * useLogout Hook
 * Custom hook for user logout with TanStack Query
 * Handles token revocation and cache cleanup
 */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutUser } from "@/lib/api/auth";
import { queryKeys } from "@/lib/api/shared/query-keys";
import { getAccessToken, getRefreshToken, clearTokens } from "@/lib/utils/token-storage";
import { tokenRefreshManager } from "@/lib/utils/token-refresh-manager";
import type { LogoutRequest, LogoutResponse } from "@/lib/api/auth";
import type { ApiError } from "@/lib/api/shared/types";

interface UseLogoutOptions {
  onSuccess?: (data: LogoutResponse) => void;
  onError?: (error: ApiError) => void;
  showToasts?: boolean;
  redirectOnSuccess?: boolean;
  redirectPath?: string;
}

export const useLogout = (options: UseLogoutOptions = {}) => {
  const {
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
    showToasts = true,
    redirectOnSuccess = true,
    redirectPath = "/sign-in",
  } = options;

  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!accessToken || !refreshToken) {
        throw new Error("No tokens available");
      }

      return await logoutUser({ refreshToken }, accessToken);
    },

    retry: false,

    onSuccess: (response) => {
      const { data } = response;

      // Clear tokens
      clearTokens();

      // Reset token refresh manager
      tokenRefreshManager.reset();

      // Clear all auth-related queries
      queryClient.removeQueries({ queryKey: queryKeys.auth.all });

      if (showToasts) {
        toast.success("Logged Out", {
          description: data.message || "You have been logged out successfully.",
          duration: 3000,
        });
      }

      if (onSuccessCallback) {
        onSuccessCallback(data);
      }

      if (redirectOnSuccess) {
        setTimeout(() => {
          router.push(redirectPath);
        }, 500);
      }
    },

    onError: (error: ApiError) => {
      // Even if API call fails, clear local tokens and cache
      clearTokens();

      // Reset token refresh manager
      tokenRefreshManager.reset();

      queryClient.removeQueries({ queryKey: queryKeys.auth.all });

      const errorMessage =
        error.message ||
        error.error ||
        "Logout failed, but local session cleared.";

      if (showToasts) {
        toast.error("Logout Error", {
          description: errorMessage,
          duration: 5000,
        });
      }

      if (onErrorCallback) {
        onErrorCallback(error);
      }

      // Redirect anyway since we cleared local session
      if (redirectOnSuccess) {
        setTimeout(() => {
          router.push(redirectPath);
        }, 1000);
      }
    },
  });

  const logout = () => {
    return mutation.mutate();
  };

  const logoutAsync = () => {
    return mutation.mutateAsync();
  };

  return {
    logout,
    logoutAsync,
    status: mutation.status,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    data: mutation.data?.data,
    error: mutation.error as ApiError | null,
    reset: mutation.reset,
  };
};

