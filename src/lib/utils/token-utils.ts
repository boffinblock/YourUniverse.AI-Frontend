/**
 * Utility for counting tokens in character cards.
 * Currently using a simple character-count-based estimation as a placeholder,
 * but can be replaced with a proper tokenizer (like gpt-3-encoder) if needed.
 */

export const countTokens = (text: string | null | undefined): number => {
    if (!text) return 0;
    // For now, using character length as "tokens" to match current UI components.
    // In many AI communities, 1 token is roughly 4 characters.
    // If you want a more accurate words-based estimation: Math.ceil(text.split(/\s+/).length * 1.3)
    return text.length;
};

export const calculateTotalTokens = (values: Record<string, any>, schema: any[]): number => {
    let total = 0;

    schema.forEach(field => {
        if (!field.tokens) return;

        const value = values[field.name];
        if (!value) return;

        if (typeof value === 'string') {
            total += countTokens(value);
        } else if (Array.isArray(value)) {
            // Handle specialized fields
            if (field.type === 'multi-entries') {
                // Entries have keywords and context
                value.forEach((entry: any) => {
                    // Assuming context is what matters for tokens here
                    total += countTokens(entry.context);
                    // Also maybe keywords?
                    if (entry.keywords && Array.isArray(entry.keywords)) {
                        total += entry.keywords.join(', ').length;
                    }
                });
            } else if (field.type === 'example-dialogues') {
                value.forEach((dialogue: any) => {
                    total += countTokens(String(dialogue));
                });
            } else if (field.type === 'multi-select' || field.type === 'multiple-file') {
                // Not usually contributing to character tokens in the same way, 
                // but if they did we'd sum them.
            } else {
                // Generic array of strings
                value.forEach(item => {
                    if (typeof item === 'string') total += countTokens(item);
                });
            }
        }
    });

    return total;
};
