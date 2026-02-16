"use client";

import React, { useState, useRef, useCallback } from "react";
import { Button } from "../ui/button";
import { CircleStop, Send, Square } from "lucide-react";
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
    /** AI is actively streaming the response */
    isStreaming?: boolean;
    /** Message sent, waiting for first token (e.g. "Thinking...") */
    isSending?: boolean;
    onStop?: () => void;
    /** Disable the input when true (e.g. no chat selected) */
    disabled?: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
    footer = true,
    characterSelection,
    onSelectchar,
    onChange,
    handleSubmit,
    isStreaming = false,
    isSending = false,
    onStop,
    placeholder = "Type a message...",
    disabled = false,
}) => {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const isBusy = isStreaming || isSending;
    const isDisabled = disabled || isBusy;

    const handleInput = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            if (isDisabled) return; // Disable input while streaming or disabled
            const textarea = e.target;
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
            setMessage(e.target.value);
            onChange?.(e.target.value);
        },
        [onChange, isDisabled]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (isDisabled) return; // Disable submit while streaming or disabled
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
        [handleSubmit, message, isDisabled]
    );

    const handleStopClick = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            onStop?.();
        },
        [onStop]
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
                        placeholder={
                            placeholder
                        }
                        value={message}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        className={cn(
                            "flex-1 w-full h-auto px-3 custom-scroll py-4 resize-none border-0 bg-transparent focus:outline-none focus:ring-0 text-sm leading-tight overflow-y-auto",
                        )}
                    />
                </div>
                <div className={cn("flex justify-end items-center w-full", characterSelection && "justify-between")}>
                    {characterSelection && !isDisabled && (
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
                        {isBusy && !disabled ? (
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="bg-primary/80 hover:bg-red-500/20 rounded-full  cursor-pointer"
                                onClick={handleStopClick}
                                title="Stop generating"
                            >
                                <Square fill="white" className="h-8 w-8 text-white animate-pulse" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                size="icon"
                                variant="ghost"
                                className="bg-primary/80 hover:bg-primary/90 rounded-full cursor-pointer"
                                disabled={!message.trim()}
                                title="Send message"
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
