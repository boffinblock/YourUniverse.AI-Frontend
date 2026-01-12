/**
 * useVerifyEmail Hook
 * Simplified email verification hook with TanStack Query
 * Prevents duplicate API calls by using proper query configuration
 */
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { verifyEmail } from "@/lib/api/auth";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { ApiError } from "@/lib/api/shared/types";

// Global map to track initiated queries per token (prevents duplicate calls across components)
const initiatedTokens = new Set<string>();

interface UseVerifyEmailOptions {
  token: string;
  enabled?: boolean;
  showToasts?: boolean;
  redirectOnSuccess?: boolean;
  redirectPath?: string;
  redirectDelay?: number;
}

export const useVerifyEmail = (options: UseVerifyEmailOptions) => {
  const {
    token,
    enabled = true,
    showToasts = true,
    redirectOnSuccess = true,
    redirectPath = "/sign-in",
    redirectDelay = 3000,
  } = options;

  const queryClient = useQueryClient();
  const router = useRouter();
  const hasHandledSuccess = useRef(false);
  const hasHandledError = useRef(false);

  // Check if query already has data in cache
  const cachedData = queryClient.getQueryData(queryKeys.auth.verify(token));
  const hasCachedSuccess = cachedData && typeof cachedData === 'object' && 'success' in cachedData && (cachedData as any).success === true;

  // Check if query is already fetching (prevents duplicate calls)
  const queryState = queryClient.getQueryState(queryKeys.auth.verify(token));
  const isAlreadyFetching = queryState?.status === 'pending' || queryState?.fetchStatus === 'fetching';

  // Only enable query if:
  // 1. enabled prop is true
  // 2. token exists
  // 3. We don't already have successful cached data
  // 4. Query hasn't been initiated for this token (prevents double calls in React Strict Mode)
  // 5. Query is not already fetching
  const shouldEnable = enabled && !!token && !hasCachedSuccess && !initiatedTokens.has(token) && !isAlreadyFetching;

  const query = useQuery({
    queryKey: queryKeys.auth.verify(token),
    queryFn: async () => {
      // Mark token as initiated immediately to prevent duplicate calls
      if (token) {
        initiatedTokens.add(token);
      }
      try {
        return await verifyEmail(token);
      } catch (error) {
        // Remove from set on error so user can retry
        if (token) {
          initiatedTokens.delete(token);
        }
        throw error;
      }
    },
    enabled: shouldEnable,
    retry: false,
    // Prevent refetching - once verified, don't call again
    staleTime: Infinity, // Never consider stale
    gcTime: Infinity, // Keep in cache forever
    refetchOnMount: false, // Don't refetch on mount
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on reconnect
  });

  // Use cached data if available and successful
  const finalData = hasCachedSuccess ? cachedData : query.data;
  const finalIsSuccess = hasCachedSuccess || query.isSuccess;
  const finalIsLoading = !hasCachedSuccess && query.isPending;
  const finalIsFetching = !hasCachedSuccess && query.isFetching;

  // Reset handlers when token changes
  useEffect(() => {
    hasHandledSuccess.current = false;
    hasHandledError.current = false;
  }, [token]);

  // Handle success - only once
  useEffect(() => {
    if (!finalIsSuccess || !finalData || !(finalData as any)?.success || hasHandledSuccess.current) return;

    hasHandledSuccess.current = true;
    const message = (finalData as any).data?.message || "Email verified successfully";

    // Invalidate auth queries
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });

    if (showToasts) {
      toast.success("Email Verified", { description: message });
    }

    if (redirectOnSuccess) {
      const timeout = setTimeout(() => router.push(redirectPath), redirectDelay);
      return () => clearTimeout(timeout);
    }
  }, [finalIsSuccess, finalData, queryClient, showToasts, redirectOnSuccess, redirectPath, redirectDelay, router]);

  // Handle error - only once
  useEffect(() => {
    if (!query.isError || !query.error || hasHandledError.current) return;

    hasHandledError.current = true;
    const apiError = query.error as unknown as ApiError;
    const errorMessage =
      (typeof apiError === "object" && (apiError?.message || apiError?.error)) ||
      "Email verification failed. The link may have expired or is invalid.";

    if (showToasts) {
      toast.error("Verification Failed", { description: String(errorMessage) });
    }
  }, [query.isError, query.error, showToasts]);

  return {
    data: (finalData as any)?.data,
    message: (finalData as any)?.data?.message,
    isLoading: finalIsLoading,
    isFetching: finalIsFetching,
    isSuccess: finalIsSuccess,
    isError: query.isError,
    error: (query.error as unknown as ApiError) || null,
    refetch: query.refetch,
  };
};
