"use client";

import { Actions, Action } from "@/components/ai-elements/actions";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
    ZoomableImageModal,
    ZoomableImageModalTrigger,
    ZoomableImageModalContent,
} from "./zoomable-image-modal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    Conversation,
    ConversationContent,
    ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Response } from "@/components/ai-elements/response";
import {
    RefreshCcwIcon,
    CopyIcon,
    Trash,
    Info,
    EllipsisVertical,
    Loader2,
    MessageSquare,
} from "lucide-react";
import { Fragment, useEffect, useMemo, useRef } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
    apiMessagesToChatMessages,
    uiMessagesToChatMessages,
    type ApiMessage,
    type UIMessageLike,
    type ChatMessage,
} from "@/lib/ai";

interface ChatMessagesProps {
    setActivePreview: (value: 'character' | 'persona' | null) => void;
    /** Messages from useChat (real-time streaming) - takes precedence when provided */
    messagesFromUseChat?: UIMessageLike[];
    /** When provided (and no messagesFromUseChat), show these messages from API */
    messagesFromApi?: ApiMessage[];
    /** Initial fetch of messages for this chat */
    isLoading?: boolean;
    /** User sent a message; waiting for or receiving AI response */
    isSending?: boolean;
    /** Whether AI is currently streaming (cursor on last assistant message) */
    isStreaming?: boolean;
    /** Error from useChat */
    error?: Error | null;
    /** Regenerate last message */
    onRegenerate?: () => void;
}

const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text).catch(console.error);
};

const CommonDropdownItems = {
    user: [
        { label: 'Edit' },
        { label: 'Impersonate' },
        { label: 'Persona Preview' },
    ],
    assistant: [
        { label: 'Edit' },
        { label: 'Continue' },
        { label: 'Impersonate' },
        { label: 'Author Notes' },
        { label: 'Character Notes' },
        { label: 'Character Preview' },
    ],
    more: [
        { label: 'Save chat' },
        { label: 'Exclude Message from Prompts' },
    ],
    assistantMore: [
        { label: 'Stop' },
        { label: 'Start new chat' },
        { label: 'Branch chat' },
        { label: 'Save chat' },
        { label: 'Exclude Message from Prompts' },
    ],
};

const CommonActions = ({ onCopy, onDelete }: { onCopy: () => void; onDelete: () => void }) => (
    <>
        <Action onClick={onCopy} label="copy">
            <CopyIcon className="size-3" />
        </Action>
        <Action onClick={onDelete} label="delete">
            <Trash className="size-3" />
        </Action>
    </>
);


const MoreDropdown = ({ items }: { items: { label: string }[] }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                type="button"
                size="icon"
                className="size-7 p-1.5 bg-primary/30 backdrop-blur-3xl rounded-lg"
            >
                <EllipsisVertical className="size-3" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
            {items.map((item, index) => (
                <DropdownMenuItem key={index}>
                    {item.label}
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
);



const ChatMessages: React.FC<ChatMessagesProps> = ({
    setActivePreview,
    messagesFromUseChat,
    messagesFromApi,
    isLoading,
    isSending = false,
    isStreaming = false,
    error,
    onRegenerate,
}) => {
    const messages = useMemo(() => {
        if (messagesFromUseChat !== undefined && messagesFromUseChat.length > 0) {
            return uiMessagesToChatMessages(messagesFromUseChat);
        }
        if (messagesFromApi !== undefined) {
            return apiMessagesToChatMessages(messagesFromApi);
        }
        return [];
    }, [messagesFromUseChat, messagesFromApi]);

    const { lastUserMsg, lastAssistantMsg } = useMemo(() => {
        const reversedMessages = [...messages].reverse();
        return {
            lastUserMsg: reversedMessages.find(m => m.role === "user"),
            lastAssistantMsg: reversedMessages.find(m => m.role === "assistant"),
        };
    }, [messages]);

    const renderMessageHeader = (message: ChatMessage) => {
        if (message.role !== "assistant") return null;

        return (
            <div className="flex items-center gap-2 mb-2">
                <ZoomableImageModal>
                    <ZoomableImageModalTrigger>
                        <Avatar className="cursor-pointer">
                            <AvatarImage src="https://github.com/shadcn.png" alt="Assistant" />
                            <AvatarFallback>AS</AvatarFallback>
                        </Avatar>
                    </ZoomableImageModalTrigger>
                    <ZoomableImageModalContent
                        imageUrl="https://avatars.githubusercontent.com/u/124599?v=4"
                        className="rounded-full"
                    />
                </ZoomableImageModal>
                <Label className="text-xs">Tony Stark</Label>
            </div>
        );
    };

    const renderUserActions = (message: ChatMessage, text: string) => {
        const isLastUserMessage = lastUserMsg?.id === message.id;
        return (
            <Actions className="float-end">
                <CommonActions
                    onCopy={() => handleCopyText(text)}
                    onDelete={() => handleCopyText(text)}
                />
                {isLastUserMessage && (
                    <>
                        {/* <InfoDropdown items={CommonDropdownItems.user} /> */}
                        <MoreDropdown items={CommonDropdownItems.more} />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    suppressHydrationWarning
                                    type="button"
                                    size={"icon"}
                                    className="size-7 p-1.5 bg-primary/30 ckdrop-blur-3xl rounded-lg"
                                >
                                    <Info className="size-3" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-56" align="start">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Impresonate</DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => setActivePreview('persona')}

                                >
                                    Persona Preview
                                </DropdownMenuItem>


                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                )}
            </Actions>
        );
    };

    const renderAssistantActions = (message: ChatMessage, text: string) => {
        const isLastAssistantMessage = lastAssistantMsg?.id === message.id;

        return (
            <Actions>
                <Action label="Retry" onClick={isLastAssistantMessage ? onRegenerate : undefined}>
                    <RefreshCcwIcon className="size-3" />
                </Action>
                <CommonActions
                    onCopy={() => handleCopyText(text)}
                    onDelete={() => handleCopyText(text)}
                />
                {isLastAssistantMessage && (
                    <>
                        {/* <InfoDropdown items={CommonDropdownItems.assistant} /> */}
                        <MoreDropdown items={CommonDropdownItems.assistantMore} />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    suppressHydrationWarning
                                    type="button"
                                    size={"icon"}
                                    className="size-7 p-1.5 bg-primary/30 ckdrop-blur-3xl rounded-lg"
                                >
                                    <Info className="size-3" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-56" align="start">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Continue</DropdownMenuItem>
                                <DropdownMenuItem>Impresonate</DropdownMenuItem>
                                <DropdownMenuItem>Author Notes</DropdownMenuItem>
                                <DropdownMenuItem>Character Notes</DropdownMenuItem>


                                <DropdownMenuItem
                                    onClick={() => setActivePreview('character')}
                                >
                                    Character Preview
                                </DropdownMenuItem>

                            </DropdownMenuContent>
                        </DropdownMenu>

                    </>
                )}

            </Actions>
        );
    };
    const bottomRef = useRef<HTMLDivElement | null>(null);

    // Auto-scroll when new messages arrive or content grows while streaming
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages.length, isStreaming, messages]);

    if (isLoading && (messagesFromApi || messagesFromUseChat) && messages.length === 0) {
        return (
            <Conversation className="flex flex-col flex-1 min-h-0 p-6 relative">
                <ConversationContent className="flex-1 flex flex-col items-center justify-center gap-3 text-white/70">
                    <Loader2 className="size-10 animate-spin" aria-hidden />
                    <p className="text-sm font-medium">Loading messages...</p>
                </ConversationContent>
            </Conversation>
        );
    }

    return (
        <Conversation className='flex flex-col flex-1 min-h-0 p-6 relative  '>

            <ConversationContent className='flex-1  ' >
                {messages.length === 0 && !isLoading && !isSending && !isStreaming && (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-white/60">
                        <MessageSquare className="size-12 opacity-50" aria-hidden />
                        <p className="text-sm font-medium">No messages yet</p>
                        <p className="text-xs">Send a message to start the conversation</p>
                    </div>
                )}
                {messages.map((message, index) => {
                    const isStreamingMessage = isStreaming && index === messages.length - 1 && message.role === "assistant";
                    const textParts = message.parts.filter((p): p is { type: "text"; text: string } => p.type === "text");
                    const displayText = textParts.map((p) => p.text).join("") || "";
                    return (
                        <Fragment key={message.id}>
                            {renderMessageHeader(message)}
                            {(textParts.length > 0 || (isStreamingMessage && message.role === "assistant")) && (
                                <>
                                    <Message from={message.role}>
                                        <MessageContent>
                                            <Response isStreaming={isStreamingMessage}>{displayText}</Response>
                                        </MessageContent>
                                    </Message>
                                    {!isStreamingMessage && (
                                        message.role === "user"
                                            ? renderUserActions(message, displayText)
                                            : renderAssistantActions(message, displayText)
                                    )}
                                </>
                            )}
                        </Fragment>
                    );
                })}

                {error && (
                    <Message from="assistant" >
                        <div className="flex items-center justify-between gap-3 p-3 mb-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-sm">
                            <span>Something went wrong. Please try again.</span>
                            {onRegenerate && (
                                <Button size="sm" variant="outline" onClick={onRegenerate} className="border-red-500/50 text-red-200 hover:bg-red-500/20">
                                    Retry
                                </Button>
                            )}
                        </div>
                    </Message>
                )}
                {/* Loader when sending or waiting for first token (no assistant message yet) */}
                {(isSending || isStreaming) && (messages.length === 0 || messages[messages.length - 1]?.role !== "assistant") && (
                    <>
                        <div className="flex items-center gap-2 mb-2">
                            <Avatar className="size-8">
                                <AvatarImage src="https://github.com/shadcn.png" alt="Assistant" />
                                <AvatarFallback>AS</AvatarFallback>
                            </Avatar>
                            <Label className="text-xs">Tony Stark</Label>
                        </div>
                        <Message from="assistant">
                            <MessageContent>
                                <div className="flex items-center gap-3 py-2">
                                    <Loader2 className="size-5 shrink-0 animate-spin text-white/80" aria-hidden />
                                    <span className="text-sm text-white/80">Thinking...</span>
                                </div>
                            </MessageContent>

                        </Message>
                    </>
                )}

                <div ref={bottomRef} />
            </ConversationContent>
            <ConversationScrollButton />
        </Conversation>
    );
};

export default ChatMessages;
