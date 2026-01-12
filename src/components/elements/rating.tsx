"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import clsx from "clsx";

interface RatingProps {
    value?: number;
    max?: number;
    onChange?: (value: number) => void;
    size?: number;
    readOnly?: boolean;
    className?: string;
}

export default function Rating({
    value = 0,
    max = 5,
    onChange,
    size = 24,
    readOnly = false,
    className = "",
}: RatingProps) {
    const [hover, setHover] = useState<number | null>(null);

    const handleClick = (index: number) => {
        if (!readOnly && onChange) onChange(index);
    };

    const handleMouseEnter = (index: number) => {
        if (!readOnly) setHover(index);
    };

    const handleMouseLeave = () => {
        if (!readOnly) setHover(null);
    };

    const currentValue = hover !== null ? hover : value;

    return (
        <div className={clsx("flex  items-center gap-1", className)}>
            {Array.from({ length: max }, (_, i) => {
                const index = i + 1;
                const full = index <= Math.floor(currentValue);
                const half = !full && index - 0.5 <= currentValue;

                return (
                    <div
                        key={index}
                        className="relative cursor-pointer"
                        onClick={() => handleClick(index)}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                        style={{ width: size, height: size }}
                    >
                        <Star
                            size={size}
                            className="absolute top-0 left-0  text-gray-300 stroke-yellow-500"
                        />
                        {full && (
                            <Star
                                size={size}
                                className="absolute top-0 left-0 fill-yellow-400 text-yellow-500"
                            />
                        )}
                        {half && (
                            <div
                                className="absolute top-0 left-0 overflow-hidden"
                                style={{ width: "50%", height: "100%" }}
                            >
                                <Star
                                    size={size}
                                    className="fill-yellow-500 text-yellow-500"
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
