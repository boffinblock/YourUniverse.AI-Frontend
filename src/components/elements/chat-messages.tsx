
'use client';
import { Actions, Action } from '@/components/ai-elements/actions';
import { Message, MessageContent } from '@/components/ai-elements/message';
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
} from "@/components/ui/dropdown-menu"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Conversation,
    ConversationContent,
    ConversationScrollButton,
} from '@/components/ai-elements/conversation';

import { Response } from '@/components/ai-elements/response';
import { RefreshCcwIcon, CopyIcon, Trash, Info, EllipsisVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';


export type MessagePart = {
    type: "text";
    text: string;
};

export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
    id: string;
    role: MessageRole;
    parts: MessagePart[];
}

export type ChatMessages = ChatMessage[];

const dummyMessages: ChatMessages = [
    {
        id: "0",
        role: "assistant",
        parts: [{ type: "text", text: "Hi there! How can I assist you today?" }],
    },
    {
        id: "1",
        role: "user",
        parts: [{ type: "text", text: "Hello! How are you?" }],
    },
    {
        id: "2",
        role: "assistant",
        parts: [{ type: "text", text: "I'm doing great! Thanks for asking. How can I help you today?" }],
    },
    {
        id: "3",
        role: "user",
        parts: [{ type: "text", text: "Tell me something interesting." }],
    },
    {
        id: "4",
        role: "assistant",
        parts: [{ type: "text", text: "Did you know honey never spoils? Archaeologists found 3000-year-old honey still edible!" }],
    },
    {
        id: "5",
        role: "user",
        parts: [{ type: "text", text: "Haha that's cool! Can you tell me a joke?" }],
    },
    {
        id: "6",
        role: "assistant",
        parts: [{ type: "text", text: "Sure! Why did the developer go broke? Because he used up all his cache." }],
    },
    {
        id: "7",
        role: "user",
        parts: [{ type: "text", text: "Nice one! What is AI in simple words?" }],
    },
    {
        id: "8",
        role: "assistant",
        parts: [{ type: "text", text: "AI is like teaching a computer to think, learn, and solve problems like humans do." }],
    },
    {
        id: "9",
        role: "user",
        parts: [{ type: "text", text: "Great! Can AI write code?" }],
    },
    {
        id: "10",
        role: "assistant",
        parts: [{ type: "text", text: "Yes! AI can generate, optimize, and explain code. It helps developers work faster." }],
    },
    {
        id: "11",
        role: "user",
        parts: [{ type: "text", text: "Show me a small example in JavaScript." }],
    },
    {
        id: "12",
        role: "assistant",
        parts: [{ type: "text", text: "Here you go: `console.log('Hello from AI!')`" }],
    },
    {
        id: "13",
        role: "user",
        parts: [{ type: "text", text: "Thanks! How do I center a div in CSS?" }],
    },
    {
        id: "14",
        role: "assistant",
        parts: [{ type: "text", text: "Use flexbox:\ndiv { display: flex; justify-content: center; align-items: center; }" }],
    },
    {
        id: "15",
        role: "user",
        parts: [{ type: "text", text: "What’s the difference between let and const?" }],
    },
    {
        id: "16",
        role: "assistant",
        parts: [{ type: "text", text: "Use **const** for values that don’t change. Use **let** when you need to reassign the variable." }],
    },
    {
        id: "17",
        role: "user",
        parts: [{ type: "text", text: "What is Next.js used for?" }],
    },
    {
        id: "18",
        role: "assistant",
        parts: [{ type: "text", text: "Next.js is a React framework for building fast, SEO-friendly websites and apps." }],
    },
    {
        id: "19",
        role: "user",
        parts: [{ type: "text", text: "Awesome! Give me one more joke." }],
    },
    {
        id: "20",
        role: "assistant",
        parts: [{ type: "text", text: "Why was the JavaScript developer sad? Because he didn’t know how to ‘null’ his feelings." }],
    },
];

const alternateMessages = [
    "Hey! What can I help you with today?",
    "Hi there — how can I support you?",
    "Hello! What would you like to do next?",
    "Hi! Tell me what you need and I’ll assist.",
    "Hey, how can I make things easier for you today?"
];


interface ChatMessagesProps {
    setActivePreview: (value: 'character' | 'persona' | null) => void;
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



const ChatMessages: React.FC<ChatMessagesProps> = ({ setActivePreview }) => {
    const [messages, setMessages] = useState<ChatMessages>(dummyMessages);
    const [currentAlternateIndex, setCurrentAlternateIndex] = useState(0);

    const { lastUserMsg, lastAssistantMsg } = useMemo(() => {
        const reversedMessages = [...messages].reverse();
        return {
            lastUserMsg: reversedMessages.find(m => m.role === "user"),
            lastAssistantMsg: reversedMessages.find(m => m.role === "assistant"),
        };
    }, [messages]);

const handleChangeFirstMessageBack = () => {
    // stop at 0
    const nextIndex = Math.max(currentAlternateIndex - 1, 0);
    setCurrentAlternateIndex(nextIndex);

    setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        if (newMessages.length > 0 && newMessages[0].role === 'assistant') {
            newMessages[0] = {
                ...newMessages[0],
                parts: [{ type: 'text', text: alternateMessages[nextIndex] }]
            };
        }
        return newMessages;
    });
};

const handleChangeFirstMessageForth = () => {
    // stop at last index
    const nextIndex = Math.min(currentAlternateIndex + 1, alternateMessages.length - 1);
    setCurrentAlternateIndex(nextIndex);

    setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        if (newMessages.length > 0 && newMessages[0].role === 'assistant') {
            newMessages[0] = {
                ...newMessages[0],
                parts: [{ type: 'text', text: alternateMessages[nextIndex] }]
            };
        }
        return newMessages;
    });
};


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

    const renderAssistantActions = (message: ChatMessage, text: string, index: number) => {
        const isLastAssistantMessage = lastAssistantMsg?.id === message.id;
        const isFirstMessage = index === 0;

        return (
            <Actions>
                <Action label="Retry">
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

                {isFirstMessage && (
                    <>
                    <Action label="change message left" onClick={handleChangeFirstMessageBack}>
                        <ChevronLeft className="size-4" />
                    </Action>
                    <Action label="change message right" onClick={handleChangeFirstMessageForth}>
                        <ChevronRight className="size-4" />
                    </Action>
                    </>
                )}
            </Actions>
        );
    };
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    return (
        <Conversation className='flex flex-col flex-1 min-h-0 p-6 relative  '>
            <ConversationContent className='flex-1  ' >
                {messages.map((message, index) => (
                    <Fragment key={message.id}>
                        {renderMessageHeader(message)}
                        {message.parts.map((part, partIndex) => (
                            <Fragment key={`${message.id}-${partIndex}`}>
                                {part.type === 'text' && (
                                    <>
                                        <Message from={message.role}>
                                            <MessageContent>
                                                <Response>{part.text}</Response>
                                            </MessageContent>
                                        </Message>
                                        {message.role === "user"
                                            ? renderUserActions(message, part.text)
                                            : renderAssistantActions(message, part.text, index)
                                        }
                                    </>
                                )}
                            </Fragment>
                        ))}
                    </Fragment>
                ))}
                <div ref={bottomRef} />
            </ConversationContent>
            <ConversationScrollButton />
        </Conversation>
    );
};

export default ChatMessages;
