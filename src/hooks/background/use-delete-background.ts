import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBackground as deleteBackgroundApi } from "@/lib/api/backgrounds/endpoints";
import { queryKeys } from "@/lib/api/shared/query-keys";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/shared/types";

interface UseDeleteBackgroundOptions {
    onSuccess?: () => void;
    onError?: (error: ApiError) => void;
    showToasts?: boolean;
}

export const useDeleteBackground = (options: UseDeleteBackgroundOptions = {}) => {
    const {
        onSuccess: onSuccessCallback,
        onError: onErrorCallback,
        showToasts = true,
    } = options;

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (backgroundId: string) => deleteBackgroundApi(backgroundId),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.backgrounds.all });

            if (showToasts) {
                toast.success("Background Deleted", {
                    description: "Your background has been deleted successfully.",
                    duration: 5000,
                });
            }

            if (onSuccessCallback) {
                onSuccessCallback();
            }
        },

        onError: (error: ApiError) => {
            const errorMessage =
                error.message ||
                "Failed to delete background. Please try again.";

            if (showToasts) {
                toast.error("Deletion Failed", {
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
        deleteBackground: mutation.mutate,
        deleteBackgroundAsync: mutation.mutateAsync,
        status: mutation.status,
        isLoading: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error as ApiError | null,
        reset: mutation.reset,
    };
};
