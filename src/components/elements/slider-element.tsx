"use client"
import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface SliderElementProps {
    min?: number;
    max?: number;
    label?: string;
    value?: number;
    step?: number;
    onValueChange?: (value: number[]) => void;
    className?: string;
}

const SliderElement: React.FC<SliderElementProps> = ({
    min = 0,
    max = 100,
    label,
    value = 0.4,
    step = 0.01,
    onValueChange,
    className = "",
}) => {
    const [internalValue, setInternalValue] = useState<number>(value);

    const handleChange = (val: number[]) => {
        setInternalValue(val[0]);
        onValueChange?.(val); // Call parent if provided
    };

    return (
        <div className={`flex-1 w-full text-white ${className}`}>
            {label && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{label}</span>
                    <span className="text-sm">{internalValue.toFixed(2)}</span>
                </div>
            )}

            <Slider
                min={min}
                max={max}
                step={step}
                value={[internalValue]}
                onValueChange={handleChange}
                aria-label={label || "slider"}
            />

            <Label className="flex justify-between opacity-70 text-xs mt-1">
                <span>Min: {min}</span>
                <span>Max: {max}</span>
            </Label>
        </div>
    );
};

export default SliderElement;
