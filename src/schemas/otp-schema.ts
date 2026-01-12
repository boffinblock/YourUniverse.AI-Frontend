import { z } from "zod";

/**
 * OTP Verification Form Validation Schema
 */
const preprocessString = (val: unknown) => (val === null || val === undefined ? "" : String(val));

export const otpSchema = z.object({
  code: z
    .preprocess(preprocessString, z.string()
      .length(6, "OTP code must be 6 digits")
      .regex(/^\d{6}$/, "OTP code must be numeric and 6 digits long")),
});

export type OtpFormValues = z.infer<typeof otpSchema>;

