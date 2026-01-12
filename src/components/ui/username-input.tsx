"use client";

import React, { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { useDebouncedUsernameCheck } from "@/hooks/auth/use-debounced-username-check";
import { CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UsernameInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSuggestionSelect?: (suggestion: string) => void;
    minLength?: number;
    debounceMs?: number;
    disabled?: boolean;
    disableCheck?: boolean;
}

const UsernameInput: React.FC<UsernameInputProps> = ({
    value,
    onChange,
    onSuggestionSelect,
    minLength = 3,
    debounceMs = 500,
    disabled = false,
    disableCheck = false,
    className,
    ...props
}) => {
    const [touched, setTouched] = useState(false);

    const {
        data,
        isLoading,
        isError,
        isChecking,
    } = useDebouncedUsernameCheck({
        username: value,
        debounceMs,
        minLength,
        enabled: !disabled && !disableCheck, // Disable check when form is submitting or input is disabled
    });

    const isValid =
        !isLoading &&
            !isError &&
            data &&
            typeof data.available === "boolean"
            ? data.available
            : undefined;

    const suggestions = data?.suggestions || [];
    const errors = data?.errors || [];

    // Handle suggestion click
    const handleSuggestionClick = useCallback(
        (suggestion: string) => {
            const syntheticEvent = {
                target: { value: suggestion },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
            if (onSuggestionSelect) {
                onSuggestionSelect(suggestion);
            }
        },
        [onChange, onSuggestionSelect]
    );

    // Status message component
    const StatusMessage = useCallback(() => {
        if (!touched || !value || value.length < minLength) {
            return null;
        }

        if (isChecking || isLoading) {
            return (
                <div className="flex items-center gap-1.5 text-muted text-xs">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Checking username...</span>
                </div>
            );
        }

        if (isError) {
            return (
                <div className="flex items-center gap-1.5 text-destructive text-xs">
                    <AlertCircle className="h-3 w-3" />
                    <span>Error checking username. Please try again.</span>
                </div>
            );
        }

        // Show format errors if present
        if (errors.length > 0) {
            return (
                <div className="space-y-1">
                    {errors.map((error, index) => (
                        <div key={index} className="flex items-center gap-1.5 text-destructive text-xs">
                            <XCircle className="h-3 w-3" />
                            <span>{error}</span>
                        </div>
                    ))}
                </div>
            );
        }

        if (isValid === false) {
            return (
                <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-destructive text-xs">
                        <XCircle className="h-3 w-3" />
                        <span>Username is already taken</span>
                    </div>
                    {suggestions.length > 0 && (
                        <div className="space-y-1.5">
                            <p className="text-xs text-muted-foreground">Suggestions:</p>
                            <div className="flex flex-wrap gap-1.5">
                                {suggestions.map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className={cn(
                                            "px-2 py-1 text-xs rounded-md border transition-colors",
                                            "bg-primary/20 border-primary/50 text-primary",
                                            "hover:bg-primary/30 hover:border-primary",
                                            "focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        )}
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        if (isValid === true) {
            return (
                <div className="flex items-center gap-1.5 text-green-500 text-xs">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Username is available</span>
                </div>
            );
        }

        return null;
    }, [isLoading, isChecking, isError, isValid, value, touched, minLength, suggestions, errors, handleSuggestionClick]);

    return (
        <div className="w-full flex flex-col gap-2 ">
            <div className="relative">
                <Input
                    type="text"
                    autoComplete="username"
                    spellCheck={false}
                    value={value}
                    onChange={onChange}
                    onBlur={() => setTouched(true)}
                    aria-invalid={!!(touched && isValid === false)}
                    minLength={minLength}
                    maxLength={30}
                    placeholder="Choose a username"
                    disabled={disabled}
                    className={cn(
                        className,
                        touched &&
                        value.length >= minLength &&
                        isValid === false &&
                        "border-destructive focus-visible:border-destructive bg-destructive/20",
                        touched &&
                        value.length >= minLength &&
                        isValid === true &&
                        "border-green-500/50 focus-visible:border-green-500"
                    )}
                    {...props}
                />
                {/* Status icon overlay */}
                {touched && value.length >= minLength && !isChecking && !isLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isValid === true && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                        {isValid === false && (
                            <XCircle className="h-4 w-4 text-destructive" />
                        )}
                    </div>
                )}
                {isChecking && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 text-muted animate-spin" />
                    </div>
                )}
            </div>
            <StatusMessage />
        </div>
    );
};

export default UsernameInput;