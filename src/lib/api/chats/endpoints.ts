/**
 * Chat API Endpoints
 * All chat-related API calls
 */
import { apiClient } from "../shared/client";
import type { ApiResponse } from "../shared/types";
import type {
  CreateChatRequest,
  CreateChatResponse,
  ListChatsParams,
  ListChatsResponse,
  ListMessagesParams,
  ListMessagesResponse,
} from "./types";
import { getAccessToken } from "@/lib/utils/token-storage";

/**
 * Create a new chat
 * POST /api/v1/chats
 */
export const createChat = async (
  data: CreateChatRequest
): Promise<ApiResponse<CreateChatResponse>> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const response = await apiClient.post<ApiResponse<CreateChatResponse>>(
    "/api/v1/chats",
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

/**
 * List chats with optional filters
 * GET /api/v1/chats
 */
export const listChats = async (
  params?: ListChatsParams
): Promise<ApiResponse<ListChatsResponse>> => {
  const accessToken = getAccessToken();
  const headers: Record<string, string> = {};
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const searchParams = new URLSearchParams();
  if (params?.page !== undefined) searchParams.set("page", String(params.page));
  if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params?.characterId) searchParams.set("characterId", params.characterId);
  if (params?.realmId) searchParams.set("realmId", params.realmId);
  if (params?.folderId) searchParams.set("folderId", params.folderId);
  if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const query = searchParams.toString();
  const url = `/api/v1/chats${query ? `?${query}` : ""}`;

  const response = await apiClient.get<ApiResponse<ListChatsResponse>>(url, {
    headers,
  });

  return response.data;
};

/**
 * Delete a chat by ID
 * DELETE /api/v1/chats/:id
 */
export const deleteChat = async (
  chatId: string
): Promise<ApiResponse<Record<string, never>>> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const response = await apiClient.delete<ApiResponse<Record<string, never>>>(
    `/api/v1/chats/${chatId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

/**
 * List messages for a chat
 * GET /api/v1/chats/:id/messages
 */
export const listMessages = async (
  chatId: string,
  params?: ListMessagesParams
): Promise<ApiResponse<ListMessagesResponse>> => {
  const accessToken = getAccessToken();
  const headers: Record<string, string> = {};
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const searchParams = new URLSearchParams();
  if (params?.page !== undefined) searchParams.set("page", String(params.page));
  if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params?.role) searchParams.set("role", params.role);
  if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder ?? "asc");

  const query = searchParams.toString();
  const url = `/api/v1/chats/${chatId}/messages${query ? `?${query}` : ""}`;

  const response = await apiClient.get<ApiResponse<ListMessagesResponse>>(
    url,
    { headers }
  );

  return response.data;
};
