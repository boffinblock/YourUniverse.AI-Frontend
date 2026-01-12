import { z } from "zod";

/**
 * Login Form Validation Schema
 * Validates user login data according to API requirements
 */
const preprocessString = (val: unknown) => (val === null || val === undefined ? "" : String(val));

export const loginSchema = z.object({
    identifier: z
        .preprocess(preprocessString, z.string().min(1, "Email or username is required").trim()),

    password: z
        .preprocess(preprocessString, z.string().min(1, "Password is required")),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

