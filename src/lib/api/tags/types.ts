/**
 * Tag API Types
 * Type definitions for tag-related endpoints
 */

import { ApiResponse } from "../shared/types";

/**
 * Tag Category
 */
export type TagCategory = "SFW" | "NSFW";

/**
 * Tag Response Data
 */
export interface Tag {
  id: string;
  name: string;
  category: TagCategory;
  description?: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * List Tags Response
 */
export interface ListTagsResponse {
  tags: Tag[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get Tag Response
 */
export interface GetTagResponse {
  tag: Tag;
}

/**
 * Create Tag Request
 */
export interface CreateTagRequest {
  name: string;
  category: TagCategory;
  description?: string;
}

/**
 * Create Tag Response
 */
export interface CreateTagResponse {
  tag: Tag;
}

/**
 * Update Tag Request
 */
export interface UpdateTagRequest {
  name?: string;
  category?: TagCategory;
  description?: string;
}

/**
 * Update Tag Response
 */
export interface UpdateTagResponse {
  tag: Tag;
}

/**
 * Delete Tag Response
 */
export interface DeleteTagResponse {
  message: string;
}

/**
 * Popular Tags Response
 */
export interface PopularTagsResponse {
  tags: Tag[];
}

