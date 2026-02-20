/**
 * Model API Endpoints
 */

import { apiClient } from "../shared/client";
import type { ApiResponse } from "../shared/types";
import type { ListModelsParams, ListModelsResponse } from "./types";

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
