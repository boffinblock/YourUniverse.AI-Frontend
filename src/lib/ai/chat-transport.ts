/**
 * AI SDK Chat Transport
 * Simple live chat - sends only the current user message (no history).
 */

import { DefaultChatTransport } from "ai";
import { getAccessToken } from "@/lib/utils/token-storage";

const getApiBaseUrl = (): string =>
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function createChatTransport(chatId: string | undefined) {
  if (!chatId) return undefined;

  return new DefaultChatTransport({
    api: `${getApiBaseUrl()}/api/v1/chats/${chatId}/messages`,
    credentials: "include",
    headers: authHeaders,
    prepareSendMessagesRequest: ({ messages }) => {
      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      const textPart = lastUser?.parts?.find(
        (p): p is { type: "text"; text: string } => p.type === "text"
      );
      return {
        body: { content: textPart?.text ?? "", role: "user" },
        headers: {
          Accept: "text/event-stream",
          ...authHeaders(),
        },
      };
    },
  });
}
