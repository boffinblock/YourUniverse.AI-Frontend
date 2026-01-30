/**
 * Folder API Endpoints
 * All folder-related API calls
 */
import { apiClient } from "../shared/client";
import { ApiResponse } from "../shared/types";
import type {
  CreateFolderRequest,
  CreateFolderResponse,
  UpdateFolderRequest,
  UpdateFolderResponse,
  GetFolderResponse,
  ListFoldersResponse,
  DeleteFolderResponse,
  ListFoldersParams,
} from "./types";

const BASE = "/api/v1/folders";

/**
 * List user folders
 */
export const listFolders = async (
  params?: ListFoldersParams
): Promise<ApiResponse<ListFoldersResponse>> => {
  const { data } = await apiClient.get<ApiResponse<ListFoldersResponse>>(BASE, {
    params: params as Record<string, unknown>,
    paramsSerializer: (p) => {
      const search = new URLSearchParams();
      Object.entries(p || {}).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") {
          search.append(k, String(v));
        }
      });
      return search.toString();
    },
  });
  return data;
};

/**
 * Get folder by ID
 */
export const getFolder = async (
  folderId: string,
  options?: { requireAuth?: boolean }
): Promise<ApiResponse<GetFolderResponse>> => {
  const { data } = await apiClient.get<ApiResponse<GetFolderResponse>>(`${BASE}/${folderId}`, {
    headers: options?.requireAuth !== false ? undefined : undefined,
  });
  return data;
};

/**
 * Create folder
 */
export const createFolder = async (
  body: CreateFolderRequest
): Promise<ApiResponse<CreateFolderResponse>> => {
  const { data } = await apiClient.post<ApiResponse<CreateFolderResponse>>(BASE, body);
  return data;
};

/**
 * Update folder (rename, description, color)
 */
export const updateFolder = async (
  folderId: string,
  body: UpdateFolderRequest
): Promise<ApiResponse<UpdateFolderResponse>> => {
  const { data } = await apiClient.put<ApiResponse<UpdateFolderResponse>>(`${BASE}/${folderId}`, body);
  return data;
};

/**
 * Delete folder
 */
export const deleteFolder = async (
  folderId: string
): Promise<ApiResponse<DeleteFolderResponse>> => {
  const { data } = await apiClient.delete<ApiResponse<DeleteFolderResponse>>(`${BASE}/${folderId}`);
  return data;
};
