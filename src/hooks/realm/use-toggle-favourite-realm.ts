import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRealm } from "@/lib/api/realms/endpoints";
import { queryKeys } from "@/lib/api/shared/query-keys";
import { toast } from "sonner";

interface UseToggleFavouriteRealmProps {
    onSuccess?: (isFavourite: boolean) => void;
}

export const useToggleFavouriteRealm = (props?: UseToggleFavouriteRealmProps) => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: ({ id, isFavourite }: { id: string; isFavourite: boolean }) =>
            updateRealm(id, { isFavourite }),
        onSuccess: (response, variables) => {
            if (response.success) {
                const newStatus = variables.isFavourite;
                toast.success(newStatus ? "Added to Favourites" : "Removed from Favourites");
                queryClient.invalidateQueries({ queryKey: queryKeys.realms.all });
                props?.onSuccess?.(newStatus);
            } else {
                const errorMsg = typeof response.error === "string"
                    ? response.error
                    : response.error?.message || "Failed to update favourite status";
                toast.error(errorMsg);
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || "An unexpected error occurred");
        },
    });

    return {
        toggleFavourite: (id: string, currentStatus: boolean) => mutate({ id, isFavourite: !currentStatus }),
        isToggling: isPending,
    };
};
