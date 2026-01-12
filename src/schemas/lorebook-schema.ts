import { FormData } from "@/types/form-types";

export const lorebookSchema: FormData[] = [
    {
        name: "avatar",
        type: "file",
        required: true,
        cols: 12,
        row: 4,
        rows: "3",

    },
    {
        name: "lorebookName",
        type: "text",
        label: "Lorebook Name",
        required: true,
        placeholder: "Enter Lorebook Name",
        rules: {
            min: 4,
            max: 20
        },
        cols: 12,
        row: 4,
        rows: "3",

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
        cols: 4,
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
        cols: 4,
        row: 4,
        defaultValue: "SFW",
    },
    {
        name: "favourite",
        type: "checkbox",
        required: true,
        label: 'Add To Favourites',
        cols: 4,
        row: 4,
        // defaultValue: false,
    },
    // {
    //     name: "linkToCharacters",
    //     type: "select",
    //     required: true,
    //     label: "Link to Character",
    //     placeholder: "Link to Character",
    //     cols: 12,
    //     row: 4,
    //     rules: {
    //         options: [
    //             { label: "Luna AI", value: "luna-ai" },
    //             { label: "Astro Bot", value: "astro-bot" },
    //             { label: "Neo Guide", value: "neo-guide" },
    //             { label: "Zara Mentor", value: "zara-mentor" },
    //         ],
    //     },
    //     rows: "3",

    // },
    {
        name: "Characters",
        type: "form-link-to",
        required: false,
        label: "Select Characters",
        placeholder: "Connect to Characters",
        cols: 12,
        row: 4,
        rules: {
            model: "character",
            maxCount: 5,
            multiSelect: true,
        },
        rows: "3",

    },
    // {
    //     name: "connectToPersona",
    //     type: "select",
    //     required: true,
    //     label: "Link to Persona",
    //     placeholder: "Link to Persona",
    //     cols: 12,
    //     row: 4,
    //     rules: {
    //         options: [
    //             { label: "Luna AI", value: "luna-ai" },
    //             { label: "Astro Bot", value: "astro-bot" },
    //             { label: "Neo Guide", value: "neo-guide" },
    //             { label: "Zara Mentor", value: "zara-mentor" },
    //         ],
    //     },
    //     rows: "3",

    // },
    {
        name: "persona",
        type: "form-link-to",
        required: false,
        label: "Select Persona",
        placeholder: "Connect to Persona",
        cols: 12,
        row: 4,
        rules: {
            model: "persona",
            maxCount: 5,
            multiSelect: true,
        },
        rows: "3",

    },
    {
        name: "tags",
        type: "multi-select",
        label: "Tags",
        required: true,
        placeholder: "Single words describing your Lorebook",
        rules: {
            model: "tags"
        },
        cols: 12,
        row: 4,
        rows: "3",

    },
    {
        name: "entries",
        type: "entries",
        label: "Lorebook Entries",
        required: true,
        placeholder: "Add keywords and context for your lorebook",
        cols: 12,
        row: 4,
        rows: "3",
        tokens: true,
    },
    // {
    //     name: "context",
    //     type: "textarea",
    //     label: "Context",
    //     placeholder: "Write the content related to keywords",
    //     required: true,
    //     cols: 12,
    //     row: 4,
    //     rows: "3",

    //     tokens: true,
    // },
]