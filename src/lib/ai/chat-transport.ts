/**
 * AI SDK Chat Transport
 * Production-grade transport for useChat with custom backend.
 * @see https://ai-sdk.dev/docs/ai-sdk-ui/transport
 *
 * Uses dynamic headers for fresh auth tokens and sends only the last user message
 * to the backend (backend loads full history from DB for context).
 */

import { DefaultChatTransport } from "ai";
import { getAccessToken } from "@/lib/utils/token-storage";

const getApiBaseUrl = (): string =>
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Create a DefaultChatTransport for a given chat.
 * Uses dynamic headers so auth token is always fresh (e.g. after refresh).
 *
 * @param chatId - Chat ID for the messages endpoint
 * @returns DefaultChatTransport or undefined if no chatId
 */
export function createChatTransport(chatId: string | undefined) {
  if (!chatId) return undefined;

  return new DefaultChatTransport({
    api: `${getApiBaseUrl()}/api/v1/chats/${chatId}/messages`,
    credentials: "include",

    // Dynamic headers - always use fresh token (critical for token refresh flows)
    headers: () => {
      const token = getAccessToken();
      return token ? { Authorization: `Bearer ${token}` } : undefined;
    },

    // Send only last user message for submit; trigger + messageId for regenerate
    // Backend loads full history from DB for context
    prepareSendMessagesRequest: ({ messages, trigger, messageId }) => {
      const token = getAccessToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      if (trigger === "regenerate-message") {
        return {
          body: { trigger: "regenerate", messageId },
          headers,
        };
      }

      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      const textPart = lastUser?.parts?.find(
        (p): p is { type: "text"; text: string } => p.type === "text"
      );

      return {
        body: {
          content: textPart?.text ?? "",
          role: "user",
        },
        headers,
      };
    },
  });
}
