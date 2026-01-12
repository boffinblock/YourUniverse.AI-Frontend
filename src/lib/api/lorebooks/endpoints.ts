/**
 * Lorebook API Endpoints
 * All lorebook-related API calls
 */
import { apiClient } from "../shared/client";
import { ApiResponse } from "../shared/types";
import type {
  CreateLorebookRequest,
  CreateLorebookResponse,
  UpdateLorebookRequest,
  UpdateLorebookResponse,
  GetLorebookResponse,
  ListLorebooksResponse,
  Lorebook,
} from "./types";
import { getAccessToken } from "@/lib/utils/token-storage";

/**
 * Create a new lorebook
 * Supports both multipart/form-data (for file uploads) and application/json
 */
export const createLorebook = async (
  data: CreateLorebookRequest
): Promise<ApiResponse<CreateLorebookResponse>> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("No access token available");
  }

  // Check if we have file uploads (avatar as File object)
  const hasFiles = data.avatar instanceof File;

  if (hasFiles) {
    // Use FormData for multipart/form-data
    const formData = new FormData();

    // Add all form fields
    formData.append("name", data.name);

    if (data.description) {
      formData.append("description", data.description);
    }

    if (data.rating) {
      formData.append("rating", data.rating);
    }

    if (data.visibility) {
      formData.append("visibility", data.visibility);
    }

    if (data.tags && data.tags.length > 0) {
      formData.append("tags", data.tags.join(","));
    }

    if (data.favourite !== undefined) {
      formData.append("favourite", String(data.favourite));
    }

    if (data.entries && data.entries.length > 0) {
      formData.append("entries", JSON.stringify(data.entries));
    }

    // Handle characterIds
    if (data.characterIds && data.characterIds.length > 0) {
      formData.append("characterIds", JSON.stringify(data.characterIds));
    }

    // Handle personaIds
    if (data.personaIds && data.personaIds.length > 0) {
      formData.append("personaIds", JSON.stringify(data.personaIds));
    }

    // Handle file uploads
    if (data.avatar instanceof File) {
      formData.append("avatar", data.avatar);
    } else if (typeof data.avatar === "string") {
      formData.append("avatar", data.avatar);
    }

    const response = await apiClient.post<ApiResponse<CreateLorebookResponse>>(
      "/api/v1/lorebooks",
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // Don't set Content-Type - browser will set it with boundary for multipart/form-data
        },
      }
    );

    return response.data;
  } else {
    // Use JSON for backward compatibility (when no files are uploaded)
    const jsonData: any = {
      name: data.name,
      description: data.description,
      rating: data.rating,
      visibility: data.visibility,
      tags: data.tags,
      favourite: data.favourite,
      entries: data.entries,
      characterIds: data.characterIds,
      personaIds: data.personaIds,
    };

    // Only include avatar if it's a string (URL)
    if (typeof data.avatar === "string") {
      jsonData.avatar = data.avatar;
    }

    const response = await apiClient.post<ApiResponse<CreateLorebookResponse>>(
      "/api/v1/lorebooks",
      jsonData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  }
};

/**
 * Get a lorebook by ID
 * @param lorebookId - Lorebook UUID
 * @param options - Optional configuration
 */
export const getLorebook = async (
  lorebookId: string,
  options?: { requireAuth?: boolean }
): Promise<ApiResponse<GetLorebookResponse>> => {
  const accessToken = getAccessToken();

  if (options?.requireAuth && !accessToken) {
    throw new Error("Authentication required");
  }

  const headers: Record<string, string> = {};

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  // Validation: Lorebook ID must be a valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(lorebookId)) {
    throw new Error("Invalid lorebook ID format");
  }

  const response = await apiClient.get<ApiResponse<GetLorebookResponse>>(
    `/api/v1/lorebooks/${lorebookId}`,
    {
      headers,
    }
  );

  return response.data;
};

/**
 * Get a lorebook by slug
 * @param slug - Lorebook slug
 * @param options - Optional configuration
 */
export const getLorebookBySlug = async (
  slug: string,
  options?: { requireAuth?: boolean }
): Promise<ApiResponse<GetLorebookResponse>> => {
  const accessToken = getAccessToken();

  if (options?.requireAuth && !accessToken) {
    throw new Error("Authentication required");
  }

  const headers: Record<string, string> = {};

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await apiClient.get<ApiResponse<GetLorebookResponse>>(
    `/api/v1/lorebooks/slug/${slug}`,
    {
      headers,
    }
  );

  return response.data;
};

/**
 * List lorebooks with optional filters
 * Supports filtering, sorting, and pagination
 */
export const listLorebooks = async (
  filters?: {
    page?: number;
    limit?: number;
    search?: string;
    rating?: "SFW" | "NSFW";
    visibility?: "public" | "private";
    isFavourite?: boolean;
    isSaved?: boolean;
    tags?: string[];
    excludeTags?: string[];
    sortBy?: "createdAt" | "updatedAt" | "name";
    sortOrder?: "asc" | "desc";
  }
): Promise<ApiResponse<ListLorebooksResponse>> => {
  const accessToken = getAccessToken();

  const headers: Record<string, string> = {};

  // Add authorization header if token is available (optional for personalized results)
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  // Build query parameters
  const params = new URLSearchParams();

  if (filters?.page !== undefined) {
    params.append("page", String(filters.page));
  }
  if (filters?.limit !== undefined) {
    params.append("limit", String(filters.limit));
  }
  if (filters?.search) {
    params.append("search", filters.search);
  }
  if (filters?.rating) {
    params.append("rating", filters.rating);
  }
  if (filters?.visibility) {
    params.append("visibility", filters.visibility);
  }
  if (filters?.isFavourite !== undefined) {
    params.append("isFavourite", String(filters.isFavourite));
  }
  if (filters?.isSaved !== undefined) {
    params.append("isSaved", String(filters.isSaved));
  }
  if (filters?.tags && filters.tags.length > 0) {
    params.append("tags", filters.tags.join(","));
  }
  if (filters?.excludeTags && filters.excludeTags.length > 0) {
    params.append("excludeTags", filters.excludeTags.join(","));
  }
  if (filters?.sortBy) {
    params.append("sortBy", filters.sortBy);
  }
  if (filters?.sortOrder) {
    params.append("sortOrder", filters.sortOrder);
  }

  const queryString = params.toString();
  const url = `/api/v1/lorebooks${queryString ? `?${queryString}` : ""}`;

  const response = await apiClient.get<ApiResponse<ListLorebooksResponse>>(
    url,
    {
      headers,
    }
  );

  return response.data;
};

/**
 * Update a lorebook by ID
 * Supports both multipart/form-data (with files) and JSON (without files)
 * @param lorebookId - Lorebook UUID
 * @param data - Lorebook update data
 */
export const updateLorebook = async (
  lorebookId: string,
  data: UpdateLorebookRequest
): Promise<ApiResponse<UpdateLorebookResponse>> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("No access token available");
  }

  // Validation: Lorebook ID must be a valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(lorebookId)) {
    throw new Error("Invalid lorebook ID format");
  }

  const hasFiles = data.avatar instanceof File;

  if (hasFiles) {
    // Use FormData for multipart/form-data
    const formData = new FormData();

    // Add all form fields
    if (data.name) {
      formData.append("name", data.name);
    }

    if (data.description !== undefined) {
      formData.append("description", data.description || "");
    }

    if (data.rating) {
      formData.append("rating", data.rating);
    }

    if (data.visibility) {
      formData.append("visibility", data.visibility);
    }

    if (data.tags && data.tags.length > 0) {
      formData.append("tags", data.tags.join(","));
    }

    if (data.favourite !== undefined) {
      formData.append("favourite", String(data.favourite));
    }

    // Always send entries if provided (even if empty array) to allow clearing entries
    if (data.entries !== undefined) {
      formData.append("entries", JSON.stringify(data.entries));
    }

    // Handle characterIds
    if (data.characterIds !== undefined) {
      formData.append("characterIds", JSON.stringify(data.characterIds));
    }

    // Handle personaIds
    if (data.personaIds !== undefined) {
      formData.append("personaIds", JSON.stringify(data.personaIds));
    }

    // Handle file uploads
    if (data.avatar instanceof File) {
      formData.append("avatar", data.avatar);
    } else if (typeof data.avatar === "string") {
      formData.append("avatar", data.avatar);
    }

    const response = await apiClient.put<ApiResponse<UpdateLorebookResponse>>(
      `/api/v1/lorebooks/${lorebookId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // Don't set Content-Type - browser will set it with boundary for multipart/form-data
        },
      }
    );

    return response.data;
  } else {
    // Use JSON for backward compatibility (when no files are uploaded)
    const jsonData: any = {};

    if (data.name) {
      jsonData.name = data.name;
    }
    if (data.description !== undefined) {
      jsonData.description = data.description;
    }
    if (data.rating) {
      jsonData.rating = data.rating;
    }
    if (data.visibility) {
      jsonData.visibility = data.visibility;
    }
    if (data.tags) {
      jsonData.tags = data.tags;
    }
    if (data.favourite !== undefined) {
      jsonData.favourite = data.favourite;
    }
    // Always send entries if provided (even if empty array) to allow clearing entries
    if (data.entries !== undefined) {
      jsonData.entries = data.entries;
    }

    // Handle characterIds
    if (data.characterIds !== undefined) {
      jsonData.characterIds = data.characterIds;
    }

    // Handle personaIds
    if (data.personaIds !== undefined) {
      jsonData.personaIds = data.personaIds;
    }

    // Only include avatar if it's a string (URL)
    if (typeof data.avatar === "string") {
      jsonData.avatar = data.avatar;
    }

    const response = await apiClient.put<ApiResponse<UpdateLorebookResponse>>(
      `/api/v1/lorebooks/${lorebookId}`,
      jsonData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  }
};

/**
 * Delete a lorebook by ID
 * @param lorebookId - Lorebook UUID
 */
export const deleteLorebook = async (lorebookId: string): Promise<void> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("No access token available");
  }

  // Validation: Lorebook ID must be a valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(lorebookId)) {
    throw new Error("Invalid lorebook ID format");
  }

  try {
    await apiClient.delete(`/api/v1/lorebooks/${lorebookId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error: any) {
    // Handle API error responses
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.error?.code && errorData.error?.message) {
        throw new Error(`${errorData.error.code}: ${errorData.error.message}`);
      }
      if (errorData.error || errorData.message) {
        throw new Error(errorData.error || errorData.message);
      }
    }
    throw error;
  }
};

/**
 * Batch delete multiple lorebooks by IDs
 * Uses the backend batch-delete endpoint for optimal performance
 * Single API call instead of multiple sequential calls
 * 
 * @param lorebookIds - Array of lorebook UUIDs to delete (1-100 lorebooks)
 * @returns Promise with results
 * @throws Error if validation fails or API call fails
 */
export const deleteLorebooksBatch = async (
  lorebookIds: string[]
): Promise<{ success: number; failed: number; errors: Array<{ id: string; error: string }> }> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("No access token available");
  }

  // Validation: Minimum 1 lorebook ID required
  if (!lorebookIds || lorebookIds.length === 0) {
    throw new Error("Lorebook IDs array is required and cannot be empty");
  }

  // Validation: Maximum 100 lorebook IDs
  if (lorebookIds.length > 100) {
    throw new Error("Maximum 100 lorebook IDs allowed per batch delete request");
  }

  // Validation: All IDs must be valid UUIDs
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const invalidIds = lorebookIds.filter((id) => !uuidRegex.test(id));
  if (invalidIds.length > 0) {
    throw new Error(`Invalid lorebook ID format. Invalid IDs: ${invalidIds.slice(0, 5).join(", ")}${invalidIds.length > 5 ? "..." : ""}`);
  }

  try {
    // Call the backend batch-delete endpoint
    const response = await apiClient.post<ApiResponse<{ success: number; failed: number; errors: Array<{ id: string; error: string }>; message: string }>>(
      "/api/v1/lorebooks/batch-delete",
      {
        lorebookIds,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: response.data.data.success,
      failed: response.data.data.failed,
      errors: response.data.data.errors,
    };
  } catch (error: any) {
    // Handle API error responses
    if (error.response?.data) {
      const errorData = error.response.data;
      // Handle structured error response with code and message
      if (errorData.error?.code && errorData.error?.message) {
        throw new Error(`${errorData.error.code}: ${errorData.error.message}`);
      }
      // Handle simple error response
      if (errorData.error || errorData.message) {
        throw new Error(errorData.error || errorData.message);
      }
    }
    throw error;
  }
};

/**
 * Toggle favourite status of a lorebook
 * @param lorebookId - Lorebook UUID
 * @returns Promise with updated lorebook data
 */
export const toggleLorebookFavourite = async (
  lorebookId: string
): Promise<ApiResponse<{ lorebook: Lorebook; isFavourite: boolean }>> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("No access token available");
  }

  // Validation: Lorebook ID must be a valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(lorebookId)) {
    throw new Error("Invalid lorebook ID format");
  }

  try {
    const response = await apiClient.patch<ApiResponse<{ lorebook: Lorebook; isFavourite: boolean }>>(
      `/api/v1/lorebooks/${lorebookId}/favourite`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    // Handle API error responses
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.error?.code && errorData.error?.message) {
        throw new Error(`${errorData.error.code}: ${errorData.error.message}`);
      }
      if (errorData.error || errorData.message) {
        throw new Error(errorData.error || errorData.message);
      }
    }
    throw error;
  }
};

/**
 * Toggle saved status of a lorebook
 * @param lorebookId - Lorebook UUID
 * @returns Promise with updated lorebook data
 */
export const toggleLorebookSaved = async (
  lorebookId: string
): Promise<ApiResponse<{ lorebook: Lorebook; isSaved: boolean }>> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("No access token available");
  }

  // Validation: Lorebook ID must be a valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(lorebookId)) {
    throw new Error("Invalid lorebook ID format");
  }

  try {
    const response = await apiClient.patch<ApiResponse<{ lorebook: Lorebook; isSaved: boolean }>>(
      `/api/v1/lorebooks/${lorebookId}/saved`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    // Handle API error responses
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.error?.code && errorData.error?.message) {
        throw new Error(`${errorData.error.code}: ${errorData.error.message}`);
      }
      if (errorData.error || errorData.message) {
        throw new Error(errorData.error || errorData.message);
      }
    }
    throw error;
  }
};

