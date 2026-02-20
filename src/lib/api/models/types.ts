/**
 * Model API Types
 */

import type { ApiResponse } from "../shared/types";

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
