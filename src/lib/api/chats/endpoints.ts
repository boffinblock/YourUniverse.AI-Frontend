/**
 * Chat API Endpoints
 * All chat-related API calls
 */
import { apiClient } from "../shared/client";
import type { ApiResponse } from "../shared/types";
import type {
  CreateChatRequest,
  CreateChatResponse,
  GetChatResponse,
  ListChatsParams,
  ListChatsResponse,
  ListMessagesParams,
  ListMessagesResponse,
  UpdateChatRequest,
  UpdateChatResponse,
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
 * Get a chat by ID
 * GET /api/v1/chats/:id
 */
export const getChat = async (
  chatId: string,
  options?: { includeMessages?: boolean }
): Promise<ApiResponse<GetChatResponse>> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const params = new URLSearchParams();
  if (options?.includeMessages) {
    params.set("messages", "1");
  }
  const query = params.toString();
  const url = `/api/v1/chats/${chatId}${query ? `?${query}` : ""}`;

  const response = await apiClient.get<ApiResponse<GetChatResponse>>(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

/**
 * Update a chat
 * PATCH /api/v1/chats/:id
 */
export const updateChat = async (
  chatId: string,
  data: UpdateChatRequest
): Promise<ApiResponse<UpdateChatResponse>> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("No access token available");
  }

  const response = await apiClient.patch<ApiResponse<UpdateChatResponse>>(
    `/api/v1/chats/${chatId}`,
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

const getApiBaseUrl = (): string =>
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Regenerate an assistant message (streaming).
 * Bypasses AI SDK - makes direct fetch, consumes stream, returns when done.
 */
export const regenerateMessage = async (
  chatId: string,
  messageId: string
): Promise<void> => {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "text/event-stream",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(
    `${getApiBaseUrl()}/api/v1/chats/${chatId}/messages`,
    {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({ trigger: "regenerate", messageId }),
    }
  );

  if (!res.ok) {
    const errData = (await res.json().catch(() => ({}))) as {
      error?: { message?: string };
      message?: string;
    };
    const msg =
      errData?.error?.message ||
      errData?.message ||
      res.statusText ||
      "Regenerate failed";
    throw new Error(msg);
  }

  if (!res.body) throw new Error("No response body");
  const reader = res.body.getReader();
  try {
    while (true) {
      const { done } = await reader.read();
      if (done) break;
    }
  } finally {
    reader.releaseLock();
  }
};
