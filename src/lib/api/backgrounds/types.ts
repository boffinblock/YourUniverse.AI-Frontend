/**
 * Background API Types
 * Type definitions for background-related endpoints
 */

import { ApiResponse, PaginationInfo } from "../shared/types";

/**
 * Background Rating
 */
export type BackgroundRating = "SFW" | "NSFW";

/**
 * Background Image Asset
 */
export interface BackgroundImage {
  url: string;
  width?: number;
  height?: number;
}

/**
 * Background Response Data
 * Matches the API response structure
 */
export interface Background {
  id: string;
  name?: string | null;
  description?: string | null;
  image: BackgroundImage;
  tags: string[];
  rating: BackgroundRating;
  isGlobalDefault: boolean;
  isShared: boolean;
  characterId?: string | null;
  personaId?: string | null;
  lorebookId?: string | null;
  realmId?: string | null;
  createdAt: string;
  updatedAt: string;
  userId?: string | null;
}

/**
 * List Backgrounds Filters
 */
export interface ListBackgroundsFilters {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
  excludeTags?: string[];
  rating?: BackgroundRating;
  linkedTo?: "character" | "persona" | "lorebook" | "realm";
  isGlobalDefault?: boolean;
  characterId?: string;
  personaId?: string;
  lorebookId?: string;
  realmId?: string;
  sort?: "date" | "name";
  order?: "asc" | "desc";
}

/**
 * List Backgrounds Response
 */
export interface ListBackgroundsResponse {
  backgrounds: Background[];
  pagination: PaginationInfo;
}

/**
 * Get Background Response
 */
export interface GetBackgroundResponse {
  background: Background;
}

/**
 * Create Background Request
 */
export interface CreateBackgroundRequest {
  image: File;
  name?: string;
  description?: string;
  tags?: string[];
  rating?: BackgroundRating;
}

/**
 * Update Background Request
 */
export interface UpdateBackgroundRequest {
  name?: string;
  description?: string;
  tags?: string[];
  rating?: BackgroundRating;
  characterId?: string | null;
  personaId?: string | null;
  lorebookId?: string | null;
  realmId?: string | null;
}

/**
 * Import Background Response
 */
export interface ImportBackgroundResponse {
  background: Background;
}

/**
 * Bulk Import Backgrounds Response
 */
export interface BulkImportBackgroundsResponse {
  imported: number;
  failed: number;
  backgrounds: Background[];
  errors: Array<{ index: number; error: string }>;
}
