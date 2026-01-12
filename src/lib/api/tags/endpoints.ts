/**
 * Tag API Endpoints
 * All tag-related API calls
 */
import { apiClient } from "../shared/client";
import { ApiResponse } from "../shared/types";
import type {
  CreateTagRequest,
  CreateTagResponse,
  GetTagResponse,
  ListTagsResponse,
  UpdateTagRequest,
  UpdateTagResponse,
  DeleteTagResponse,
  PopularTagsResponse,
} from "./types";
import { getAccessToken } from "@/lib/utils/token-storage";

/**
 * List tags with optional filters
 * Supports filtering, sorting, and pagination
 */
export const listTags = async (
  filters?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: "SFW" | "NSFW";
    sortBy?: "name" | "usageCount" | "createdAt";
    sortOrder?: "asc" | "desc";
  }
): Promise<ApiResponse<ListTagsResponse>> => {
  const accessToken = getAccessToken();

  const headers: Record<string, string> = {};

  // Add authorization header if token is available (optional for public tags)
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
  if (filters?.category) {
    params.append("category", filters.category);
  }
  if (filters?.sortBy) {
    params.append("sortBy", filters.sortBy);
  }
  if (filters?.sortOrder) {
    params.append("sortOrder", filters.sortOrder);
  }

  const queryString = params.toString();
  const url = `/api/v1/tags${queryString ? `?${queryString}` : ""}`;

  const response = await apiClient.get<ApiResponse<ListTagsResponse>>(url, {
    headers,
  });

  return response.data;
};

/**
 * Get a tag by ID
 */
export const getTag = async (
  id: string
): Promise<ApiResponse<GetTagResponse>> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const response = await apiClient.get<ApiResponse<GetTagResponse>>(
    `/api/v1/tags/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

/**
 * Create a new tag
 */
export const createTag = async (
  data: CreateTagRequest
): Promise<ApiResponse<CreateTagResponse>> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const response = await apiClient.post<ApiResponse<CreateTagResponse>>(
    "/api/v1/tags",
    data,
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
 * Update a tag by ID
 */
export const updateTag = async (
  id: string,
  data: UpdateTagRequest
): Promise<ApiResponse<UpdateTagResponse>> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const response = await apiClient.put<ApiResponse<UpdateTagResponse>>(
    `/api/v1/tags/${id}`,
    data,
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
 * Delete a tag by ID
 */
export const deleteTag = async (
  id: string
): Promise<ApiResponse<DeleteTagResponse>> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const response = await apiClient.delete<ApiResponse<DeleteTagResponse>>(
    `/api/v1/tags/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

/**
 * Get popular tags
 */
export const getPopularTags = async (
  options?: {
    limit?: number;
    category?: "SFW" | "NSFW";
  }
): Promise<ApiResponse<PopularTagsResponse>> => {
  const accessToken = getAccessToken();

  const headers: Record<string, string> = {};

  // Add authorization header if token is available (optional for public tags)
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  // Build query parameters
  const params = new URLSearchParams();

  if (options?.limit !== undefined) {
    params.append("limit", String(options.limit));
  }
  if (options?.category) {
    params.append("category", options.category);
  }

  const queryString = params.toString();
  const url = `/api/v1/tags/popular${queryString ? `?${queryString}` : ""}`;

  const response = await apiClient.get<ApiResponse<PopularTagsResponse>>(
    url,
    {
      headers,
    }
  );

  return response.data;
};

