"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useField } from 'formik';
import { Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface EntriesFieldProps {
    name?: string;
}

interface Entry {
    keywords: string[];
    context: string;
}

const EntriesField: React.FC<EntriesFieldProps> = ({ name = 'entries' }) => {
    const [field, meta, helpers] = useField<Entry[]>(name);
    const { value } = field;
    const { setValue, setTouched } = helpers;
    // Initialize with empty entry if no value
    const getInitialEntries = useCallback((): Entry[] => {
        if (Array.isArray(value) && value.length > 0) {
            return value;
        }
        return [{ keywords: [], context: '' }];
    }, [value]);

    const [entries, setEntries] = useState<Entry[]>(getInitialEntries);

    // Store raw keyword input strings to allow free typing with commas
    const [keywordInputs, setKeywordInputs] = useState<Record<number, string>>(() => {
        const inputs: Record<number, string> = {};
        getInitialEntries().forEach((entry, index) => {
            inputs[index] = entry.keywords.join(', ');
        });
        return inputs;
    });

    // Sync with Formik value changes (external updates, including reset)
    useEffect(() => {
        // Handle reset case: when value is empty array or undefined, reset to single empty entry
        if (!value || (Array.isArray(value) && value.length === 0)) {
            const emptyEntry = [{ keywords: [], context: '' }];
            setEntries(emptyEntry);
            setKeywordInputs({ 0: '' });
            return;
        }

        // Handle normal value updates
        if (Array.isArray(value)) {
            const valueStr = JSON.stringify(value);
            const entriesStr = JSON.stringify(entries);

            // Check if value actually changed (deep comparison)
            if (valueStr !== entriesStr) {
                const newEntries = value.length > 0 ? value : [{ keywords: [], context: '' }];
                setEntries(newEntries);
                // Update keyword inputs
                const newInputs: Record<number, string> = {};
                newEntries.forEach((entry, index) => {
                    newInputs[index] = entry.keywords.join(', ');
                });
                setKeywordInputs(newInputs);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // Update Formik when entries change
    useEffect(() => {
        // Filter out completely empty entries
        const filteredEntries = entries.filter(
            (entry) => entry.keywords.length > 0 || entry.context.trim().length > 0
        );

        const filteredStr = JSON.stringify(filteredEntries);
        const valueStr = JSON.stringify(value);

        if (filteredStr !== valueStr) {
            setValue(filteredEntries.length > 0 ? filteredEntries : []);
            setTouched(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entries]);

    /**
     * Add a new entry
     */
    const handleAddEntry = () => {
        const newEntry: Entry = {
            keywords: [],
            context: '',
        };
        setEntries([...entries, newEntry]);
        // Add empty keyword input for new entry
        setKeywordInputs({ ...keywordInputs, [entries.length]: '' });
    };

    /**
     * Remove an entry by index
     */
    const handleRemoveEntry = (index: number) => {
        if (entries.length <= 1) {
            // Keep at least one empty entry
            setEntries([{ keywords: [], context: '' }]);
            setKeywordInputs({ 0: '' });
        } else {
            const newEntries = entries.filter((_, i) => i !== index);
            setEntries(newEntries);
            // Update keyword inputs indices
            const newInputs: Record<number, string> = {};
            newEntries.forEach((entry, i) => {
                newInputs[i] = entry.keywords.join(', ');
            });
            setKeywordInputs(newInputs);
        }
    };

    /**
     * Update keywords for an entry
     * Stores raw input string, converts to array only when syncing with Formik
     */
    const handleKeywordsChange = (index: number, keywordsString: string) => {
        // Update the raw input string (allows free typing with commas)
        setKeywordInputs({ ...keywordInputs, [index]: keywordsString });

        // Convert to array for storage (split by comma, trim spaces, filter out empty values)
        const keywords = keywordsString
            .split(',')
            .map((k) => k.trim())
            .filter(Boolean);

        // Update entries with converted array
        const updatedEntries = [...entries];
        updatedEntries[index] = {
            ...updatedEntries[index],
            keywords: keywords,
        };
        setEntries(updatedEntries);
    };

    /**
     * Update context for an entry
     */
    const handleContextChange = (index: number, contextValue: string) => {
        const updatedEntries = [...entries];
        updatedEntries[index] = {
            ...updatedEntries[index],
            context: contextValue,
        };
        setEntries(updatedEntries);
    };

    return (
        <div className='space-y-6'>
            {entries.map((entry, index) => {
                // Use raw input string if available, otherwise convert from array
                const keywordsString = keywordInputs[index] !== undefined
                    ? keywordInputs[index]
                    : entry.keywords.join(', ');

                return (
                    <div
                        key={index}
                        className='border backdrop-blur-sm border-primary rounded-2xl p-4 relative'
                    >
                        {/* Remove Entry Button - Top Right Corner */}
                        {entries.length > 1 && (
                            <Button
                                type='button'
                                onClick={() => handleRemoveEntry(index)}
                                variant="ghost"
                                size="icon"
                                className='absolute top-2 right-2 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10'
                                aria-label="Remove entry"
                            >
                                <Trash2 />
                            </Button>
                        )}

                        <div className=''>
                            <div className="w-full space-y-2">
                                <Label htmlFor={`${name}-${index}-keywords`}>
                                    Keywords or Terms
                                </Label>
                                <Input
                                    id={`${name}-${index}-keywords`}
                                    value={keywordsString}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleKeywordsChange(index, e.target.value)
                                    }
                                    placeholder="Please enter the Keyword or Term here. You can add multiple by separating them with a comma."
                                    className="w-full"
                                />
                                <div className="flex justify-between items-center text-xs px-1 text-white">
                                    <span className="invisible">placeholder</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full space-y-2">
                            <Label htmlFor={`${name}-${index}-context`}>
                                Context
                            </Label>
                            <Textarea
                                id={`${name}-${index}-context`}
                                value={entry.context}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    handleContextChange(index, e.target.value)
                                }
                                placeholder='Enter a short description about the keyword or term here. Please keep in mind the shorter the better.'
                                className="w-full"
                            />
                            <div className="flex justify-between items-center text-xs px-1 text-white">
                                <span className="invisible">placeholder</span>
                                <span>{entry.context.length} Tokens</span>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Add Entry Button - Bottom */}
            <Button
                type='button'
                onClick={handleAddEntry}
                variant="outline"
                className="w-full backdrop-blur-2xl mt-2 border-primary/50 hover:bg-primary/10 hover:border-primary transition-all"
            >
                <Plus className="h-4 w-4 mr-2" />
                Add New Entry
            </Button>
        </div>
    );
};

export default EntriesField;
