/**
 * Model API Endpoints
 */

import { apiClient } from "../shared/client";
import type { ApiResponse } from "../shared/types";
import type {
  ListModelsParams,
  ListModelsResponse,
  GetModelResponse,
  UpdateModelParams,
  UpdateModelResponse,
} from "./types";

const BASE = "/api/v1/models";

/**
 * List all models
 * GET /api/v1/models
 */
export const listModels = async (
  params?: ListModelsParams
): Promise<ApiResponse<ListModelsResponse>> => {
  const { data } = await apiClient.get<ApiResponse<ListModelsResponse>>(BASE, {
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
 * Get a single model by id
 * GET /api/v1/models/:id
 */
export const getModel = async (
  id: string
): Promise<ApiResponse<GetModelResponse>> => {
  const { data } = await apiClient.get<ApiResponse<GetModelResponse>>(
    `${BASE}/${id}`
  );
  return data;
};

/**
 * Update a model (including config)
 * PATCH /api/v1/models/:id
 */
export const updateModel = async (
  id: string,
  params: UpdateModelParams
): Promise<ApiResponse<UpdateModelResponse>> => {
  const { data } = await apiClient.patch<ApiResponse<UpdateModelResponse>>(
    `${BASE}/${id}`,
    params
  );
  return data;
};
