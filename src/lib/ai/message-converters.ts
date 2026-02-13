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

/** UIMessage part from AI SDK useChat - text */
export type UIMessagePartText = { type: "text"; text: string };

/** UIMessage part - file */
export type UIMessagePartFile = {
  type: "file";
  url: string;
  mediaType?: string;
  filename?: string;
};

/** UIMessage part (text or file) */
export type UIMessagePart = UIMessagePartText | UIMessagePartFile;

/** UIMessage shape from useChat (id, role, parts) */
export type UIMessageLike = {
  id: string;
  role: string;
  parts?: Array<{ type: string; text?: string; url?: string; mediaType?: string; filename?: string }>;
};

/** Single branch content (for assistant message variants) */
export type MessageBranchContent = {
  id: string;
  parts: UIMessagePart[];
};

/** Internal ChatMessage for display components */
export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  parts: UIMessagePart[];
  /** For assistant messages: multiple regeneration variants. Undefined = single branch. */
  branches?: MessageBranchContent[];
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

/** Check if part is valid file part */
function isFilePart(
  p: UIMessageLike["parts"][number]
): p is UIMessagePartFile {
  return p.type === "file" && typeof p.url === "string";
}

/** Check if part is valid text part */
function isTextPart(
  p: UIMessageLike["parts"][number]
): p is UIMessagePartText {
  return p.type === "text" && typeof p.text === "string";
}

/**
 * Convert UIMessages from useChat to ChatMessage format for display
 */
export function uiMessagesToChatMessages(ui: UIMessageLike[]): ChatMessage[] {
  return ui.map((m) => ({
    id: m.id,
    role: m.role as ChatMessage["role"],
    parts: (m.parts ?? [])
      .filter((p): p is UIMessagePart => isTextPart(p) || isFilePart(p))
      .map((p) =>
        isTextPart(p)
          ? { type: "text" as const, text: p.text }
          : {
              type: "file" as const,
              url: p.url,
              mediaType: p.mediaType,
              filename: p.filename,
            }
      ),
  }));
}
