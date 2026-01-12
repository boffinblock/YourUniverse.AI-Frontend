"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { MultiSelect } from "@/components/ui/multi-select";
import { useListTags } from "@/hooks";

interface MultiSelectFilterProps {
    /**
     * Selected tag values (array of tag names)
     */
    value?: string[];
    /**
     * Callback fired when selected values change
     * @param value - Array of selected tag names
     */
    onChange?: (value: string[]) => void;
    /**
     * Placeholder text
     */
    placeholder?: string;
    /**
     * Initial category filter (SFW or NSFW)
     * Default: "SFW"
     */
    defaultCategory?: "SFW" | "NSFW";
    /**
     * Maximum number of tags to display in badges
     */
    maxCount?: number;
    /**
     * Whether to display tags in a single line
     */
    singleLine?: boolean;
    /**
     * Additional CSS classes
     */
    className?: string;
    /**
     * Whether the component is disabled
     */
    disabled?: boolean;
}

const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
    value = [],
    onChange,
    placeholder = "Select tags",
    defaultCategory = "SFW",
    maxCount = 1,
    singleLine = true,
    className = "",
    disabled = false,
}) => {
    const [selectedCategory, setSelectedCategory] = useState<"SFW" | "NSFW">(defaultCategory);

    // Update selectedCategory when defaultCategory prop changes
    useEffect(() => {
        setSelectedCategory(defaultCategory);
    }, [defaultCategory]);

    // Normalize value to ensure it's always string[]
    const normalizeValue = useCallback((val: unknown): string[] => {
        if (Array.isArray(val)) {
            return val.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
        }
        if (typeof val === 'string') {
            // Handle comma-separated strings (legacy format)
            if (val.includes(',')) {
                return val.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            }
            return val.trim() ? [val.trim()] : [];
        }
        return [];
    }, []);

    // Normalize the value prop
    const normalizedValue = useMemo(() => {
        return normalizeValue(value);
    }, [value, normalizeValue]);

    // Fetch tags based on category
    const { tags, isLoading: isLoadingTags } = useListTags({
        filters: {
            category: selectedCategory,
            limit: 100,
            sortBy: "name",
            sortOrder: "asc",
        },
        enabled: true,
        showErrorToast: false,
    });

    // Convert API tags to MultiSelectOption format
    const tagOptions = useMemo(() => {
        return tags
            .filter(tag => tag.category === selectedCategory)
            .map((tag) => ({
                label: tag.name.charAt(0).toUpperCase() + tag.name.slice(1),
                value: tag.name.toLowerCase(),
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [tags, selectedCategory]);

    // Handle value change - ALWAYS return string[] via onChange
    const handleValueChange = useCallback((newValue: string[]) => {
        // Ensure it's always a valid string array
        const normalized = Array.isArray(newValue)
            ? newValue.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
            : [];

        // Call onChange with normalized array
        if (onChange) {
            onChange(normalized);
        }
    }, [onChange]);

    return (
        <MultiSelect
            options={tagOptions}
            value={normalizedValue}
            onValueChange={handleValueChange}
            addFunctionality={false}
            placeholder={placeholder}
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
            maxCount={maxCount}
            singleLine={singleLine}
            className={className}
            disabled={disabled || isLoadingTags}
            emptyIndicator={
                isLoadingTags ? (
                    <p className="text-muted-foreground">Loading tags...</p>
                ) : (
                    <p className="text-muted-foreground text-sm">No tags found.</p>
                )
            }
        />
    );
};

export default MultiSelectFilter;