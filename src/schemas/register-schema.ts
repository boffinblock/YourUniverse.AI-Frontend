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
                return String(val).trim();
            },
            z
                .string()
                .optional()
                .refine(
                    (val) => {
                        if (!val) return true;
                        // E.164 format validation: + followed by country code and number
                        return /^\+[1-9]\d{1,14}$/.test(val);
                    },
                    {
                        message: "Phone number must be in E.164 format (e.g., +1234567890)",
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
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

/**
 * Type inference from schema
 */
export type RegisterFormValues = z.infer<typeof registerSchema>;

