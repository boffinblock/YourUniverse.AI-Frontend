/**
 * AI SDK Chat Transport
 * Uses prepareSendMessagesRequest to send only the last message.
 * Backend loads full history from DB - see [Message Persistence](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-message-persistence#sending-only-the-last-message).
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
    prepareSendMessagesRequest: ({ messages, trigger, messageId }) => {
      const isRegenerate = trigger === "regenerate-message";

      if (isRegenerate && messageId) {
        return {
          body: { trigger: "regenerate", messageId },
          headers: {
            Accept: "text/event-stream",
            ...authHeaders(),
          },
        };
      }

      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      const textPart = lastUser?.parts?.find(
        (p): p is { type: "text"; text: string } => p.type === "text"
      );
      const fileParts = (lastUser?.parts ?? []).filter(
        (p) => p.type === "file"
      ) as Array<{ type: "file"; url?: string; mediaType?: string; filename?: string }>;
      const content = textPart?.text?.trim() ?? "";
      const attachments = fileParts.map((p) => ({
        type: "file" as const,
        url: p.url ?? "",
        mediaType: p.mediaType,
        filename: p.filename,
      }));

      const body: Record<string, unknown> = {
        content,
        role: "user",
      };
      if (attachments.length > 0) {
        body.attachments = attachments;
      }

      return {
        body,
        headers: {
          Accept: "text/event-stream",
          ...authHeaders(),
        },
      };
    },
  });
}
