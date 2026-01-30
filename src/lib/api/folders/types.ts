/**
 * Folder API Types
 * Type definitions for folder-related endpoints
 */

import { ApiResponse, PaginationInfo } from "../shared/types";

/**
 * Folder
 */
export interface Folder {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  color: string | null;
  createdAt: string;
  updatedAt: string;
  chatCount?: number;
}

/**
 * Create Folder Request
 */
export interface CreateFolderRequest {
  name: string;
  description?: string | null;
  color?: string | null;
}

/**
 * Update Folder Request
 */
export interface UpdateFolderRequest {
  name?: string;
  description?: string | null;
  color?: string | null;
}

/**
 * Get Folder Response
 */
export interface GetFolderResponse {
  folder: Folder;
}

/**
 * List Folders Response
 */
export interface ListFoldersResponse {
  folders: Folder[];
  pagination: PaginationInfo;
}

/**
 * Create Folder Response
 */
export interface CreateFolderResponse {
  folder: Folder;
}

/**
 * Update Folder Response
 */
export interface UpdateFolderResponse {
  folder: Folder;
}

/**
 * Delete Folder Response
 */
export interface DeleteFolderResponse {
  message: string;
}

/**
 * List Folders Query Params
 */
export interface ListFoldersParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "name";
  sortOrder?: "asc" | "desc";
}
