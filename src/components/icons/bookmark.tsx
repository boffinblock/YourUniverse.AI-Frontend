"use client"
import { cn } from "@/lib/utils";
import { Bookmark as BookmarkIcon } from "lucide-react";
import React, { useState } from "react";

interface BookmarkProps {
    active?: boolean;
    onChange?: (value: boolean) => void;
    className?: string;
}

const Bookmark: React.FC<BookmarkProps> = ({
    active = false,
    onChange,
    className
}) => {
    const [activeState, setActiveState] = useState(active);

    const toggle = () => {
        const newValue = !activeState;
        setActiveState(newValue);
        onChange?.(newValue);
    };

    return (
        <BookmarkIcon
            onClick={toggle}
            size={30}
            className={cn(
                "cursor-pointer  ",
                activeState
                    ? " stroke-0 fill-primary"
                    : " stroke-1 stroke-primary fill-gray-900 hover:fill-primary/20",
                className
            )}
        />
    );
};

export default Bookmark;
