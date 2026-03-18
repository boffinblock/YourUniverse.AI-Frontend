/**
 * Realm Chats API
 * Separate API for realm-scoped chats. Uses GET/POST under /api/v1/realms/:realmId/chats
 */

import { apiClient } from "../shared/client";
import type { ApiResponse } from "../shared/types";
import type { PaginationInfo } from "../shared/types";
import { getAccessToken } from "@/lib/utils/token-storage";

// Reuse chat shapes from chats module (same backend response)
import type {
  Chat,
  ApiMessage,
  ListMessagesParams,
  ListMessagesResponse,
} from "../chats/types";

export type { Chat as RealmChat, ApiMessage as RealmChatMessage, ListMessagesParams };

export interface RealmChatListResponse {
  chats: Chat[];
  pagination: PaginationInfo;
}

export interface RealmChatResponse {
  chat: Chat;
}

export interface CreateRealmChatRequest {
  title?: string | null;
}

export interface CreateRealmChatResponse {
  chat: Chat;
}

const API_V1 = "/api/v1";

function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * List chats for a realm
 * GET /api/v1/realms/:realmId/chats
 */
export async function listRealmChats(
  realmId: string,
  params?: { page?: number; limit?: number; sortBy?: "createdAt" | "updatedAt"; sortOrder?: "asc" | "desc" }
): Promise<ApiResponse<RealmChatListResponse>> {
  const searchParams = new URLSearchParams();
  if (params?.page !== undefined) searchParams.set("page", String(params.page));
  if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder ?? "desc");
  const query = searchParams.toString();
  const url = `${API_V1}/realms/${realmId}/chats${query ? `?${query}` : ""}`;
  const response = await apiClient.get<ApiResponse<RealmChatListResponse>>(url, {
    headers: authHeaders(),
  });
  return response.data;
}

/**
 * Create a new realm chat
 * POST /api/v1/realms/:realmId/chats
 */
export async function createRealmChat(
  realmId: string,
  body?: CreateRealmChatRequest
): Promise<ApiResponse<CreateRealmChatResponse>> {
  const response = await apiClient.post<ApiResponse<CreateRealmChatResponse>>(
    `${API_V1}/realms/${realmId}/chats`,
    body ?? {},
    {
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

/**
 * Get one realm chat
 * GET /api/v1/realms/:realmId/chats/:chatId
 */
export async function getRealmChat(
  realmId: string,
  chatId: string
): Promise<ApiResponse<RealmChatResponse>> {
  const response = await apiClient.get<ApiResponse<RealmChatResponse>>(
    `${API_V1}/realms/${realmId}/chats/${chatId}`,
    { headers: authHeaders() }
  );
  return response.data;
}

/**
 * List messages for a realm chat
 * GET /api/v1/realms/:realmId/chats/:chatId/messages
 */
export async function listRealmChatMessages(
  realmId: string,
  chatId: string,
  params?: ListMessagesParams
): Promise<ApiResponse<ListMessagesResponse>> {
  const searchParams = new URLSearchParams();
  if (params?.page !== undefined) searchParams.set("page", String(params.page));
  if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));
  if (params?.role) searchParams.set("role", params.role);
  if (params?.sortBy) searchParams.set("sortBy", params.sortBy ?? "createdAt");
  if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder ?? "asc");
  const query = searchParams.toString();
  const url = `${API_V1}/realms/${realmId}/chats/${chatId}/messages${query ? `?${query}` : ""}`;
  const response = await apiClient.get<ApiResponse<ListMessagesResponse>>(url, {
    headers: authHeaders(),
  });
  return response.data;
}

/**
 * Base URL for realm chat message stream (POST). Used by realm chat transport.
 */
export function getRealmChatMessagesApiUrl(realmId: string, chatId: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  return `${base}/api/v1/realms/${realmId}/chats/${chatId}/messages`;
}

/**
 * Regenerate an assistant message in a realm chat (streaming).
 * POST to realm chat messages with trigger + messageId.
 */
export async function regenerateRealmChatMessage(
  realmId: string,
  chatId: string,
  messageId: string
): Promise<void> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "text/event-stream",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const url = `${base}/api/v1/realms/${realmId}/chats/${chatId}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ trigger: "regenerate", messageId }),
  });

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
}
