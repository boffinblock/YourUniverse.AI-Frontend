/**
 * useGetModels Hook
 * GET /api/v1/models - List all models
 */
"use client";

import { useQuery } from "@tanstack/react-query";
import { listModels } from "@/lib/api/models";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { ListModelsParams } from "@/lib/api/models";

interface UseGetModelsOptions {
  params?: ListModelsParams;
  enabled?: boolean;
}

export const useGetModels = (options: UseGetModelsOptions = {}) => {
  const { params = { isActive: true }, enabled = true } = options;

  const query = useQuery({
    queryKey: queryKeys.models.list(params),
    queryFn: async () => {
      const response = await listModels(params);
      return response.data;
    },
    enabled,
  });

  const models = query.data?.models ?? [];
  const defaultModel = models.find((m) => m.isDefault) ?? models[0];

  return {
    ...query,
    models,
    defaultModel,
  };
};
