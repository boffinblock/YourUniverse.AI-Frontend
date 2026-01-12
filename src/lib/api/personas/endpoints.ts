/**
 * Persona API Endpoints
 * All persona-related API calls
 */
import { apiClient } from "../shared/client";
import { ApiResponse } from "../shared/types";
import type {
  CreatePersonaRequest,
  CreatePersonaResponse,
  UpdatePersonaRequest,
  UpdatePersonaResponse,
  GetPersonaResponse,
  ListPersonasResponse,
  PersonaListFilters,
  BatchDeletePersonasResponse,
} from "./types";
import { getAccessToken } from "@/lib/utils/token-storage";

/**
 * Create a new persona
 * Supports both multipart/form-data (for file uploads) and application/json
 */
export const createPersona = async (
  data: CreatePersonaRequest
): Promise<ApiResponse<CreatePersonaResponse>> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("No access token available");
  }

  // Check if we have file uploads (avatar or backgroundImg as File object)
  const hasFiles = data.avatar instanceof File || data.backgroundImg instanceof File;

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

    if (data.lorebookId) {
      formData.append("lorebookId", data.lorebookId);
    }

    // Handle file uploads
    if (data.avatar instanceof File) {
      formData.append("avatar", data.avatar);
    } else if (typeof data.avatar === "string") {
      formData.append("avatar", data.avatar);
    }

    if (data.backgroundImg instanceof File) {
      formData.append("backgroundImage", data.backgroundImg);
    } else if (typeof data.backgroundImg === "string") {
      formData.append("backgroundImage", data.backgroundImg);
    }

    const response = await apiClient.post<ApiResponse<CreatePersonaResponse>>(
      "/api/v1/personas",
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
      lorebookId: data.lorebookId,
    };

    // Only include avatar if it's a string (URL)
    if (typeof data.avatar === "string") {
      jsonData.avatar = data.avatar;
    }

    // Only include backgroundImg if it's a string (URL)
    if (typeof data.backgroundImg === "string") {
      jsonData.backgroundImg = data.backgroundImg;
    }

    const response = await apiClient.post<ApiResponse<CreatePersonaResponse>>(
      "/api/v1/personas",
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
 * Get a persona by ID
 * @param personaId - Persona UUID
 */
export const getPersona = async (
  personaId: string
): Promise<ApiResponse<GetPersonaResponse>> => {
  const accessToken = getAccessToken();

  const headers: Record<string, string> = {};

  // Add authorization header if token is available (optional for public personas)
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  // Validation: Persona ID must be a valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(personaId)) {
    throw new Error("Invalid persona ID format");
  }

  const response = await apiClient.get<ApiResponse<GetPersonaResponse>>(
    `/api/v1/personas/${personaId}`,
    {
      headers,
    }
  );

  return response.data;
};

/**
 * List personas with optional filters
 * @param filters - Optional filters for listing personas
 */
export const listPersonas = async (
  filters?: PersonaListFilters
): Promise<ApiResponse<ListPersonasResponse>> => {
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
  const url = `/api/v1/personas${queryString ? `?${queryString}` : ""}`;

  const response = await apiClient.get<ApiResponse<ListPersonasResponse>>(
    url,
    {
      headers,
    }
  );

  return response.data;
};

/**
 * Update a persona by ID
 * Supports both multipart/form-data (with files) and JSON (without files)
 * @param personaId - Persona UUID
 * @param data - Persona update data
 */
export const updatePersona = async (
  personaId: string,
  data: UpdatePersonaRequest
): Promise<ApiResponse<UpdatePersonaResponse>> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("No access token available");
  }

  // Validation: Persona ID must be a valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(personaId)) {
    throw new Error("Invalid persona ID format");
  }

  const hasFiles = data.avatar instanceof File || data.backgroundImg instanceof File;

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

    if (data.lorebookId !== undefined) {
      formData.append("lorebookId", data.lorebookId || "");
    }

    // Handle file uploads
    if (data.avatar instanceof File) {
      formData.append("avatar", data.avatar);
    } else if (typeof data.avatar === "string") {
      formData.append("avatar", data.avatar);
    }

    if (data.backgroundImg instanceof File) {
      formData.append("backgroundImage", data.backgroundImg);
    } else if (typeof data.backgroundImg === "string") {
      formData.append("backgroundImage", data.backgroundImg);
    }

    const response = await apiClient.put<ApiResponse<UpdatePersonaResponse>>(
      `/api/v1/personas/${personaId}`,
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
    if (data.lorebookId !== undefined) {
      jsonData.lorebookId = data.lorebookId;
    }

    // Only include avatar if it's a string (URL)
    if (typeof data.avatar === "string") {
      jsonData.avatar = data.avatar;
    }

    // Only include backgroundImg if it's a string (URL)
    if (typeof data.backgroundImg === "string") {
      jsonData.backgroundImg = data.backgroundImg;
    }

    const response = await apiClient.put<ApiResponse<UpdatePersonaResponse>>(
      `/api/v1/personas/${personaId}`,
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
 * Delete a persona by ID
 * @param personaId - Persona UUID
 */
export const deletePersona = async (
  personaId: string
): Promise<ApiResponse<{ message: string }>> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("No access token available");
  }

  // Validation: Persona ID must be a valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(personaId)) {
    throw new Error("Invalid persona ID format");
  }

  const response = await apiClient.delete<ApiResponse<{ message: string }>>(
    `/api/v1/personas/${personaId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

/**
 * Batch delete personas
 * @param personaIds - Array of persona UUIDs
 */
export const deletePersonasBatch = async (
  personaIds: string[]
): Promise<ApiResponse<BatchDeletePersonasResponse>> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const response = await apiClient.post<ApiResponse<BatchDeletePersonasResponse>>(
    "/api/v1/personas/batch-delete",
    { personaIds },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

/**
 * Toggle favourite status for a persona
 * @param personaId - Persona UUID
 */
export const togglePersonaFavourite = async (
  personaId: string
): Promise<ApiResponse<GetPersonaResponse>> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("No access token available");
  }

  // Validation: Persona ID must be a valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(personaId)) {
    throw new Error("Invalid persona ID format");
  }

  const response = await apiClient.patch<ApiResponse<GetPersonaResponse>>(
    `/api/v1/personas/${personaId}/favourite`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

/**
 * Toggle saved status for a persona
 * @param personaId - Persona UUID
 */
export const togglePersonaSaved = async (
  personaId: string
): Promise<ApiResponse<GetPersonaResponse>> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("No access token available");
  }

  // Validation: Persona ID must be a valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(personaId)) {
    throw new Error("Invalid persona ID format");
  }

  const response = await apiClient.patch<ApiResponse<GetPersonaResponse>>(
    `/api/v1/personas/${personaId}/saved`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
