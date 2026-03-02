import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRealm } from "@/lib/api/realms/endpoints";
import { UpdateRealmRequest } from "@/lib/api/realms/types";
import { queryKeys } from "@/lib/api/shared/query-keys";
import { toast } from "sonner";

interface UseUpdateRealmProps {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const useUpdateRealm = (props?: UseUpdateRealmProps) => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateRealmRequest }) =>
            updateRealm(id, data),
        onSuccess: (response) => {
            if (response.success) {
                toast.success("Realm updated successfully");
                queryClient.invalidateQueries({ queryKey: queryKeys.realms.all });
                props?.onSuccess?.();
            } else {
                const errorMsg = typeof response.error === "string"
                    ? response.error
                    : response.error?.message || "Failed to update realm";
                toast.error(errorMsg);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || "An unexpected error occurred");
            props?.onError?.(error);
        },
    });

    return {
        updateRealm: mutate,
        isUpdating: isPending,
    };
};
