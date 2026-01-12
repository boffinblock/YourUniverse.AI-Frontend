/**
 * Persona API Types
 * Type definitions for persona-related endpoints
 */

import { ApiResponse } from "../shared/types";

/**
 * Persona Rating
 */
export type PersonaRating = "SFW" | "NSFW";

/**
 * Persona Visibility
 */
export type PersonaVisibility = "public" | "private";

/**
 * Persona Image
 */
export interface PersonaImage {
  url: string;
  width?: number;
  height?: number;
}

/**
 * Persona
 */
export interface Persona {
  id: string;
  userId: string;
  name: string;
  slug: string;
  description?: string | null;
  visibility: PersonaVisibility;
  rating: PersonaRating;
  isFavourite: boolean;
  isSaved: boolean;
  avatar?: PersonaImage | null;
  backgroundImg?: PersonaImage | null;
  tags: string[];
  lorebookId?: string | null;
  createdAt: string;
  updatedAt: string;
  characters?: Array<{ id: string; name: string }>;
  lorebook?: { id: string; name: string } | null;
}

/**
 * Create Persona Request
 * Supports both File objects (for multipart/form-data) and strings (for JSON)
 */
export interface CreatePersonaRequest {
  name: string;
  description?: string;
  rating: PersonaRating;
  visibility: PersonaVisibility;
  tags?: string[];
  favourite?: boolean;
  avatar?: File | string;
  backgroundImg?: File | string;
  lorebookId?: string;
}

/**
 * Update Persona Request
 * Supports both File objects (for multipart/form-data) and strings (for JSON)
 * All fields are optional for updates
 */
export interface UpdatePersonaRequest {
  name?: string;
  description?: string;
  rating?: PersonaRating;
  visibility?: PersonaVisibility;
  tags?: string[];
  favourite?: boolean;
  avatar?: File | string;
  backgroundImg?: File | string;
  lorebookId?: string | null;
}

/**
 * Persona List Filters
 */
export interface PersonaListFilters {
  page?: number;
  limit?: number;
  search?: string;
  rating?: PersonaRating;
  visibility?: PersonaVisibility;
  tags?: string[];
  excludeTags?: string[];
  isFavourite?: boolean;
  isSaved?: boolean;
  sortBy?: "createdAt" | "updatedAt" | "name";
  sortOrder?: "asc" | "desc";
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
 * Create Persona Response
 */
export interface CreatePersonaResponse {
  persona: Persona;
}

/**
 * Update Persona Response
 */
export interface UpdatePersonaResponse {
  persona: Persona;
}

/**
 * Get Persona Response
 */
export interface GetPersonaResponse {
  persona: Persona;
}

/**
 * List Personas Response
 */
export interface ListPersonasResponse {
  personas: Persona[];
  pagination: PaginationInfo;
}

/**
 * Batch Delete Personas Response
 */
export interface BatchDeletePersonasResponse {
  deleted: number;
  failed: number;
  message: string;
}

/**
 * API Response Types
 */
export type CreatePersonaApiResponse = ApiResponse<CreatePersonaResponse>;
export type UpdatePersonaApiResponse = ApiResponse<UpdatePersonaResponse>;
export type GetPersonaApiResponse = ApiResponse<GetPersonaResponse>;
export type ListPersonasApiResponse = ApiResponse<ListPersonasResponse>;
export type BatchDeletePersonasApiResponse = ApiResponse<BatchDeletePersonasResponse>;
