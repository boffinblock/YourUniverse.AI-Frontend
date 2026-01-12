import { z } from "zod";

/**
 * Resend Verification Email Form Validation Schema
 */
const preprocessString = (val: unknown) => (val === null || val === undefined ? "" : String(val));

export const resendVerificationSchema = z.object({
    email: z
        .preprocess(
            preprocessString,
            z
                .string()
                .min(1, "Email is required")
                .email("Please enter a valid email address")
                .trim()
                .toLowerCase()
        ),
});

export type ResendVerificationFormValues = z.infer<typeof resendVerificationSchema>;

