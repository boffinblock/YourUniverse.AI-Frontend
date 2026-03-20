import { z } from "zod";

/**
 * Registration Form Validation Schema
 * Validates user registration data according to API requirements
 */
export const registerSchema = z
    .object({
        name: z.preprocess(
            (val) => (val === undefined || val === null ? "" : String(val)),
            z.string().min(1, "Name is required").trim()
        ),

        username: z.preprocess(
            (val) => (val === undefined || val === null ? "" : String(val)),
            z
                .string()
                .min(3, "Username must be at least 3 characters")
                .max(30, "Username must be less than 30 characters")
                .regex(
                    /^[a-zA-Z0-9_-]+$/,
                    "Username can only contain letters, numbers, underscores, and hyphens"
                )
                .trim()
        ),

        email: z.preprocess(
            (val) => (val === undefined || val === null ? "" : String(val)),
            z
                .string()
                .min(1, "Email is required")
                .email("Please enter a valid email address")
                .trim()
                .toLowerCase()
        ),

        phoneNumber: z.preprocess(
            (val) => {
                if (val === undefined || val === null || val === "") return undefined;
                const digitsOnly = String(val).replace(/\D/g, "");
                return digitsOnly.length > 0 ? digitsOnly : undefined;
            },
            z
                .string()
                .optional()
                .refine(
                    (val) => {
                        if (!val) return true;
                        // Simple phone number validation: digits only, no country-code syntax required.
                        return /^\d{7,15}$/.test(val);
                    },
                    {
                        message: "Enter a valid phone number",
                    }
                )
        ),

        password: z.preprocess(
            (val) => (val === undefined || val === null ? "" : String(val)),
            z
                .string()
                .min(8, "Password must be at least 8 characters")
                .regex(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)"
                )
        ),

        confirmPassword: z.preprocess(
            (val) => (val === undefined || val === null ? "" : String(val)),
            z.string().min(1, "Please confirm your password")
        ),

        birthDate: z.preprocess(
            (val) => (val === undefined || val === null ? "" : String(val)),
            z
                .string()
                .min(1, "Date of birth is required")
                .refine((val) => {
                    const date = new Date(val);
                    const today = new Date();
                    const ageCutoff = new Date(
                        today.getFullYear() - 18,
                        today.getMonth(),
                        today.getDate()
                    );
                    return date <= ageCutoff;
                }, "Age must be 18+ to register")
        ),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

/**
 * Type inference from schema
 */
export type RegisterFormValues = z.infer<typeof registerSchema>;

