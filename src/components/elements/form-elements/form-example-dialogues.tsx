"use client";

import React, { useEffect, useCallback, useMemo } from 'react';
import { useField } from 'formik';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface FormExampleDialoguesProps {
    name: string;
    label?: string;
    placeholder?: string;
    tokens?: boolean;
    className?: string;
    required?: boolean;
    defaultValue?: string[];
}

/**
 * FormExampleDialogues Component
 * 
 * A simple form field that takes comma-separated input and converts it to an array.
 * Each comma-separated value becomes a separate item in the array.
 * Each dialogue is formatted with <START> prefix.
 * 
 * Example Input: "<start> hello there i am test , <start> ok by"
 * Output: ["<START>\nhello there i am test", "<START>\nok by"]
 */
const FormExampleDialogues: React.FC<FormExampleDialoguesProps> = ({
    name,
    label,
    placeholder = "Enter dialogues separated by commas. Each dialogue will start with <START>.",
    tokens = true,
    className = "",
    required = false,
    defaultValue = [],
    ...props
}) => {
    const [field, meta, helpers] = useField<string[]>(name);
    const { value } = field;
    const { setValue, setTouched } = helpers;

    /**
     * Parse comma-separated string into array of dialogues
     * Each dialogue gets <START> prefix
     * 
     * Example: "<START> hello there i am test , <START> ok by"
     * Output: ["<START>\nhello there i am test", "<START>\nok by"]
     */
    const parseInputToArray = useCallback((input: string): string[] => {
        if (!input.trim()) return [];

        // Normalize line endings (\r\n -> \n)
        const normalizedInput = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        // Split by comma
        const parts = normalizedInput.split(',').map(part => part.trim()).filter(part => part.length > 0);

        return parts.map(part => {
            const trimmedPart = part.trim();
            if (!trimmedPart) return '';

            // Check if part starts with <START> (case-insensitive)
            // Handle formats: "<START> content", "<start> content", "<START>\ncontent"
            const startMatch = trimmedPart.match(/^<start>\s+/i);

            if (startMatch) {
                // Already has <START>, extract content after it
                const content = trimmedPart.substring(startMatch[0].length).trim();
                return content ? `<START>\n${content}` : '';
            }

            // No <START> tag, add it
            return `<START>\n${trimmedPart}`;
        }).filter(item => item.length > 0); // Remove empty items
    }, []);

    /**
     * Convert array back to comma-separated string for display
     * Keeps <START> prefix visible in the field for editing
     */
    const arrayToDisplayString = useCallback((arr: string[]): string => {
        if (!Array.isArray(arr) || arr.length === 0) return '';

        return arr
            .map(dialogue => {
                if (!dialogue.trim()) return '';

                // Normalize line endings and preserve <START> format
                // Handle both \r\n and \n line endings
                const normalized = dialogue.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
                const lines = normalized.split('\n').map(line => line.trim()).filter(line => line.length > 0);

                if (lines.length > 0 && lines[0].toUpperCase() === '<START>') {
                    // Has <START>, format as "<START> content" for display
                    const content = lines.slice(1).join('\n').trim();
                    return content ? `<START> ${content}` : '';
                }

                // No <START>, return as is
                return dialogue.trim();
            })
            .filter(content => content.length > 0)
            .join(', ');
    }, []);

    // Initialize display value from Formik value or defaultValue
    const getInitialDisplayValue = useCallback((): string => {
        if (Array.isArray(value) && value.length > 0) {
            return arrayToDisplayString(value);
        }
        if (Array.isArray(defaultValue) && defaultValue.length > 0) {
            return arrayToDisplayString(defaultValue);
        }
        return '';
    }, [value, defaultValue, arrayToDisplayString]);

    // State for display value (comma-separated string)
    const [displayValue, setDisplayValue] = React.useState<string>(getInitialDisplayValue);

    // Sync display value when Formik value changes externally (e.g., initialValues update)
    useEffect(() => {
        const newDisplayValue = getInitialDisplayValue();
        // Only update if user is not currently typing in this field
        if (document.activeElement?.id !== name && newDisplayValue !== displayValue) {
            setDisplayValue(newDisplayValue);
        }
    }, [value, getInitialDisplayValue, name, displayValue]);

    /**
     * Handle input change
     * Auto-add <START> if field is empty, then parse to array
     */
    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputValue = e.target.value;
        let processedValue = inputValue;

        // If field is empty and user starts typing, auto-add <START>
        if (!displayValue.trim() && inputValue.trim() && !inputValue.toUpperCase().startsWith('<START>')) {
            processedValue = `<START> ${inputValue}`;
            // Update cursor position after <START>
            setTimeout(() => {
                const textarea = e.target;
                const newPosition = `<START> `.length + inputValue.length;
                textarea.setSelectionRange(newPosition, newPosition);
            }, 0);
        }

        // Update display value immediately for responsive UI
        setDisplayValue(processedValue);

        // Parse comma-separated input to array
        const arrayValue = parseInputToArray(processedValue);

        // Update Formik
        setValue(arrayValue);
        setTouched(true);
    }, [parseInputToArray, setValue, setTouched, displayValue]);

    // Calculate total token count
    const tokenCount = useMemo(() => {
        if (!Array.isArray(value)) return 0;
        return value.reduce((acc, dialogue) => acc + (dialogue?.length || 0), 0);
    }, [value]);

    // Get validation error
    const fieldError = meta.touched && meta.error ? meta.error : '';
    const hasError = !!fieldError;

    return (
        <div className={cn("w-full space-y-2", className)}>
            {label && (
                <Label
                    htmlFor={name}
                    className={cn(hasError && "text-destructive")}
                >
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </Label>
            )}

            <Textarea
                id={name}
                value={displayValue}
                onChange={handleChange}
                onKeyDown={(e) => {
                    // Auto-insert <START> when comma is pressed
                    if (e.key === ',') {
                        const textarea = e.currentTarget;
                        const cursorPosition = textarea.selectionStart;
                        const value = textarea.value;

                        // Check if <START> is not already after this comma
                        const textAfterCursor = value.substring(cursorPosition).trim();
                        if (!textAfterCursor.toUpperCase().startsWith('<START>')) {
                            // Insert <START> after comma
                            e.preventDefault();
                            const beforeCursor = value.substring(0, cursorPosition);
                            const afterCursor = value.substring(cursorPosition);
                            const newValue = beforeCursor + ', <START> ' + afterCursor;

                            // Update the value
                            setDisplayValue(newValue);

                            // Update Formik
                            const arrayValue = parseInputToArray(newValue);
                            setValue(arrayValue);
                            setTouched(true);

                            // Set cursor position after <START>
                            setTimeout(() => {
                                const newPosition = cursorPosition + ', <START> '.length;
                                textarea.setSelectionRange(newPosition, newPosition);
                            }, 0);
                        }
                    }
                }}
                placeholder={placeholder}
                className={cn(
                    "min-h-[100px]",
                    hasError && "border-destructive bg-destructive/20 focus-visible:border-destructive"
                )}
            />

            <div className="flex justify-between items-center text-xs px-1">
                <span
                    id={`${name}-error`}
                    className={cn(
                        "text-destructive",
                        hasError ? "visible" : "invisible"
                    )}
                >
                    {fieldError || "placeholder"}
                </span>
                {tokens && (
                    <span className={cn(hasError && "text-destructive")}>
                        Total: {tokenCount} tokens
                    </span>
                )}
            </div>
        </div>
    );
};

export default FormExampleDialogues;
