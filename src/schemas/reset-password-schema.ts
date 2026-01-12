import { z } from "zod";

/**
 * Reset Password Form Validation Schema
 */
const preprocessString = (val: unknown) => (val === null || val === undefined ? "" : String(val));

export const resetPasswordSchema = z
  .object({
    password: z
      .preprocess(preprocessString, z.string().min(8, "Password must be at least 8 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)"
        )),

    confirmPassword: z
      .preprocess(preprocessString, z.string().min(1, "Please confirm your password")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

