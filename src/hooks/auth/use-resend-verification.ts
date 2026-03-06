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

        onSuccess: (response) => {
            const { message } = response.data;

            if (showToasts) {
                toast.success("Verification Sent", {
                    description: message || "A new verification link has been sent to your email.",
                    duration: 5000,
                });
            }

            if (onSuccessCallback) {
                onSuccessCallback(response.data);
            }
        },

        onError: (error: ApiError) => {
            const errorMessage =
                error.message ||
                error.error ||
                "Failed to resend verification email. Please try again.";

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

    const resend = (data: ResendVerificationEmailRequest) => {
        return mutation.mutate(data);
    };

    const resendAsync = (data: ResendVerificationEmailRequest) => {
        return mutation.mutateAsync(data);
    };

    return {
        resend,
        resendAsync,
        isLoading: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error as ApiError | null,
        reset: mutation.reset,
    };
};
