/**
 * Chat API Endpoints
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
  SendMessageRequest,
  SendMessageResponse,
} from "./types";

const BASE = "/api/v1/chats";

export async function createChat(
  body: CreateChatRequest
): Promise<ApiResponse<CreateChatResponse>> {
  const { data } = await apiClient.post<ApiResponse<CreateChatResponse>>(BASE, body);
  return data;
}

export async function listChats(
  params?: ListChatsParams
): Promise<ApiResponse<ListChatsResponse>> {
  const { data } = await apiClient.get<ApiResponse<ListChatsResponse>>(BASE, {
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
}

export async function deleteChat(id: string): Promise<ApiResponse<{ message: string }>> {
  const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(`${BASE}/${id}`);
  return data;
}

export async function sendMessage(
  chatId: string,
  body: SendMessageRequest
): Promise<ApiResponse<SendMessageResponse>> {
  const { data } = await apiClient.post<ApiResponse<SendMessageResponse>>(
    `${BASE}/${chatId}/messages`,
    body
  );
  return data;
}

/**
 * Stream message to LLM using Server-Sent Events (SSE)
 * @param chatId - Chat ID
 * @param body - Message request body
 * @param callbacks - Callbacks for chunks, done, and errors
 * @param abortSignal - AbortSignal to cancel the stream
 */
export async function streamMessage(
  chatId: string,
  body: SendMessageRequest,
  callbacks: {
    onChunk: (content: string) => void;
    onDone: (messageId?: string, usage?: { totalTokens: number }) => void;
    onError: (error: Error) => void;
  },
  abortSignal?: AbortSignal
): Promise<void> {
  const baseURL = apiClient.defaults.baseURL || "http://localhost:8000";
  const url = `${baseURL}${BASE}/${chatId}/messages?stream=true`;

  // Get access token for auth
  const { getAccessToken } = await import("@/lib/utils/token-storage");
  const accessToken = getAccessToken();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify(body),
      signal: abortSignal,
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      // Try to parse JSON error response (rate limiter sends JSON, not SSE)
      try {
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          const errorData = await response.json();
          // Handle API error response format: { success: false, error: { message, code } }
          if (errorData.error) {
            errorMessage = errorData.error.message || errorData.error.code || errorMessage;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        }
      } catch {
        // If parsing fails, use status-based message
      }

      // Provide user-friendly messages for common status codes
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        const resetIn = retryAfter ? ` Please try again in ${retryAfter} seconds.` : "";
        errorMessage = `Rate limit exceeded. Too many requests.${resetIn}`;
      } else if (response.status === 401) {
        errorMessage = "Authentication required. Please log in again.";
      } else if (response.status === 403) {
        errorMessage = "You don't have permission to perform this action.";
      } else if (response.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }

      throw new Error(errorMessage);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("No response body reader available");
    }

    let buffer = "";

    while (true) {
      // Check if aborted
      if (abortSignal?.aborted) {
        reader.cancel();
        throw new Error("Stream cancelled");
      }

      const { done, value } = await reader.read();

      if (done) {
        // Process any remaining buffer
        if (buffer.trim()) {
          const lines = buffer.split("\n\n");
          for (const line of lines) {
            if (line.trim() && line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === "content" && data.content) {
                  callbacks.onChunk(data.content);
                } else if (data.type === "done") {
                  callbacks.onDone(data.messageId, data.usage);
                  return;
                } else if (data.type === "error") {
                  throw new Error(data.error || "Streaming error");
                }
              } catch (parseError) {
                console.error("Failed to parse SSE data:", parseError);
              }
            }
          }
        }
        break;
      }

      // Decode chunk immediately
      buffer += decoder.decode(value, { stream: true });

      // Process ALL complete SSE messages immediately (separated by \n\n)
      // This ensures we don't wait for multiple chunks before processing
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || ""; // Keep incomplete message in buffer

      // Process each complete SSE message as soon as it arrives
      for (const part of parts) {
        if (!part.trim()) continue;

        // Skip comment lines (": connected", ": ping")
        if (part.startsWith(":")) {
          continue;
        }

        // Parse SSE data line
        if (part.startsWith("data: ")) {
          // Handle explicit [DONE] marker (non-JSON)
          if (part.trim() === "data: [DONE]") {
            callbacks.onDone();
            return;
          }

          try {
            const jsonStr = part.slice(6); // Remove "data: " prefix
            const data = JSON.parse(jsonStr);

            // Process content tokens immediately
            if (data.type === "content" && data.content) {
              callbacks.onChunk(data.content);
            } else if (data.type === "done") {
              callbacks.onDone(data.messageId, data.usage);
              return;
            } else if (data.type === "error") {
              throw new Error(data.error || "Streaming error");
            }
          } catch (parseError) {
            // Log but don't break - continue processing other messages
            console.error("Failed to parse SSE data:", parseError, "Part:", part);
          }
        }
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      callbacks.onError(new Error("Stream cancelled"));
    } else {
      callbacks.onError(error instanceof Error ? error : new Error(String(error)));
    }
  }
}

export async function listMessages(
  chatId: string,
  params?: ListMessagesParams
): Promise<ApiResponse<ListMessagesResponse>> {
  const { data } = await apiClient.get<ApiResponse<ListMessagesResponse>>(
    `${BASE}/${chatId}/messages`,
    {
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
    }
  );
  return data;
}
