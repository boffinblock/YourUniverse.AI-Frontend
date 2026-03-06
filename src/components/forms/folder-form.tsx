"use client"
import React, { useMemo } from "react";
import DynamicForm from "../elements/form-elements/dynamic-form";
import { FolderSchema } from "@/schemas/folder-schema";
import { useRouter } from "next/navigation";
import { useCreateRealm, useUpdateRealm, useGetRealm } from "@/hooks";

interface Props {
    realmId?: string;
}

const FolderForm: React.FC<Props> = ({ realmId }) => {
    const isEditMode = !!realmId;
    const router = useRouter();

    // Fetch realm data if editing
    const { realm, isLoading: isLoadingRealm } = useGetRealm(realmId, {
        enabled: isEditMode,
        showErrorToast: true,
    });

    // Create realm mutation
    const { createRealm, isLoading: isCreating, isSuccess: isCreateSuccess } = useCreateRealm({
        onSuccess: () => {
            router.push("/realms");
        },
        showToasts: true,
    });

    // Update realm mutation
    const { updateRealm, isLoading: isUpdating, isSuccess: isUpdateSuccess } = useUpdateRealm({
        realmId: realmId || "",
        onSuccess: () => {
            router.push("/realms");
        },
        showToasts: true,
    });

    const isLoading = isCreating || isUpdating || isLoadingRealm;
    const isSuccess = isCreateSuccess || isUpdateSuccess;

    /**
     * Map realm data to form initial values
     */
    const initialValues = useMemo(() => {
        if (!realm) return undefined;

        return {
            folderName: realm.name || "",
            description: realm.description || "",
            tags: realm.tags || [],
            rating: realm.rating || "SFW",
            characters: realm.characters?.map((char: any) => char.id) || [],
            favourite: realm.isFavourite || false,
        };
    }, [realm]);

    /**
     * Handle form submission
     */
    const handleSubmit = async (values: Record<string, any>) => {
        const mappedData = {
            name: values.folderName || "",
            description: values.description || "",
            tags: Array.isArray(values.tags) ? values.tags : [],
            rating: values.rating || "SFW",
            visibility: "private" as const, // Default to private
            characterIds: Array.isArray(values.characters) ? values.characters : [],
            isFavourite: Boolean(values.favourite),
        };

        if (isEditMode) {
            updateRealm(mappedData);
        } else {
            createRealm(mappedData);
        }
    };

    return (
        <div className="py-10 h-full">
            <DynamicForm
                key={realm?.id || "new"}
                schema={FolderSchema}
                onSubmit={handleSubmit}
                initialValues={initialValues}
                submitButtonText={
                    isLoading
                        ? (isEditMode ? "Updating Realm..." : "Creating Realm...")
                        : isSuccess
                            ? (isEditMode ? "Realm Updated!" : "Realm Created!")
                            : (isEditMode ? "Update Realm" : "Create Realm")
                }
                isSubmitting={isLoading}
                submitButtonDisabled={isLoading || isSuccess}
            />
        </div>
    );
};

export default FolderForm;
