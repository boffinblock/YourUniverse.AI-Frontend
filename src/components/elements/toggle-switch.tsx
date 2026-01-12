"use client";

import * as React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ToggleSwitchProps {
    options: { label: string; value: string }[];
    defaultValue?: string;
    onChange?: (value: string) => void;
    className?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
    options,
    defaultValue,
    onChange,
    // className = "",
}) => {
    const [active, setActive] = React.useState(defaultValue || options[0]?.value);

    const handleChange = (val: string) => {
        if (!val) return;
        setActive(val);
        onChange?.(val);
    };

    return (
        <ToggleGroup
            type="single"
            value={active}
            onValueChange={handleChange}
            className="bg-primary/40 backdrop-blur-3xl px-2 py-1 rounded-full border border-primary/80 "
        >
            {options.map((option) => (
                <ToggleGroupItem
                    key={option.value}
                    value={option.value}
                    className={`flex-1 !rounded-full  text-white hover:bg-transparent h-7  px-4 !text-sm cursor-pointer font-medium transition-all ${active === option.value ? "bg-primary" : "bg-transparent"
                        }`}
                >
                    {option.label}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
};
