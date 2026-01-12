import { z } from "zod";

/**
 * Forgot Password Form Validation Schema
 */
const preprocessString = (val: unknown) => (val === null || val === undefined ? "" : String(val));

export const forgotPasswordSchema = z.object({
  email: z
    .preprocess(preprocessString, z.string().min(1, "Email is required").email("Please enter a valid email address").trim().toLowerCase()),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

