/**
 * Lorebook API Types
 * Type definitions for lorebook-related endpoints
 */

import { ApiResponse } from "../shared/types";

/**
 * Lorebook Rating
 */
export type LorebookRating = "SFW" | "NSFW";

/**
 * Lorebook Visibility
 */
export type LorebookVisibility = "public" | "private";

/**
 * Lorebook Entry
 */
export interface LorebookEntry {
  id: string;
  lorebookId: string;
  keywords: string[];
  context: string;
  isEnabled: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create Lorebook Entry Input
 */
export interface CreateLorebookEntryInput {
  keywords: string[];
  context: string;
  isEnabled?: boolean;
  priority?: number;
}

/**
 * Update Lorebook Entry Input
 */
export interface UpdateLorebookEntryInput {
  keywords?: string[];
  context?: string;
  isEnabled?: boolean;
  priority?: number;
}

/**
 * Create Lorebook Request
 * Supports both File objects (for multipart/form-data) and strings (for JSON)
 */
export interface CreateLorebookRequest {
  name: string;
  description?: string;
  rating: LorebookRating;
  visibility: LorebookVisibility;
  tags?: string[];
  favourite?: boolean;
  avatar?: File | string;
  entries?: CreateLorebookEntryInput[];
  characterIds?: string[];
  personaIds?: string[];
}

/**
 * Update Lorebook Request
 * Supports both File objects (for multipart/form-data) and strings (for JSON)
 * All fields are optional for updates
 */
export interface UpdateLorebookRequest {
  name?: string;
  description?: string;
  rating?: LorebookRating;
  visibility?: LorebookVisibility;
  tags?: string[];
  favourite?: boolean;
  avatar?: File | string;
  entries?: CreateLorebookEntryInput[];
  characterIds?: string[];
  personaIds?: string[];
}

/**
 * Lorebook Image Asset
 */
export interface LorebookImage {
  url: string;
  width?: number;
  height?: number;
}

/**
 * Lorebook Response Data
 * Matches the API response structure
 */
export interface Lorebook {
  id: string;
  userId: string;
  name: string;
  slug: string;
  description?: string | null;
  rating: LorebookRating;
  visibility: LorebookVisibility;
  isFavourite: boolean;
  isSaved: boolean;
  avatar?: LorebookImage | null;
  tags: string[];
  entries?: LorebookEntry[];
  characters?: Array<{ id: string; name: string }>;
  personas?: Array<{ id: string; name: string }>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create Lorebook Response
 */
export interface CreateLorebookResponse {
  lorebook: Lorebook;
  message?: string;
}

/**
 * Update Lorebook Response
 */
export interface UpdateLorebookResponse {
  lorebook: Lorebook;
  message?: string;
}

/**
 * Get Lorebook Response
 */
export interface GetLorebookResponse {
  lorebook: Lorebook;
}

/**
 * Pagination Info
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * List Lorebooks Response
 */
export interface ListLorebooksResponse {
  lorebooks: Lorebook[];
  pagination: PaginationInfo;
}