import { apiClient } from "../shared/client";
import type { ApiResponse } from "../shared/types";

export interface FeatureRequestPayload {
    title: string;
    priority: string;
    category: string;
    platform: string;
    operating_system?: string;
    description: string;
    additional_details?: string;
    requester_username?: string;
    requester_email?: string;
}

export const submitFeatureRequest = async (
    payload: FeatureRequestPayload | FormData
): Promise<ApiResponse<null>> => {
    const { data } = await apiClient.post<ApiResponse<null>>(
        "/api/v1/community/feature-request",
        payload
    );
    return data;
};
