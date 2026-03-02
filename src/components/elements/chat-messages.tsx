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
    CalendarIcon,
    UserIcon,
    FileTextIcon,
    StickyNoteIcon,
    UserCircleIcon,
    PencilIcon,
    Trash2Icon,
    XIcon,
} from "lucide-react";
import { Fragment, memo, useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    uiMessagesToChatMessages,
    type UIMessageLike,
    type UIMessagePart,
    type UIMessagePartFile,
} from "@/lib/ai";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface ChatMessagesProps {
    setActivePreview?: (value: "character" | "persona" | null) => void;
    chatId?: string;
    messages?: UIMessageLike[];
    apiMessages?: Array<{ id: string; role: string; content: string; metadata?: { versions?: string[] } }>;
    isSending?: boolean;
    isStreaming?: boolean;
    error?: Error | null;
    folderId?: string;
    onReload?: (messageId: string) => void;
    onStartNewChat?: () => void;
    onStartWorkOnToday?: (messageId: string, content?: string) => void;
    onBranchChat?: (messageId: string) => void;
    onSaveChat?: () => void;
    onExcludeMessage?: (messageId: string) => void;
    onInfo?: (messageId: string, content: string) => void;
    onDeleteMessage?: (messageId: string) => void;
    authorNotes?: string | null;
    characterNotes?: string | null;
}

function isFilePart(p: UIMessagePart): p is UIMessagePartFile {
    return p.type === "file";
}


type BranchState = { branches: string[]; selectedIndex: number };

interface MessageMenuProps {
    messageId: string;
    content?: string;
    onStartNewChat?: () => void;
    onStartWorkOnToday?: (messageId: string, content?: string) => void;
    onBranchChat?: (messageId: string) => void;
    onSaveChat?: () => void;
    onExcludeMessage?: (messageId: string) => void;
    onInfo?: (messageId: string, content: string) => void;
}

const MessageMenu = memo(({
    messageId,
    content,
    onStartNewChat,
    onStartWorkOnToday,
    onBranchChat,
    onSaveChat,
    onExcludeMessage,
}: MessageMenuProps) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <MessageAction
                aria-label="Message menu"
                tooltip="Message Menu"
            >
                <MoreVerticalIcon className="size-3" />
            </MessageAction>
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
                onClick={() => (onStartWorkOnToday ? onStartWorkOnToday(messageId, content) : toast.info("Start a work on today"))}
            >
                <CalendarIcon className="size-3.5" />
                Start a work on today
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

interface UserMessageMenuProps {
    messageId: string;
    onSaveChat?: () => void;
    onExcludeMessage?: (messageId: string) => void;
}

const UserMessageMenu = memo(({ messageId, onSaveChat, onExcludeMessage }: UserMessageMenuProps) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <MessageAction aria-label="Menu" tooltip="Menu">
                <MoreVerticalIcon className="size-3" />
            </MessageAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-primary/30 border-primary/50 text-white">
            <DropdownMenuItem
                className="cursor-pointer text-xs flex items-center gap-2 hover:bg-white/10"
                onClick={() => (onSaveChat ? onSaveChat() : toast.info("Save chat"))}
            >
                <SaveIcon className="size-3.5" />
                Save Chat
            </DropdownMenuItem>
            <DropdownMenuItem
                className="cursor-pointer text-xs flex items-center gap-2 hover:bg-white/10"
                onClick={() => (onExcludeMessage ? onExcludeMessage(messageId) : toast.info("Exclude message from prompts"))}
            >
                <BanIcon className="size-3.5" />
                Exclude Message from Prompts
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
));

UserMessageMenu.displayName = "UserMessageMenu";

interface UserMessageInfoProps {
    setActivePreview?: (value: "character" | "persona" | null) => void;
}

const UserMessageInfo = memo(({ setActivePreview }: UserMessageInfoProps) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <MessageAction aria-label="Info" tooltip="Info">
                <InfoIcon className="size-3" />
            </MessageAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-primary/30 border-primary/50 text-white">
            <DropdownMenuItem
                className="cursor-pointer text-xs flex items-center gap-2 hover:bg-white/10"
                onClick={() => toast.info("Edit")}
            >
                <PencilIcon className="size-3.5" />
                Edit
            </DropdownMenuItem>
            <DropdownMenuItem
                className="cursor-pointer text-xs flex items-center gap-2 hover:bg-white/10"
                onClick={() => toast.info("Impersonate")}
            >
                <UserCircleIcon className="size-3.5" />
                Impersonate
            </DropdownMenuItem>
            <DropdownMenuItem
                className="cursor-pointer text-xs flex items-center gap-2 hover:bg-white/10"
                onClick={() => setActivePreview?.("persona")}
            >
                <UserIcon className="size-3.5" />
                Persona Preview
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
));

UserMessageInfo.displayName = "UserMessageInfo";

const ChatMessages: React.FC<ChatMessagesProps> = ({
    setActivePreview,
    chatId,
    messages: messagesProp = [],
    apiMessages = [],
    isSending = false,
    isStreaming = false,
    error,
    folderId,
    onReload,
    onStartNewChat,
    onStartWorkOnToday,
    onBranchChat,
    onSaveChat,
    onExcludeMessage,
    onInfo,
    onDeleteMessage,
    authorNotes,
    characterNotes,
}) => {
    const [liked, setLiked] = useState<Record<string, boolean>>({});
    const [disliked, setDisliked] = useState<Record<string, boolean>>({});
    const [notesDialog, setNotesDialog] = useState<"author" | "character" | null>(null);
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

    const lastUserMessageIndex = useMemo(() => {
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].role === "user") return i;
        }
        return -1;
    }, [messages]);

    const showThinkingSpinner =
        (isSending || isStreaming) &&
        (messages.length === 0 || messages[messages.length - 1]?.role !== "assistant");

    return (
        <>
        <Conversation className="flex flex-col flex-1 min-h-0 px-2 pb-0 relative overflow-hidden">
            <ConversationContent className="flex flex-col gap-4 pb-10">
                {messages.map((message, messageIndex) => {
                    const textParts = message.parts.filter((p) => p.type === "text");
                    const fileParts = message.parts.filter(isFilePart);
                    const combinedText = textParts.map((p) => (p as { type: "text"; text: string }).text).join("\n");
                    const isLastMessage = messageIndex === messages.length - 1;
                    const isLastAssistant = isLastMessage && message.role === "assistant";
                    const isFirstAssistantMessage =
                        message.role === "assistant" &&
                        !messages.slice(0, messageIndex).some((m) => m.role === "assistant");

                    const rawMeta = apiMessages[messageIndex]?.metadata;
                    const characterVersions =
                        rawMeta && typeof rawMeta === "object" && "versions" in rawMeta
                            ? (rawMeta as { versions?: string[] }).versions
                            : undefined;
                    const hasCharacterVersions =
                        isFirstAssistantMessage &&
                        Array.isArray(characterVersions) &&
                        characterVersions.length > 0;

                    const key = branchKey(messageIndex);
                    const saved = branchState[key];
                    const savedBranches = saved?.branches ?? [];
                    const allBranches = hasCharacterVersions
                        ? characterVersions
                        : [...savedBranches, combinedText];
                    const isStreamingThisMessage = isLastAssistant && isStreaming;
                    const defaultBranchIndex = hasCharacterVersions ? 0 : allBranches.length - 1;
                    const selectedIndex = isStreamingThisMessage
                        ? allBranches.length - 1
                        : Math.min(
                            saved?.selectedIndex ?? defaultBranchIndex,
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
                                        <MessageContent key={idx} className="flex">
                                            <MessageResponse parseIncompleteMarkdown>
                                                {content}
                                            </MessageResponse>
                                        </MessageContent>
                                    ))}
                                </MessageBranchContent>
                                <MessageToolbar className="">
                                        {allBranches.length > 1 && (
                                            <MessageBranchSelector from="assistant">
                                                <MessageBranchPrevious />
                                                <MessageBranchPage />
                                                <MessageBranchNext />
                                            </MessageBranchSelector>
                                        )}
                                        <MessageActions className="gap-1">
                                            <MessageAction
                                                label="Copy"
                                                tooltip="Copy to clipboard"
                                                onClick={() => {
                                                    navigator.clipboard
                                                        .writeText(displayContent)
                                                        .then(() => toast.success("Copied to clipboard"))
                                                        .catch(() => toast.error("Failed to copy"));
                                                }}
                                            >
                                                <CopyIcon className="size-3" />
                                            </MessageAction>
                                            <MessageAction
                                                label="Delete"
                                                tooltip="Delete message"
                                                onClick={() => {
                                                    if (onDeleteMessage) {
                                                        onDeleteMessage(message.id);
                                                    } else {
                                                        toast.info("Delete message");
                                                    }
                                                }}
                                            >
                                                <Trash2Icon className="size-3" />
                                            </MessageAction>
                                            {isLastAssistant && (
                                                <>
                                                    <MessageAction
                                                        label="Regenerate"
                                                        tooltip="Regenerate response"
                                                        onClick={() => {
                                                            const apiMsg = apiMessages[messageIndex];
                                                            const messageId =
                                                                apiMsg?.role === "assistant"
                                                                    ? apiMsg.id
                                                                    : UUID_REGEX.test(message.id)
                                                                        ? message.id
                                                                        : "";
                                                            if (!messageId || !UUID_REGEX.test(messageId)) {
                                                                toast.error(
                                                                    "Regenerate is not available yet. Please wait for the message to be saved."
                                                                );
                                                                return;
                                                            }
                                                            onReload?.(messageId);
                                                        }}
                                                    >
                                                        <RotateCwIcon className="size-3" />
                                                    </MessageAction>
                                                    <MessageMenu
                                                        messageId={message.id}
                                                        content={displayContent}
                                                        onStartNewChat={onStartNewChat}
                                                        onStartWorkOnToday={onStartWorkOnToday}
                                                        onBranchChat={onBranchChat}
                                                        onSaveChat={onSaveChat}
                                                        onExcludeMessage={onExcludeMessage}
                                                    />
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <MessageAction
                                                                aria-label="Info menu"
                                                                tooltip="Info"
                                                            >
                                                                <InfoIcon className="size-3" />
                                                            </MessageAction>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-primary/30 border-primary/50 text-white">
                                                            <DropdownMenuItem
                                                                className="cursor-pointer text-xs flex items-center gap-2 hover:bg-white/10"
                                                                onClick={() => setActivePreview?.("character")}
                                                            >
                                                                <UserIcon className="size-3.5" />
                                                                Character preview
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="cursor-pointer text-xs flex items-center gap-2 hover:bg-white/10"
                                                                onClick={() => setNotesDialog("author")}
                                                            >
                                                                <FileTextIcon className="size-3.5" />
                                                                Author notes
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="cursor-pointer text-xs flex items-center gap-2 hover:bg-white/10"
                                                                onClick={() => setNotesDialog("character")}
                                                            >
                                                                <StickyNoteIcon className="size-3.5" />
                                                                Character notes
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="cursor-pointer text-xs flex items-center gap-2 hover:bg-white/10"
                                                                onClick={() => toast.info("Impersonate")}
                                                            >
                                                                <UserCircleIcon className="size-3.5" />
                                                                Impersonate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="cursor-pointer text-xs flex items-center gap-2 hover:bg-white/10"
                                                                onClick={() => toast.info("Edit")}
                                                            >
                                                                <PencilIcon className="size-3.5" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </>
                                            )}
                                        </MessageActions>
                                    </MessageToolbar>
                            </MessageBranch>
                        );
                    };

                    return (
                        <Fragment key={message.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
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
                                                        <AttachmentPreview />
                                                        <AttachmentRemove />
                                                    </Attachment>
                                                ))}
                                            </Attachments>
                                        </div>
                                    )}
                                    {message.role === "assistant" ? renderAssistantContent() : (
                                        <>
                                            <MessageContent>{combinedText || null}</MessageContent>
                                            <MessageToolbar className=" flex items-end justify-end">
                                                <MessageActions className="gap-1">
                                                    <MessageAction
                                                        label="Copy"
                                                        tooltip="Copy to clipboard"
                                                        onClick={() => {
                                                            navigator.clipboard
                                                                .writeText(combinedText)
                                                                .then(() => toast.success("Copied to clipboard"))
                                                                .catch(() => toast.error("Failed to copy"));
                                                        }}
                                                    >
                                                        <CopyIcon className="size-3" />
                                                    </MessageAction>
                                                    <MessageAction
                                                        label="Delete"
                                                        tooltip="Delete message"
                                                        onClick={() => {
                                                            if (onDeleteMessage) {
                                                                onDeleteMessage(message.id);
                                                            } else {
                                                                toast.info("Delete message");
                                                            }
                                                        }}
                                                    >
                                                        <Trash2Icon className="size-3" />
                                                    </MessageAction>
                                                    {messageIndex === lastUserMessageIndex && (
                                                        <>
                                                            <UserMessageMenu
                                                                messageId={message.id}
                                                                onSaveChat={onSaveChat}
                                                                onExcludeMessage={onExcludeMessage}
                                                            />
                                                            <UserMessageInfo setActivePreview={setActivePreview} />
                                                        </>
                                                    )}
                                                </MessageActions>
                                            </MessageToolbar>
                                        </>
                                    )}
                                </Message>
                            </motion.div>
                        </Fragment>
                    );
                })}
                {showThinkingSpinner && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        <Message from="assistant">
                            <div className="flex items-center gap-2 mb-1">
                                <Avatar className="size-8">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="Assistant" />
                                    <AvatarFallback>AI</AvatarFallback>
                                </Avatar>
                                <div className="loader-thinking ml-2" aria-label="Thinking">
                                    <span />
                                    <span />
                                    <span />
                                </div>
                            </div>
                        </Message>
                    </motion.div>
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
                            <MessageContent className="rounded-lg w-fit bg-destructive/20 border border-destructive/50 px-4 py-3 text-sm text-destructive flex-1">
                                Something went wrong. Please try again.
                            </MessageContent>
                        </div>
                    </Message>
                )}
            </ConversationContent>
            <ConversationScrollButton className="bottom-10 z-10" />
        </Conversation>

        <Dialog open={notesDialog === "author"} onOpenChange={(open) => !open && setNotesDialog(null)}>
            <DialogContent showCloseButton={false} className="sm:max-w-2xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden rounded-4xl border border-primary backdrop-blur-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]">
                <DialogHeader className="relative flex flex-row items-center justify-between gap-4 px-6 pt-6 pb-5 ">
                    <DialogTitle className="flex items-center gap-3.5 text-white">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/25 border border-primary/40 shadow-lg shadow-primary/10">
                            <FileTextIcon className="size-5 text-primary" />
                        </div>
                        <div>
                            <span className="block text-start text-lg font-semibold tracking-tight">Author Notes</span>
                            <span className="block text-xs font-normal text-muted-foreground mt-0.5">Guidance for the character creator</span>
                        </div>
                    </DialogTitle>
                    <DialogClose asChild>
                        <button
                            type="button"
                            aria-label="Close"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full  text-muted-foreground hover:bg-primary/25 hover:text-white hover:border-primary/40 transition-all duration-200"
                        >
                            <XIcon className="size-4" />
                        </button>
                    </DialogClose>
                </DialogHeader>
                <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 custom-scroll">
                    <div className={cn(
                        "rounded-2xl p-6 min-h-[160px] transition-colors",
                        authorNotes?.trim()
                            ? "bg-primary/5 border border-primary/20"
                            : "bg-primary/5 border-2 border-dashed border-primary/20"
                    )}>
                        {authorNotes?.trim() ? (
                            <p className="text-[15px] text-muted-foreground whitespace-pre-wrap leading-[1.7]">
                                {authorNotes}
                            </p>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <FileTextIcon className="size-6 text-primary/40" />
                                </div>
                                <p className="text-sm italic text-muted-foreground/70">No author notes available for this character.</p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        <Dialog open={notesDialog === "character"} onOpenChange={(open) => !open && setNotesDialog(null)}>
            <DialogContent showCloseButton={false} className="sm:max-w-2xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden rounded-4xl border border-primary backdrop-blur-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]">
                <DialogHeader className="relative flex flex-row items-center justify-between gap-4 px-6 pt-6 pb-5 ">
                    <DialogTitle className="flex items-center gap-3.5 text-white">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/25 border border-primary/40 shadow-lg shadow-primary/10">
                            <StickyNoteIcon className="size-5 text-primary" />
                        </div>
                        <div>
                            <span className="block text-lg font-semibold tracking-tight">Character Notes</span>
                            <span className="block text-xs font-normal text-muted-foreground mt-0.5">Internal context for the AI</span>
                        </div>
                    </DialogTitle>
                    <DialogClose asChild>
                        <button
                            type="button"
                            aria-label="Close"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full  text-muted-foreground hover:bg-primary/25 hover:text-white hover:border-primary/40 transition-all duration-200"
                        >
                            <XIcon className="size-4" />
                        </button>
                    </DialogClose>
                </DialogHeader>
                <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 custom-scroll">
                    <div className={cn(
                        "rounded-2xl p-6 min-h-[160px] transition-colors",
                        characterNotes?.trim()
                            ? "bg-primary/5 border border-primary/20"
                            : "bg-primary/5 border-2 border-dashed border-primary/20"
                    )}>
                        {characterNotes?.trim() ? (
                            <p className="text-[15px] text-muted-foreground whitespace-pre-wrap leading-[1.7]">
                                {characterNotes}
                            </p>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <StickyNoteIcon className="size-6 text-primary/40" />
                                </div>
                                <p className="text-sm italic text-muted-foreground/70">No character notes available for this character.</p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
        </>
    );
};

export default ChatMessages;
