/**
 * Model API Types
 */

import type { ApiResponse } from "../shared/types";

/** Model tuning config (max tokens, temperature, topP, penalties) */
export interface ModelConfig {
  maxTokens: number;
  temperature: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export interface Model {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  provider: "openai" | "gemini" | "aws" | "anthropic" | "local";
  modelName: string | null;
  isActive: boolean;
  isDefault: boolean;
  metadata: unknown | null;
  /** Parsed from metadata.config; present in API responses */
  config?: ModelConfig;
  createdAt: string;
  updatedAt: string;
}

// List Models (GET /api/v1/models)
export interface ListModelsParams {
  isActive?: boolean;
}

export interface ListModelsResponse {
  models: Model[];
}

export type ListModelsApiResponse = ApiResponse<ListModelsResponse>;

// Get Model (GET /api/v1/models/:id)
export interface GetModelResponse {
  model: Model;
}
export type GetModelApiResponse = ApiResponse<GetModelResponse>;

// Update Model (PATCH /api/v1/models/:id)
export interface UpdateModelParams {
  name?: string;
  description?: string | null;
  provider?: "openai" | "gemini" | "aws" | "anthropic" | "local";
  modelName?: string | null;
  isActive?: boolean;
  isDefault?: boolean;
  config?: ModelConfig;
}
export interface UpdateModelResponse {
  model: Model;
}
export type UpdateModelApiResponse = ApiResponse<UpdateModelResponse>;
