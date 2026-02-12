/**
 * AI SDK Message Converters
 * Centralized conversion between API message format and AI SDK UIMessage format.
 * @see https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-message-persistence
 */

/** API message shape (from GET /chats/:id/messages) */
export type ApiMessage = {
  id: string;
  role: string;
  content: string;
};

/** UIMessage part from AI SDK useChat */
export type UIMessagePart = { type: "text"; text: string };

/** UIMessage shape from useChat (id, role, parts) */
export type UIMessageLike = {
  id: string;
  role: string;
  parts?: Array<{ type: string; text?: string }>;
};

/** Internal ChatMessage for display components */
export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  parts: UIMessagePart[];
};

/**
 * Convert API messages to AI SDK UIMessage format for useChat initial state
 */
export function apiMessagesToUIMessages(api: ApiMessage[]): UIMessageLike[] {
  return api.map((m) => ({
    id: m.id,
    role: m.role as "user" | "assistant" | "system",
    parts: [{ type: "text" as const, text: m.content }],
  }));
}

/**
 * Convert API messages to ChatMessage format for display
 */
export function apiMessagesToChatMessages(api: ApiMessage[]): ChatMessage[] {
  return api.map((m) => ({
    id: m.id,
    role: m.role as ChatMessage["role"],
    parts: [{ type: "text" as const, text: m.content }],
  }));
}

/**
 * Convert UIMessages from useChat to ChatMessage format for display
 */
export function uiMessagesToChatMessages(ui: UIMessageLike[]): ChatMessage[] {
  return ui.map((m) => ({
    id: m.id,
    role: m.role as ChatMessage["role"],
    parts: (m.parts ?? [])
      .filter(
        (p): p is UIMessagePart => p.type === "text" && typeof p.text === "string"
      )
      .map((p) => ({ type: "text" as const, text: p.text })),
  }));
}
