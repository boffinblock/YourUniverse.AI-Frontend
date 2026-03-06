import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBackground } from "@/lib/api/backgrounds/endpoints";
import { UpdateBackgroundRequest, GetBackgroundResponse } from "@/lib/api/backgrounds/types";
import { queryKeys } from "@/lib/api/shared/query-keys";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/shared/types";

interface UseUpdateBackgroundOptions {
    onSuccess?: (data: GetBackgroundResponse) => void;
    onError?: (error: ApiError) => void;
    showToasts?: boolean;
}

export const useUpdateBackground = (backgroundId: string, options: UseUpdateBackgroundOptions = {}) => {
    const {
        onSuccess: onSuccessCallback,
        onError: onErrorCallback,
        showToasts = true,
    } = options;

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: UpdateBackgroundRequest) => updateBackground(backgroundId, data),

        onSuccess: (response) => {
            const { data } = response;

            queryClient.invalidateQueries({ queryKey: queryKeys.backgrounds.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.backgrounds.detail(backgroundId) });

            if (showToasts) {
                toast.success("Background Updated", {
                    description: "Your background has been updated successfully.",
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
                "Failed to update background. Please try again.";

            if (showToasts) {
                toast.error("Update Failed", {
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
        updateBackground: mutation.mutate,
        updateBackgroundAsync: mutation.mutateAsync,
        status: mutation.status,
        isLoading: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        data: mutation.data?.data,
        error: mutation.error as ApiError | null,
        reset: mutation.reset,
    };
};
