"use client";

import * as React from "react";
import { Check, ChevronDown, X, XCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";

export interface CustomMultiSelectOption {
    label: string;
    value: string;
    meta?: any;
    disabled?: boolean;
}

export interface CustomMultiSelectProps {
    multiSelect: boolean;
    maxCount?: number;
    options: CustomMultiSelectOption[];
    onValueChange: (values: string[]) => void;
    placeholder?: string;
    className?: string;
    renderItem?: (item: CustomMultiSelectOption) => React.ReactNode;
    value?: string[];
    defaultValue?: string[];
    disabled?: boolean;
    closeOnSelect?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    filter?: boolean;
    filterValue?: "SFW" | "NSFW";
    setFilterValue?: (value: "SFW" | "NSFW") => void;
    onSearchChange?: (searchValue: string) => void;
    isLoading?: boolean;
    /**
     * If true, search is handled server-side and local filtering is disabled
     */
    serverSideSearch?: boolean;
}

const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
    multiSelect,
    maxCount,
    options,
    onValueChange,
    placeholder = "Select...",
    className,
    renderItem,
    value: controlledValue,
    defaultValue,
    disabled = false,
    closeOnSelect = false,
    searchable = true,
    filter = true,
    filterValue = "SFW",
    setFilterValue,
    searchPlaceholder = "Search...",
    onSearchChange,
    isLoading = false,
    serverSideSearch = false,
}) => {
    const [open, setOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState<string[]>(
        defaultValue || []
    );
    const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);
    const [searchValue, setSearchValue] = React.useState("");
    const listboxRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    // Use controlled value if provided, otherwise use internal state
    const selectedValues = controlledValue !== undefined ? controlledValue : internalValue;

    // Filter options based on search
    // If serverSideSearch is true, don't filter locally (server handles it)
    const filteredOptions = React.useMemo(() => {
        // If server-side search is enabled, return all options (server already filtered)
        if (serverSideSearch) {
            return options;
        }

        // Local filtering for static options
        if (!searchable || !searchValue.trim()) {
            return options;
        }
        const searchLower = searchValue.toLowerCase().trim();
        return options.filter(
            (option) =>
                option.label.toLowerCase().includes(searchLower) ||
                option.value.toLowerCase().includes(searchLower) ||
                (option.meta &&
                    typeof option.meta === "object" &&
                    JSON.stringify(option.meta).toLowerCase().includes(searchLower))
        );
    }, [options, searchValue, searchable, serverSideSearch]);

    // Get option by value
    const getOptionByValue = React.useCallback(
        (value: string): CustomMultiSelectOption | undefined => {
            return options.find((opt) => opt.value === value);
        },
        [options]
    );

    // Toggle option selection
    const toggleOption = React.useCallback(
        (optionValue: string) => {
            if (disabled) return;
            const option = getOptionByValue(optionValue);
            if (option?.disabled) return;

            let newValues: string[];

            if (multiSelect) {
                // Multi-select mode
                if (selectedValues.includes(optionValue)) {
                    // Deselect
                    newValues = selectedValues.filter((v) => v !== optionValue);
                } else {
                    // Select - check maxCount
                    if (maxCount && selectedValues.length >= maxCount) {
                        return; // Don't add if maxCount reached
                    }
                    newValues = [...selectedValues, optionValue];
                }
            } else {
                // Single-select mode (but still return array)
                newValues = selectedValues.includes(optionValue) ? [] : [optionValue];
                if (closeOnSelect || newValues.length > 0) {
                    setOpen(false);
                }
            }

            // Update state
            if (controlledValue === undefined) {
                setInternalValue(newValues);
            }

            // Call onChange
            onValueChange(newValues);
        },
        [
            disabled,
            multiSelect,
            maxCount,
            selectedValues,
            getOptionByValue,
            controlledValue,
            onValueChange,
            closeOnSelect,
        ]
    );

    // Handle remove badge
    const handleRemove = React.useCallback(
        (valueToRemove: string, e: React.MouseEvent | React.KeyboardEvent) => {
            e.stopPropagation();
            e.preventDefault();
            toggleOption(valueToRemove);
        },
        [toggleOption]
    );

    // Clear all selections
    const handleClear = React.useCallback(
        (e?: React.MouseEvent | React.KeyboardEvent) => {
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
            if (disabled) return;

            const newValues: string[] = [];

            if (controlledValue === undefined) {
                setInternalValue(newValues);
            }

            onValueChange(newValues);
        },
        [disabled, controlledValue, onValueChange]
    );

    // Get selected options
    const selectedOptions = React.useMemo(() => {
        return options.filter((opt) => selectedValues.includes(opt.value));
    }, [options, selectedValues]);

    // Get visible options (respecting maxCount for display)
    const visibleSelectedValues = React.useMemo(() => {
        if (!maxCount || selectedValues.length <= maxCount) {
            return selectedValues;
        }
        return selectedValues.slice(0, maxCount);
    }, [selectedValues, maxCount]);

    // Handle search input keydown
    const handleSearchKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setFocusedIndex(0);
                // Focus first option
                setTimeout(() => {
                    const optionElements = listboxRef.current?.querySelectorAll(
                        '[role="option"]'
                    );
                    if (optionElements && optionElements[0]) {
                        (optionElements[0] as HTMLElement).focus();
                    }
                }, 0);
            } else if (e.key === "Escape") {
                e.preventDefault();
                setOpen(false);
                buttonRef.current?.focus();
            } else if (e.key === "Enter" && filteredOptions.length === 1) {
                // If only one option matches, select it
                e.preventDefault();
                const option = filteredOptions[0];
                if (!option.disabled) {
                    toggleOption(option.value);
                }
            }
        },
        [filteredOptions, toggleOption]
    );

    // Keyboard navigation
    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent) => {
            if (disabled) return;

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    if (!open) {
                        setOpen(true);
                        setFocusedIndex(0);
                    } else {
                        setFocusedIndex((prev) =>
                            prev < filteredOptions.length - 1 ? prev + 1 : 0
                        );
                    }
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    if (open) {
                        setFocusedIndex((prev) =>
                            prev > 0 ? prev - 1 : filteredOptions.length - 1
                        );
                    }
                    break;
                case "Enter":
                case " ":
                    e.preventDefault();
                    if (open && focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
                        const option = filteredOptions[focusedIndex];
                        if (!option.disabled) {
                            toggleOption(option.value);
                        }
                    } else if (!open) {
                        setOpen(true);
                        setFocusedIndex(0);
                    }
                    break;
                case "Escape":
                    e.preventDefault();
                    setOpen(false);
                    setFocusedIndex(-1);
                    buttonRef.current?.focus();
                    break;
                case "Home":
                    if (open) {
                        e.preventDefault();
                        setFocusedIndex(0);
                    }
                    break;
                case "End":
                    if (open) {
                        e.preventDefault();
                        setFocusedIndex(filteredOptions.length - 1);
                    }
                    break;
            }
        },
        [disabled, open, focusedIndex, filteredOptions, toggleOption]
    );

    // Focus management
    React.useEffect(() => {
        if (open && listboxRef.current && focusedIndex >= 0) {
            const optionElements = listboxRef.current.querySelectorAll(
                '[role="option"]'
            );
            if (optionElements[focusedIndex]) {
                (optionElements[focusedIndex] as HTMLElement).focus();
            }
        }
    }, [open, focusedIndex]);

    // Reset focus when popover closes
    React.useEffect(() => {
        if (!open) {
            setFocusedIndex(-1);
        }
    }, [open]);

    // Default render function
    const defaultRenderItem = (item: CustomMultiSelectOption) => (
        <span className="text-sm">{item.label}</span>
    );

    // Reset search when popover closes
    React.useEffect(() => {
        if (!open) {
            setSearchValue("");
            setFocusedIndex(-1);
            // Reset search in parent if handler provided
            if (onSearchChange) {
                onSearchChange("");
            }
        } else if (searchable && searchInputRef.current) {
            // Focus search input when popover opens
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [open, searchable, onSearchChange]);

    // Reset focused index when filtered options change
    React.useEffect(() => {
        if (focusedIndex >= filteredOptions.length) {
            setFocusedIndex(Math.max(0, filteredOptions.length - 1));
        }
    }, [filteredOptions.length, focusedIndex]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    ref={buttonRef}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-haspopup="listbox"
                    disabled={disabled}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        "flex p-1 rounded-xl border border-primary/90 min-h-10 h-auto items-center justify-between bg-primary/30 backdrop-blur-2xl hover:bg-primary/30 w-full",
                        disabled && "opacity-50 cursor-not-allowed",
                        className
                    )}
                >
                    {selectedValues.length > 0 ? (
                        <div className="flex justify-between items-center w-full">
                            <div className="flex items-center gap-1 flex-wrap flex-1">
                                {visibleSelectedValues.map((value) => {
                                    const option = getOptionByValue(value);
                                    if (!option) return null;

                                    return (
                                        <div
                                            key={value}
                                            // variant="secondary"
                                            className={cn(
                                                multiSelect ? [
                                                    "m-1  py-0.5 px-2 rounded-full transition-all duration-300 ease-in-out",
                                                    "border-foreground/10 text-foreground bg-card hover:bg-card/80",
                                                    "bg-primary text-white/80 hover:bg-primary",
                                                    "[&>svg]:pointer-events-auto flex items-center"]
                                                    : " px-2"
                                            )}
                                        >
                                            <span>

                                                {option.label}
                                            </span>
                                            {multiSelect && (
                                                <span
                                                    className="ml-2 h-4 w-4 cursor-pointer rounded-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" || e.key === " ") {
                                                            handleRemove(value, e);
                                                        }
                                                    }}
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    }}
                                                    onClick={(e) => handleRemove(value, e)}
                                                    aria-label={`Remove ${option.label} from selection`}
                                                >
                                                    <XCircle className="h-3 w-3" />
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                                {maxCount && selectedValues.length > maxCount && (
                                    <Badge
                                        className={cn(
                                            "m-1 bg-yellow-500 hover:bg-yellow-500 text-foreground border-foreground/1",
                                            "[&>svg]:pointer-events-auto"
                                        )}
                                    >
                                        {`+ ${selectedValues.length - maxCount} more`}
                                        <XCircle
                                            className="ml-2 h-4 w-4 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Clear extra options
                                                const newValues = selectedValues.slice(0, maxCount);
                                                if (controlledValue === undefined) {
                                                    setInternalValue(newValues);
                                                }
                                                onValueChange(newValues);
                                            }}
                                        />
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                {selectedValues.length > 0 && (
                                    <>
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={handleClear}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    handleClear(e);
                                                }
                                            }}
                                            aria-label={`Clear all ${selectedValues.length} selected options`}
                                            className="flex items-center justify-center h-4 w-4 mx-2 cursor-pointer text-muted-foreground hover:text-white outline-none     "
                                        >
                                            <X className="h-4 w-4" />
                                        </div>
                                        <Separator
                                            orientation="vertical"
                                            className="flex min-h-6 h-full bg-primary"
                                        />
                                    </>
                                )}
                                <ChevronDown
                                    className="h-4 mx-2 cursor-pointer text-muted-foreground"
                                    aria-hidden="true"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between w-full mx-auto">
                            <span className="text-sm text-muted mx-3">{placeholder}</span>
                            <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
                        </div>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                ref={listboxRef}
                role="listbox"
                aria-multiselectable="true"
                aria-label="Available options"
                className={cn(
                    "w-auto p-0 bg-primary/30 backdrop-blur-sm rounded-2xl border-primary/80 min-w-[300px]",
                    "max-h-[60vh] overflow-hidden"
                )}
                align="start"
                onEscapeKeyDown={() => {
                    setOpen(false);
                    buttonRef.current?.focus();
                }}
            >
                {searchable && (
                    <div className="flex h-9 items-center gap-2 border-b border-primary pl-3 bg-primary/30">
                        <Search className="size-4 shrink-0 opacity-50 text-white" />
                        <Input
                            ref={searchInputRef}
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setSearchValue(newValue);
                                setFocusedIndex(-1); // Reset focus when searching
                                // Call parent's search handler if provided
                                if (onSearchChange) {
                                    onSearchChange(newValue);
                                }
                            }}
                            onKeyDown={handleSearchKeyDown}
                            className=" flex-1 h-full border-0  backdrop-blur-none  !bg-translate px-0 pr-2 py-3 text-sm outline-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full rounded-none !bg-transparent "
                            aria-label="Search options"
                        />
                    </div>
                )}
                <div className=" max-w-md relative ">
                    {
                        filter && (
                            <div className=" sticky top-0 z-10  p-1 ">

                                <ToggleGroup
                                    type="single"
                                    className="w-full h-8 !rounded-xl overflow-hidden  "
                                    value={filterValue || "SFW"}
                                    onValueChange={(value) => {
                                        if (value && setFilterValue) {
                                            setFilterValue(value as "SFW" | "NSFW");
                                        }
                                    }}
                                >
                                    <ToggleGroupItem
                                        value="SFW"
                                        aria-label="SFW"
                                        className="w-1/2 bg-primary/30 cursor-pointer text-white data-[state=on]:bg-primary data-[state=on]:text-white hover:bg-primary/30 hover:text-white "
                                    >
                                        SFW
                                    </ToggleGroupItem>

                                    <ToggleGroupItem
                                        value="NSFW"
                                        aria-label="NSFW"
                                        className="w-1/2 bg-primary/30 cursor-pointer text-white data-[state=on]:bg-primary data-[state=on]:text-white hover:bg-primary/30 hover:text-white "
                                    >
                                        NSFW
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </div>

                        )

                    }

                    <div className="p-1 max-h-[36vh] overflow-y-auto">

                        {isLoading ? (
                            // Loading skeleton - show 3-5 skeleton items
                            <div className="space-y-1">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <div
                                        key={`skeleton-${index}`}
                                        className="flex gap-3 items-center my-1 px-2 py-1.5 rounded-xl"
                                    >
                                        <Skeleton className="size-12 rounded-full bg-primary/30" />
                                        <div className="flex flex-col flex-1 gap-2">
                                            <Skeleton className="h-4 w-32 bg-primary/30" />
                                            <Skeleton className="h-3 w-48 bg-primary/30" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredOptions.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                {searchValue.trim()
                                    ? "No results found"
                                    : "No options available"}
                            </div>
                        ) : (
                            filteredOptions.map((option, index) => {
                                const isSelected = selectedValues.includes(option.value);
                                const isDisabled =
                                    (multiSelect && maxCount
                                        ? !isSelected && selectedValues.length >= maxCount
                                        : false) || option.disabled || false;
                                const isFocused = focusedIndex === index;

                                return (
                                    <div
                                        key={option.value}
                                        role="option"
                                        aria-selected={isSelected}
                                        aria-disabled={isDisabled}
                                        tabIndex={isFocused ? 0 : -1}
                                        onClick={() => !isDisabled && toggleOption(option.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                if (!isDisabled) {
                                                    toggleOption(option.value);
                                                }
                                            } else {
                                                handleKeyDown(e);
                                            }
                                        }}
                                        className={cn(
                                            "relative  flex my-1 cursor-pointer select-none items-center rounded-xl px-2 py-1.5 text-sm outline-none group",
                                            "hover:bg-accent/60 hover:text-accent-foreground",
                                            // "focus:bg-accent focus:text-accent-foreground",
                                            isSelected && "bg-accent",
                                            isDisabled && "cursor-not-allowed opacity-50",
                                            isFocused && "ring-2 ring-ring ring-offset-1"
                                        )}
                                    >
                                        <div className="flex-1">
                                            {renderItem ? renderItem(option) : defaultRenderItem(option)}
                                        </div>
                                    </div>
                                );
                            })

                        )}
                    </div>
                    {multiSelect && maxCount && (
                        <div className="border-t border-primary px-2 py-1.5 text-xs text-white text-center sticky bottom-0 ">
                            {selectedValues.length} / {maxCount} selected
                        </div>
                    )}
                    {selectedValues.length > 0 && (
                        <div className="border-t border-primary flex gap-1 items-center justify-between ">
                            <button
                                type="button"
                                onClick={handleClear}
                                className="flex-1 px-2 py-1.5 text-white text-sm hover:bg-accent outline-none rounded-none cursor-pointer"
                            >
                                Clear
                            </button>
                            <Separator
                                orientation="vertical"
                                className="flex min-h-6 h-full bg-primary"
                            />
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="flex-1 px-2 py-1.5 text-sm text-white hover:bg-accent outline-none  rounded-none cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>

            </PopoverContent>
        </Popover>
    );
};

export default CustomMultiSelect;
