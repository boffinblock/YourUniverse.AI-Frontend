import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkImportBackgrounds } from "@/lib/api/backgrounds/endpoints";
import { BulkImportBackgroundsResponse } from "@/lib/api/backgrounds/types";
import { queryKeys } from "@/lib/api/shared/query-keys";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/shared/types";

interface UseBulkImportBackgroundsOptions {
    onSuccess?: (data: BulkImportBackgroundsResponse) => void;
    onError?: (error: ApiError) => void;
    showToasts?: boolean;
}

export const useBulkImportBackgrounds = (options: UseBulkImportBackgroundsOptions = {}) => {
    const {
        onSuccess: onSuccessCallback,
        onError: onErrorCallback,
        showToasts = true,
    } = options;

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (files: File[]) => bulkImportBackgrounds(files),

        onSuccess: (response) => {
            const { data } = response;

            queryClient.invalidateQueries({ queryKey: queryKeys.backgrounds.all });

            if (showToasts) {
                toast.success("Bulk Import Complete", {
                    description: `Successfully imported ${data.imported} background(s).`,
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
                "Failed to bulk import backgrounds. Please try again.";

            if (showToasts) {
                toast.error("Import Failed", {
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
        bulkImportBackgrounds: mutation.mutate,
        bulkImportBackgroundsAsync: mutation.mutateAsync,
        status: mutation.status,
        isLoading: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        data: mutation.data?.data,
        error: mutation.error as ApiError | null,
        reset: mutation.reset,
    };
};
