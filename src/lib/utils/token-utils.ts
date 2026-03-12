/**
 * Utility for counting tokens in character cards.
 * Currently using a simple character-count-based estimation as a placeholder,
 * but can be replaced with a proper tokenizer (like gpt-3-encoder) if needed.
 */

export const countTokens = (text: string | null | undefined): number => {
    if (!text) return 0;
    // Requirement: 1 token = 4 characters
    return Math.ceil(text.length / 4);
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
            if (field.type === 'entries') {
                // Entries have keywords and context
                value.forEach((entry: any) => {
                    // Assuming context is what matters for tokens here
                    total += countTokens(entry.context);
                    // Also maybe keywords?
                    if (entry.keywords && Array.isArray(entry.keywords)) {
                        total += countTokens(entry.keywords.join(', '));
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
