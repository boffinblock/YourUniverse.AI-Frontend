"use client"
import React from "react";
import DynamicForm from "../elements/form-elements/dynamic-form";
import { FeatureSchema } from "@/schemas/feature-schema";
import { useSubmitFeature } from "@/hooks/community/use-submit-feature";
import { FeatureRequestPayload } from "@/lib/api/community/endpoints";

import { useCurrentUser } from "@/hooks/user/use-current-user";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
    characterId?: string;
}

const FeatureForm: React.FC<Props> = () => {
    const { user, isLoading } = useCurrentUser();
    const { submitFeatureAsync, isSubmitting } = useSubmitFeature();

    const handleSubmit = async (values: any) => {
        try {
            const formData = new FormData();

            Object.keys(values).forEach(key => {
                if (key === 'attachments' && Array.isArray(values[key])) {
                    // Append each selected file as 'attachments'
                    values[key].forEach((file: File) => {
                        formData.append('attachments', file);
                    });
                } else if (values[key] !== undefined && values[key] !== null) {
                    formData.append(key, values[key]);
                }
            });

            await submitFeatureAsync(formData as unknown as FeatureRequestPayload);
        } catch (error) {
            console.error("Failed to submit feature request", error);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-10 w-32 ml-auto" />
            </div>
        );
    }

    return (
        <div className="w-full h-full space-y-6">
            <DynamicForm
                schema={FeatureSchema}
                initialValues={user ? {
                    requester_username: user.username,
                    requester_email: user.email
                } : undefined}
                submitButtonText={isSubmitting ? "Saving..." : "Save"}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default FeatureForm;
