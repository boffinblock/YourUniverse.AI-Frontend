/**
 * Chat API Types
 */

import type { ApiResponse, PaginationInfo } from "../shared/types";

export interface Chat {
  id: string;
  userId: string;
  characterId: string | null;
  realmId: string | null;
  folderId: string | null;
  modelId: string | null;
  title: string | null;
  createdAt: string;
  updatedAt: string;
  messageCount?: number;
}

// Get Chat (GET /api/v1/chats/:id)
export interface GetChatResponse {
  chat: Chat;
}

// Update Chat (PATCH /api/v1/chats/:id)
export interface UpdateChatRequest {
  title?: string | null;
  folderId?: string | null;
  modelId?: string | null;
}

export interface UpdateChatResponse {
  chat: Chat;
}

// Create Chat (POST /api/v1/chats)
export interface CreateChatRequest {
  characterId?: string | null;
  realmId?: string | null;
  folderId?: string | null;
  modelId?: string | null;
  title?: string | null;
}

export interface CreateChatResponse {
  chat: Chat;
}

// List Chats (GET /api/v1/chats)
export interface ListChatsParams {
  page?: number;
  limit?: number;
  characterId?: string;
  realmId?: string;
  folderId?: string;
  sortBy?: "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface ListChatsResponse {
  chats: Chat[];
  pagination: PaginationInfo;
}

// Send Message (POST /api/v1/chats/:id/messages)
export interface SendMessageRequest {
  content: string;
  role?: "user" | "assistant" | "system";
}

export interface ApiMessage {
  id: string;
  chatId: string;
  role: string;
  content: string;
  tokensUsed: number | null;
  metadata: unknown;
  createdAt: string;
}

export interface SendMessageResponse {
  userMessage: ApiMessage;
  assistantMessage: ApiMessage;
}

// List Messages (GET /api/v1/chats/:id/messages)
export interface ListMessagesParams {
  page?: number;
  limit?: number;
  role?: "user" | "assistant" | "system";
  sortBy?: "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface ListMessagesResponse {
  messages: ApiMessage[];
  pagination: PaginationInfo;
}
