"use client";

import {
    Attachment,
    AttachmentPreview,
    AttachmentRemove,
    Attachments,
} from "@/components/ai-elements/attachments";
import {
    Message,
    MessageAction,
    MessageActions,
    MessageBranch,
    MessageBranchContent,
    MessageBranchNext,
    MessageBranchPage,
    MessageBranchPrevious,
    MessageBranchSelector,
    MessageContent,
    MessageResponse,
    MessageToolbar,
} from "@/components/ai-elements/message";
import {
    Conversation,
    ConversationContent,
    ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
    ZoomableImageModal,
    ZoomableImageModalTrigger,
    ZoomableImageModalContent,
} from "./zoomable-image-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import {
    CopyIcon,
    EyeIcon,
    InfoIcon,
    MoreVerticalIcon,
    RotateCwIcon,
    SaveIcon,
    MessageSquarePlusIcon,
    GitBranchIcon,
    BanIcon,
} from "lucide-react";
import { Fragment, memo, useCallback, useMemo, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
    uiMessagesToChatMessages,
    type UIMessageLike,
    type UIMessagePart,
    type UIMessagePartFile,
} from "@/lib/ai";

interface ChatMessagesProps {
    setActivePreview?: (value: "character" | "persona" | null) => void;
    chatId?: string;
    messages?: UIMessageLike[];
    isSending?: boolean;
    isStreaming?: boolean;
    error?: Error | null;
    folderId?: string;
    onReload?: (messageId: string) => void;
    onStartNewChat?: () => void;
    onBranchChat?: (messageId: string) => void;
    onSaveChat?: () => void;
    onExcludeMessage?: (messageId: string) => void;
    onInfo?: (messageId: string, content: string) => void;
}

const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text).catch(console.error);
};

function isFilePart(p: UIMessagePart): p is UIMessagePartFile {
    return p.type === "file";
}


type BranchState = { branches: string[]; selectedIndex: number };

interface MessageMenuProps {
    messageId: string;
    content?: string;
    onStartNewChat?: () => void;
    onBranchChat?: (messageId: string) => void;
    onSaveChat?: () => void;
    onExcludeMessage?: (messageId: string) => void;
    onInfo?: (messageId: string, content: string) => void;
}

const MessageMenu = memo(({
    messageId,
    content,
    onStartNewChat,
    onBranchChat,
    onSaveChat,
    onExcludeMessage,
}: MessageMenuProps) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                size="icon-sm"
                variant="ghost"
                className="bg-primary/30 text-white size-7"
                aria-label="Message menu"
            >
                <MoreVerticalIcon className="size-3" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-primary/30 border-primary/50 text-white">
            <DropdownMenuItem
                className="cursor-pointer text-xs flex items-center gap-2 hover:bg-white/10"
                onClick={() => (onStartNewChat ? onStartNewChat() : toast.info("Start new chat"))}
            >
                <MessageSquarePlusIcon className="size-3.5" />
                Start new chat
            </DropdownMenuItem>
            <DropdownMenuItem
                className="cursor-pointer text-xs flex items-center gap-2 hover:bg-white/10"
                onClick={() => (onBranchChat ? onBranchChat(messageId) : toast.info("Branch chat"))}
            >
                <GitBranchIcon className="size-3.5" />
                Branch chat
            </DropdownMenuItem>
            <DropdownMenuItem
                className="cursor-pointer text-xs flex items-center gap-2 hover:bg-white/10"
                onClick={() => (onSaveChat ? onSaveChat() : toast.info("Save chat"))}
            >
                <SaveIcon className="size-3.5" />
                Save chat
            </DropdownMenuItem>
            <DropdownMenuItem
                className="cursor-pointer text-xs flex items-center gap-2 hover:bg-white/10"
                onClick={() => (onExcludeMessage ? onExcludeMessage(messageId) : toast.info("Exclude message from prompts"))}
            >
                <BanIcon className="size-3.5" />
                Exclude message from prompts
            </DropdownMenuItem>

        </DropdownMenuContent>
    </DropdownMenu>
));

MessageMenu.displayName = "MessageMenu";

const ChatMessages: React.FC<ChatMessagesProps> = ({
    setActivePreview,
    chatId,
    messages: messagesProp = [],
    isSending = false,
    isStreaming = false,
    error,
    folderId,
    onReload,
    onStartNewChat,
    onBranchChat,
    onSaveChat,
    onExcludeMessage,
    onInfo,
}) => {
    const [liked, setLiked] = useState<Record<string, boolean>>({});
    const [disliked, setDisliked] = useState<Record<string, boolean>>({});
    const [branchState, setBranchState] = useState<Record<string, BranchState>>({});

    const handleToggleLike = useCallback((id: string) => {
        setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
        setDisliked((prev) => ({ ...prev, [id]: false }));
    }, []);

    const handleToggleDislike = useCallback((id: string) => {
        setDisliked((prev) => ({ ...prev, [id]: !prev[id] }));
        setLiked((prev) => ({ ...prev, [id]: false }));
    }, []);

    const branchKey = useCallback(
        (messageIndex: number) => (chatId ? `${chatId}:${messageIndex}` : `local:${messageIndex}`),
        [chatId]
    );

    const handleBranchChange = useCallback((messageIndex: number, newIndex: number) => {
        const key = branchKey(messageIndex);
        setBranchState((prev) => {
            const existing = prev[key];
            if (!existing) return prev;
            return {
                ...prev,
                [key]: { ...existing, selectedIndex: newIndex },
            };
        });
    }, [branchKey]);

    const messages = useMemo(
        () => uiMessagesToChatMessages(messagesProp),
        [messagesProp]
    );

    const showThinkingSpinner =
        (isSending || isStreaming) &&
        (messages.length === 0 || messages[messages.length - 1]?.role !== "assistant");

    return (
        <Conversation className="flex flex-col flex-1 min-h-0 px-2 pb-0 relative overflow-hidden">
            <ConversationContent className="flex flex-col gap-4 pb-10">
                {messages.map((message, messageIndex) => {
                    const textParts = message.parts.filter((p) => p.type === "text");
                    const fileParts = message.parts.filter(isFilePart);
                    const combinedText = textParts.map((p) => (p as { type: "text"; text: string }).text).join("\n");
                    const isLastMessage = messageIndex === messages.length - 1;
                    const isLastAssistant = isLastMessage && message.role === "assistant";

                    const key = branchKey(messageIndex);
                    const saved = branchState[key];
                    const savedBranches = saved?.branches ?? [];
                    const allBranches = [...savedBranches, combinedText];
                    const isStreamingThisMessage = isLastAssistant && isStreaming;
                    const selectedIndex = isStreamingThisMessage
                        ? allBranches.length - 1
                        : Math.min(
                            saved?.selectedIndex ?? allBranches.length - 1,
                            allBranches.length - 1
                        );
                    const displayContent = allBranches[selectedIndex] ?? combinedText;

                    const renderAssistantContent = () => {
                        if (message.role !== "assistant") return null;
                        if (allBranches.length === 0) return null;
                        return (
                            <MessageBranch
                                key={`${message.id}-branch-${allBranches.length}`}
                                defaultBranch={selectedIndex}
                                onBranchChange={(idx) => handleBranchChange(messageIndex, idx)}
                            >
                                <MessageBranchContent>
                                    {allBranches.map((content, idx) => (
                                        <MessageContent key={idx}>
                                            <MessageResponse parseIncompleteMarkdown>
                                                {content}
                                            </MessageResponse>
                                        </MessageContent>
                                    ))}
                                </MessageBranchContent>
                                {isLastAssistant && (
                                    <MessageToolbar>
                                        <MessageBranchSelector from="assistant">
                                            <MessageBranchPrevious />
                                            <MessageBranchPage />
                                            <MessageBranchNext />
                                        </MessageBranchSelector>
                                        <MessageActions className="gap-1">
                                            <MessageAction
                                                label="Reload"
                                                tooltip="Regenerate response"
                                                onClick={() => (onReload ? onReload(message.id) : toast.info("Reload"))}
                                            >
                                                <RotateCwIcon className="size-3" />
                                            </MessageAction>
                                            <MessageAction label="Copy" tooltip="Copy to clipboard" >
                                                <CopyIcon className="size-3" />
                                            </MessageAction>
                                            <MessageMenu
                                                messageId={message.id}
                                                content={displayContent}
                                                onStartNewChat={onStartNewChat}
                                                onBranchChat={onBranchChat}
                                                onSaveChat={onSaveChat}
                                                onExcludeMessage={onExcludeMessage}
                                            />

                                            <MessageAction
                                            >
                                                <InfoIcon className="size-3" />
                                            </MessageAction>
                                        </MessageActions>
                                    </MessageToolbar>
                                )}
                            </MessageBranch>
                        );
                    };

                    return (
                        <Fragment key={message.id}>
                            <Message from={message.role as "user" | "assistant" | "system"} >
                                {message.role === "assistant" && (
                                    <div className="flex items-center gap-2 ">
                                        <ZoomableImageModal>
                                            <ZoomableImageModalTrigger>
                                                <Avatar className="cursor-pointer size-8">
                                                    <AvatarImage src="https://github.com/shadcn.png" alt="Assistant" />
                                                    <AvatarFallback>AS</AvatarFallback>
                                                </Avatar>
                                            </ZoomableImageModalTrigger>
                                            <ZoomableImageModalContent
                                                imageUrl="https://avatars.githubusercontent.com/u/124599?v=4"
                                                className="rounded-full"
                                            />
                                        </ZoomableImageModal>
                                        <Label className="text-xs text-muted-foreground">Assistant</Label>
                                    </div>
                                )}


                                {fileParts.length > 0 && (
                                    <div className="w-full flex  justify-end">
                                        <Attachments className="grid grid-cols-4 w-fit  " variant="grid">
                                            {fileParts.map((file, idx) => (
                                                <Attachment
                                                    key={`${message.id}-file-${idx}`}
                                                    data={{
                                                        id: `${message.id}-file-${idx}`,
                                                        type: "file",
                                                        url: file.url,
                                                        mediaType: file.mediaType ?? "application/octet-stream",
                                                        filename: file.filename,
                                                    }}

                                                >
                                                    <AttachmentPreview className=" " />
                                                    <AttachmentRemove />
                                                </Attachment>
                                            ))}
                                        </Attachments>
                                    </div>
                                )}
                                {message.role === "assistant" ? renderAssistantContent() : <MessageContent>{combinedText || null}</MessageContent>}
                            </Message>
                        </Fragment>
                    );
                })}
                {showThinkingSpinner && (
                    <Message from="assistant">
                        <div className="flex items-center gap-2 mb-1">
                            <Avatar className="size-8">
                                <AvatarImage src="https://github.com/shadcn.png" alt="Assistant" />
                                <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                            <span className="loader-thinking ml-4"></span>
                        </div>
                    </Message>
                )}
                {error && (
                    <Message from="assistant" >
                        <div className="flex flex-col gap-2 mb-1">
                            <div className="flex items-center gap-2">
                                <Avatar className="size-8 shrink-0">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="Assistant" />
                                    <AvatarFallback>AI</AvatarFallback>
                                </Avatar>
                                <Label className="text-xs text-muted-foreground">Assistant</Label>
                            </div>
                            <MessageContent className="rounded-lg w-fit !bg-destructive/20 border border-destructive/50 px-4 py-3 text-sm text-destructive flex-1">
                                Something went wrong. Please try again.
                            </MessageContent>
                        </div>
                    </Message>
                )}
            </ConversationContent>
            <ConversationScrollButton className="bottom-10 z-10" />
        </Conversation>
    );
};

export default ChatMessages;
