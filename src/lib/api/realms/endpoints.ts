import { apiClient } from "../shared/client";
import { ApiResponse } from "../shared/types";
import {
    CreateRealmRequest,
    RealmResponse,
    ListRealmsResponse,
    DeleteRealmResponse,
    UpdateRealmRequest
} from "./types";
import { getAccessToken } from "@/lib/utils/token-storage";

const API_V1 = "/api/v1";

/**
 * List all realms for the current user
 */
export const listRealms = async (params?: any): Promise<ApiResponse<ListRealmsResponse>> => {
    const accessToken = getAccessToken();
    const response = await apiClient.get<ApiResponse<ListRealmsResponse>>(`${API_V1}/realms`, {
        params,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    });
    return response.data;
};

/**
 * Get a single realm by ID
 */
export const getRealm = async (id: string): Promise<ApiResponse<RealmResponse>> => {
    const accessToken = getAccessToken();
    const response = await apiClient.get<ApiResponse<RealmResponse>>(`${API_V1}/realms/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    });
    return response.data;
};

/**
 * Create a new realm
 * Supports multipart/form-data for image uploads
 */
export const createRealm = async (data: CreateRealmRequest): Promise<ApiResponse<RealmResponse>> => {
    const accessToken = getAccessToken();
    const formData = new FormData();

    // Add basic fields
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    formData.append("rating", data.rating);
    formData.append("visibility", data.visibility);

    // Add arrays as JSON strings (backend will parse them)
    if (data.tags) formData.append("tags", JSON.stringify(data.tags));
    if (data.characterIds) formData.append("characterIds", JSON.stringify(data.characterIds));

    // Add files
    if (data.avatar instanceof File) {
        formData.append("avatar", data.avatar);
    }

    const response = await apiClient.post<ApiResponse<RealmResponse>>(`${API_V1}/realms`, formData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

/**
 * Update an existing realm
 */
export const updateRealm = async (id: string, data: UpdateRealmRequest): Promise<ApiResponse<RealmResponse>> => {
    const accessToken = getAccessToken();
    const formData = new FormData();

    if (data.name) formData.append("name", data.name);
    if (data.description !== undefined) formData.append("description", data.description || "");
    if (data.rating) formData.append("rating", data.rating);
    if (data.visibility) formData.append("visibility", data.visibility);
    if (data.isFavourite !== undefined) formData.append("isFavourite", String(data.isFavourite));

    if (data.tags) formData.append("tags", JSON.stringify(data.tags));

    if (data.avatar instanceof File) {
        formData.append("avatar", data.avatar);
    } else if (typeof data.avatar === "string") {
        formData.append("avatar", data.avatar);
    }

    const response = await apiClient.patch<ApiResponse<RealmResponse>>(`${API_V1}/realms/${id}`, formData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

/**
 * Delete a realm
 */
export const deleteRealm = async (id: string): Promise<ApiResponse<DeleteRealmResponse>> => {
    const accessToken = getAccessToken();
    const response = await apiClient.delete<ApiResponse<DeleteRealmResponse>>(`${API_V1}/realms/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    });
    return response.data;
};
