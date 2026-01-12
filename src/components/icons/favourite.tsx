"use client"
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import React, { useState } from "react";

interface FavouriteProps {
    active?: boolean;
    onChange?: (value: boolean) => void;
    className?: string;
}

const Favourite: React.FC<FavouriteProps> = ({
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
        <Heart
            onClick={toggle}
            size={28}
            className={cn(
                "cursor-pointer  ",
                activeState
                    ? "stroke-red-500 fill-red-500 stroke-0"
                    : " stroke-1 stroke-primary fill-gray-900 hover:fill-primary/20",
                className
            )}
        />
    );
};

export default Favourite;
