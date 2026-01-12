import { Search } from 'lucide-react'
import React, { useState, useEffect, useCallback } from 'react'
import { Input } from '../ui/input'

interface Props {
    placeholder?: string
    value?: string
    onChange?: (value: string) => void
    onDebouncedChange?: (value: string) => void
    debounceMs?: number
    className?: string
}

const SearchField: React.FC<Props> = ({
    placeholder = "",
    value,
    onChange,
    onDebouncedChange,
    debounceMs = 500,
    className = "",
    ...props
}) => {
    const [internalValue, setInternalValue] = useState<string>("");
    const [debouncedValue, setDebouncedValue] = useState<string>("");

    const isControlled = value !== undefined && onChange !== undefined;
    const inputValue = isControlled ? value : internalValue;

    // Debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentValue = isControlled ? value || "" : internalValue;
            setDebouncedValue(currentValue);
            onDebouncedChange?.(currentValue);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [inputValue, debounceMs, onDebouncedChange, isControlled, value, internalValue]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        if (isControlled) {
            onChange?.(newValue);
        } else {
            setInternalValue(newValue);
        }
    }, [isControlled, onChange]);

    return (
        <div className={`flex flex-1 items-center bg-primary/20 backdrop-blur-2xl border rounded-full pl-4 py-2 border-primary/70 ${className}`}>
            <Search className='text-muted' />
            <Input
                className='border-none bg-transparent backdrop-blur-none focus-visible:ring-0 focus-visible:border-none'
                placeholder={placeholder}
                value={inputValue}
                onChange={handleChange}
                {...props}
            />
        </div>
    );
}

export default SearchField