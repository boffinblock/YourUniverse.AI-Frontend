/**
 * AI SDK Integration
 * Production-grade AI chat utilities and message handling
 */

export {
  createChatTransport,
  createRealmChatTransport,
} from "./chat-transport";

export {
  apiMessagesToUIMessages,
  apiMessagesToChatMessages,
  uiMessagesToChatMessages,
  type ApiMessage,
  type UIMessageLike,
  type UIMessagePart,
  type UIMessagePartText,
  type UIMessagePartFile,
  type ChatMessage,
  type MessageBranchContent,
} from "./message-converters";
