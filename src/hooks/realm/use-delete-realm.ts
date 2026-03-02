import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRealm } from "@/lib/api/realms/endpoints";
import { queryKeys } from "@/lib/api/shared/query-keys";
import { toast } from "sonner";

interface UseDeleteRealmProps {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const useDeleteRealm = (props?: UseDeleteRealmProps) => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: (id: string) => deleteRealm(id),
        onSuccess: (response) => {
            if (response.success) {
                toast.success("Realm deleted successfully");
                queryClient.invalidateQueries({ queryKey: queryKeys.realms.all });
                props?.onSuccess?.();
            } else {
                const errorMsg = typeof response.error === "string"
                    ? response.error
                    : response.error?.message || "Failed to delete realm";
                toast.error(errorMsg);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || "An unexpected error occurred");
            props?.onError?.(error);
        },
    });

    return {
        deleteRealm: mutate,
        isDeleting: isPending,
    };
};
