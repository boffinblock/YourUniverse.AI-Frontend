"use client"
import React, { useState, useRef } from "react";
import { toast } from "sonner"
import { Button } from "../ui/button";
import { Send, Trash, Upload } from "lucide-react";
import Footer from "../layout/footer";
const ChatPanel = () => {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    // Auto-expand textarea on input
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = e.target;
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
        setMessage(e.target.value);
    };

    // Handle Enter vs Shift+Enter
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            // Submit logic here
            setMessage("");
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        }
    };

    return (
        <div className="w-full shrink-0 sticky bottom-0 space-y-2 backdrop-blur-xl rounded-xl">
            <form
                action=""
                className="flex  flex-col w-full h-auto] items-end gap-3 rounded-4xl shadow-xl backdrop-filter backdrop-blur-lg text-white bg-primary/16 px-3 py-4 border border-primary/50"
            >
                <div className="w-full  max-h-[300px] overflow-y-auto  ">
                    <textarea
                        ref={textareaRef}
                        placeholder="Type a message..."
                        value={message}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        className="flex-1 w-full h-auto px-3 custom-scroll py-4 resize-none border-0 bg-transparent focus:outline-none focus:ring-0 text-sm leading-tight  overflow-y-auto"

                    />
                </div>
                <div className="flex justify-end w-full ">
                    {/* <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                    >
                        <Plus className="h-8 w-8" />
                    </Button> */}

                    <div className="space-x-2">
                        <Button
                            type="button"
                            size="icon"
                            variant={"ghost"}
                            className="bg-primary/40"

                        >
                            <Trash className="h-8 w-8 text-white" />
                        </Button>
                        {/* commented by client feedback */}
                        {/* <Button
                            type="submit"
                            size="icon"
                            variant={"ghost"}
                            className="bg-primary/40"

                        >
                            <ChevronsDown className="h-8 w-8 text-white rotate-180" />
                        </Button>
                        <Button
                            type="button"
                            size="icon"
                            variant={"ghost"}
                            className="bg-primary/40"

                        >
                            <ChevronsDown className="h-8 w-8 text-white" />
                        </Button> */}

                        <Button
                            type="button"
                            size="icon"
                            variant={"ghost"}
                            className="bg-primary/40"

                        >
                            <Upload className="h-8 w-8 text-white" />
                        </Button>
                        <Button
                            type="button"
                            size="icon"
                            // onClick={() => toast.success("Event created successfully 🎉")}
                            // onClick={() => toast.error("Unable to create the event. Please try again.")}
                            onClick={() => toast.warning("Some details are missing. Please review the form.")}





                        >
                            <Send className="h-8 w-8 text-white" />
                        </Button>
                    </div>
                </div>
            </form>
            <Footer />
        </div>
    );
};

export default ChatPanel;
