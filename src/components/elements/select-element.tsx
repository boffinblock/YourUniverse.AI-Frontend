import React from "react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectLabel,
    SelectItem,
} from "@/components/ui/select";

interface SelectOption {
    value: string;
    label: string;
}

interface SelectElementProps {
    label?: string;
    placeholder?: string;
    options: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
}

const SelectElement: React.FC<SelectElementProps> = ({
    label,
    placeholder = "Select an option",
    options,
    value,
    onChange,
    className = "w-[180px]",
}) => {
    return (
        <Select value={value} onValueChange={onChange} >
            <SelectTrigger className={className} >
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {label && <SelectLabel>{label}</SelectLabel>}
                    {options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default SelectElement;
