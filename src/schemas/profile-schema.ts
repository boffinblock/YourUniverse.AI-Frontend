import { FormData } from "@/types/form-types";

export const profileSchema: FormData[] = [
    {
        name: "avatar",
        type: "file",
        required: true,
        cols: 12,
        row: 4,
        rows: "3",
        label: "Avatar"

    },
    {
        name: "username",
        type: "text",
        label: "Username",
        required: false,
        placeholder: "john123",
        disabled: true,
        cols: 12,
        row: 4,
        rows: "3",
        defaultValue: "hello"

    },
    {
        name: "email",
        type: "text",
        label: "Email",
        required: false,
        placeholder: "john@gmail.com",
        cols: 12,
        disabled: true,
        row: 4,
        rows: "3",
        defaultValue: "ben10@gmail.com"

    },
    {
        name: "visiable",
        type: "toggle",
        required: true,
        rules: {
            options: [
                { label: "Private", value: "private" },
                { label: "Public", value: "public" },
            ],
        },
        cols: 3,
        row: 4,
        defaultValue: "private",
    },
    {
        name: "rating",
        type: "toggle",
        required: true,
        rules: {
            options: [
                { label: "NSFW", value: "NSFW" },
                { label: "SFW", value: "SFW" },],
        },
        cols: 3,
        row: 4,
        defaultValue: "SFW",
    },
    {
        name: "theme",
        type: "select",
        required: true,
        placeholder: "Choose your theme",
        cols: 6,
        row: 4,
        rules: {
            options: [
                { label: "Dark Purple", value: "dark-purple" },
                { label: "White", value: "white" },
                { label: "Yellow", value: "yellow" },
            ],
        },
        rows: "3",

    },
 {
    name: "fontStyle",
    type: "select",
    required: true,
    placeholder: "Font Style",
    cols: 4,
    row: 4,
    rules: {
        options: [
            { label: "Serif", value: "serif" },
            { label: "Sans Serif", value: "sans-serif" },
            { label: "Monospace", value: "monospace" },
        ],
    },
    rows: "3",
},
{
    name: "fontSize",
    type: "select",
    required: true,
    placeholder: "Font Size",
    cols: 4,
    row: 4,
    rules: {
        options: [
            { label: "Small (12px)", value: "12" },
            { label: "Medium (16px)", value: "16" },
            { label: "Large (20px)", value: "20" },
        ],
    },
    rows: "3",
},
{
    name: "language",
    type: "select",
    required: true,
    placeholder: "Language",
    cols: 4,
    row: 4,
    rules: {
        options: [
            { label: "English", value: "en" },
            { label: "Hindi", value: "hi" },
            { label: "Spanish", value: "es" },
        ],
    },
    rows: "3",
},
    
    {
        name: "tags",
        type: "multi-select",
        label: "Tags To follow",
        required: true,
        placeholder: "Tags to follow",
        rules: {
            model: "tags"
        },
        cols: 12,
        row: 4,
        rows: "3",

    },
    {
        name: "tag-to-avoid",
        type: "multi-select",
        label: "Tags To avoid",
        required: true,
        placeholder: "Tags To Avoid",
        rules: {
            model: "tags"
        },
        cols: 12,
        row: 4,
        rows: "3",

    },

    {
        name: "aboutme",
        type: "textarea",
        label: "About Me",
        required: true,
        cols: 12,
        row: 4,
        rows: "3",
        placeholder: "Write something about yourself",
        tokens: false,
    },
    {
        name: "following",
        type: "text",
        label: "Following",
        placeholder: "Enter topics or creators you’re currently following",
        required: true,
        disabled: true,
        cols: 12,
        row: 4,
        rows: "3",
        tokens: false,
    },
    {
        name: "plan",
        label: "Subscription Plan",
        type: "select",
        required: true,
        placeholder: "Choose your subscription plan",
        cols: 12,
        row: 4,
        rules: {
            options: [
                { label: "Adventurer (Free)", value: "adventurer" },
                { label: "Explorer (Monthly)", value: "explorer" },
                { label: "Voyager (Yearly)", value: "voyager" },
                { label: "Pioneer", value: "pioneer" },
            ],
        },
        rows: "3",
    }
]