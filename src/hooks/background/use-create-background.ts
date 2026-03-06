import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBackground } from "@/lib/api/backgrounds/endpoints";
import { CreateBackgroundRequest, Background } from "@/lib/api/backgrounds/types";
import { queryKeys } from "@/lib/api/shared/query-keys";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/shared/types";

interface UseCreateBackgroundOptions {
    onSuccess?: (data: { background: Background }) => void;
    onError?: (error: ApiError) => void;
    showToasts?: boolean;
}

export const useCreateBackground = (options: UseCreateBackgroundOptions = {}) => {
    const {
        onSuccess: onSuccessCallback,
        onError: onErrorCallback,
        showToasts = true,
    } = options;

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: CreateBackgroundRequest) => createBackground(data),

        onSuccess: (response) => {
            const { data } = response;

            queryClient.invalidateQueries({ queryKey: queryKeys.backgrounds.all });

            if (showToasts) {
                toast.success("Background Created", {
                    description: "Your background has been uploaded successfully.",
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
                "Failed to create background. Please try again.";

            if (showToasts) {
                toast.error("Upload Failed", {
                    description: errorMessage,
                    duration: 5000,
                });
            }

            if (onErrorCallback) {
                onErrorCallback(error);
            }
        },
    });

    return {
        createBackground: mutation.mutate,
        createBackgroundAsync: mutation.mutateAsync,
        status: mutation.status,
        isLoading: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        data: mutation.data?.data,
        error: mutation.error as ApiError | null,
        reset: mutation.reset,
    };
};
