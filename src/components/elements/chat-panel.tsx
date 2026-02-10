"use client";

import React, { useState, useRef, useCallback } from "react";
import { Button } from "../ui/button";
import { CircleStop, Send, Trash, Upload, Pause } from "lucide-react";
import Footer from "../layout/footer";
import LinkToField from "./link-to-field";
import { cn } from "@/lib/utils";

interface ChatPanelProps {
    footer?: boolean;
    placeholder?: string;
    characterSelection?: boolean;
    onChange?: (value: string) => void;
    /** Called with the current message text when user submits (Enter or Send). Omit to use no-op. */
    handleSubmit?: (message: string) => void;
    onSelectchar?: (value: string | undefined) => void;
    isStreaming?: boolean;
    isPaused?: boolean;
    onStop?: () => void;
    onPause?: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
    footer = true,
    characterSelection,
    onSelectchar,
    onChange,
    handleSubmit,
    isStreaming = false,
    isPaused = false,
    onStop,
    onPause,
    placeholder = "Type a message...",
}) => {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleInput = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            if (isStreaming) return; // Disable input while streaming
            const textarea = e.target;
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
            setMessage(e.target.value);
            onChange?.(e.target.value);
        },
        [onChange, isStreaming]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (isStreaming) return; // Disable submit while streaming
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const text = message.trim();
                if (text) {
                    handleSubmit?.(text);
                    setMessage("");
                    textareaRef.current && (textareaRef.current.style.height = "auto");
                }
            }
        },
        [handleSubmit, message, isStreaming]
    );

    const handleStopClick = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            onStop?.();
        },
        [onStop]
    );

    const handlePauseClick = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            onPause?.();
        },
        [onPause]
    );

    const handleCharacterChange = useCallback(
        (value: string[]) => onSelectchar?.(value?.[0]),
        [onSelectchar]
    );

    return (
        <div className="w-full shrink-0 sticky bottom-0 space-y-2 backdrop-blur-xl rounded-xl">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const text = message.trim();
                    if (text) handleSubmit?.(text);
                    setMessage("");
                    textareaRef.current && (textareaRef.current.style.height = "auto");
                }}
                className="flex flex-col w-full h-auto items-end gap-3 rounded-4xl shadow-xl backdrop-filter backdrop-blur-lg text-white bg-primary/16 px-3 py-2 border border-primary/50"
            >
                <div className="w-full max-h-[300px] overflow-y-auto">
                    <textarea
                        ref={textareaRef}
                        placeholder={isStreaming ? "AI is responding..." : placeholder}
                        value={message}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        disabled={isStreaming}
                        className={cn(
                            "flex-1 w-full h-auto px-3 custom-scroll py-4 resize-none border-0 bg-transparent focus:outline-none focus:ring-0 text-sm leading-tight overflow-y-auto",
                            isStreaming && "opacity-50 cursor-not-allowed"
                        )}
                    />
                </div>
                <div className={cn("flex justify-end items-center w-full", characterSelection && "justify-between")}>
                    {characterSelection && !isStreaming && (
                        <div>
                            <LinkToField
                                name="character"
                                placeholder="Select a character"
                                multiSelect={false}
                                model="character"
                                className="bg-transparent border-primary/50 !rounded-2xl"
                                onValueChange={handleCharacterChange}
                            />
                        </div>
                    )}
                    <div className="space-x-2">
                        {!isStreaming && (
                            <>
                                <Button type="button" size="icon" variant="ghost" className="bg-primary/40">
                                    <Trash className="h-8 w-8 text-white" />
                                </Button>
                                <Button type="button" size="icon" variant="ghost" className="bg-primary/40">
                                    <Upload className="h-8 w-8 text-white" />
                                </Button>
                            </>
                        )}
                        {isStreaming ? (

                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="bg-primary/40 hover:bg-red-500/20"
                                onClick={handleStopClick}
                                title="Stop"
                            >
                                <CircleStop className="h-8 w-8 text-white" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                size="icon"
                                variant="ghost"
                                className="bg-primary/40 hover:bg-primary/60"
                                disabled={!message.trim()}
                            >
                                <Send className="h-8 w-8 text-white" />
                            </Button>
                        )}
                    </div>
                </div>
            </form>
            {footer && <Footer />}
        </div>
    );
};

export default ChatPanel;
