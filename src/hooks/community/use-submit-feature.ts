"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitFeatureRequest, type FeatureRequestPayload } from "@/lib/api/community/endpoints";
import type { ApiError } from "@/lib/api/shared/types";
import { useRouter } from "next/navigation";

interface UseSubmitFeatureOptions {
    onSuccess?: () => void;
    onError?: (error: ApiError) => void;
    showToasts?: boolean;
}

export const useSubmitFeature = (options?: UseSubmitFeatureOptions) => {
    const { onSuccess: onSuccessCallback, onError: onErrorCallback, showToasts = true } = options || {};
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async (payload: FeatureRequestPayload) => {
            return await submitFeatureRequest(payload);
        },
        onSuccess: (response) => {
            if (showToasts) {
                toast.success("Submission Successful", {
                    description: response.message || "Your feature request or bug report has been submitted to the admin.",
                });
            }

            if (onSuccessCallback) {
                onSuccessCallback();
            } else {
                router.push("/");
            }
        },
        onError: (error: ApiError | Error) => {
            const errorMessage =
                (error as ApiError).message ||
                (error as ApiError).error ||
                error.message ||
                "Failed to submit. Please try again.";

            if (showToasts) {
                toast.error("Submission Failed", {
                    description: errorMessage,
                });
            }

            if (onErrorCallback) {
                onErrorCallback(error as ApiError);
            }
        },
    });

    return {
        submitFeature: mutation.mutate,
        submitFeatureAsync: mutation.mutateAsync,
        isSubmitting: mutation.isPending,
        status: mutation.status,
        error: mutation.error as ApiError | null,
        reset: mutation.reset,
    };
};
