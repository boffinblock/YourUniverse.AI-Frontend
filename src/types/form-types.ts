
export type FieldType =
    | "text"
    | "textarea"
    | "file"
    | "select"
    | "multi-entries"
    | "radio"
    | "checkbox"
    | "multi-select"
    | "switch"
    | "toggle"
    | "email"
    | "entries"
    | "multiple-file"
    | "example-dialogues"
    |"form-link-to"


export interface FormToggleOptions {
    label: string;
    value: string
}

export interface FieldRules {
    min?: number;
    max?: number;
    accept?: string[];
    options?: FormToggleOptions[];
    model?: string;
    field?: string;
    multiSelect?: boolean;
    maxCount?: number;
}

export interface FormData {
    name: string;
    type: FieldType;
    label?: string;
    placeholder?: string;
    required?: boolean;
    multiple?: boolean;
    value?: string | number | boolean | string[];
    help?: string;
    rules?: FieldRules;
    row?: number;
    cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    rows?: string;
    defaultValue?: string | string[] | boolean | undefined;
    tokens?: boolean
    disabled?: boolean
}
