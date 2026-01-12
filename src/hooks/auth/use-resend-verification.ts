/**
 * useResendVerification Hook
 * Custom hook for resending verification email with TanStack Query
 */
"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { resendVerificationEmail } from "@/lib/api/auth";
import type { ResendVerificationEmailRequest, ResendVerificationEmailResponse } from "@/lib/api/auth";
import type { ApiError } from "@/lib/api/shared/types";

interface UseResendVerificationOptions {
    onSuccess?: (data: ResendVerificationEmailResponse) => void;
    onError?: (error: ApiError) => void;
    showToasts?: boolean;
}

export const useResendVerification = (options: UseResendVerificationOptions = {}) => {
    const {
        onSuccess: onSuccessCallback,
        onError: onErrorCallback,
        showToasts = true,
    } = options;

    const mutation = useMutation({
        mutationFn: async (data: ResendVerificationEmailRequest) => {
            return await resendVerificationEmail(data);
        },
        retry: false,
        onSuccess: (response) => {
            const { data } = response;

            if (showToasts) {
                toast.success("Verification Email Sent", {
                    description: data.message || "Please check your inbox for the verification link.",
                    duration: 5000,
                });
            }

            if (onSuccessCallback) {
                onSuccessCallback(data);
            }
        },
        onError: (error: ApiError) => {
            const errorMessage =
                (typeof error === "object" && (error?.message || error?.error)) ||
                "Failed to resend verification email. Please try again.";

            if (showToasts) {
                toast.error("Resend Failed", {
                    description: String(errorMessage),
                    duration: 5000,
                });
            }

            if (onErrorCallback) {
                onErrorCallback(error);
            }
        },
    });

    const resend = (data: ResendVerificationEmailRequest) => {
        return mutation.mutate(data);
    };

    const resendAsync = (data: ResendVerificationEmailRequest) => {
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

