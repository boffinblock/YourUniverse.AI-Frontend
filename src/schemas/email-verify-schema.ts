import { FormData } from "@/types/form-types";

export const emailVerifySchema: FormData[] = [
    {
        name: "Email",
        type: "text",
        required: true,
        label:"Email",
        placeholder:"Enter your email",
        cols: 12,
        row: 4,
        rows: "3",
        
    }
]    