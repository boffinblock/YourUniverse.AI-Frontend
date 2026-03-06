import { z } from "zod";

/**
 * A lightweight adapter to use Zod schemas with Formik's validationSchema prop.
 * This resolves type mismatches between different Zod versions and Formik.
 */
export function toFormikValidationSchema<T>(schema: z.ZodSchema<T>) {
    return {
        validate: async (values: any) => {
            try {
                await schema.parseAsync(values);
                return undefined;
            } catch (err) {
                if (err instanceof z.ZodError) {
                    const errors: Record<string, string> = {};
                    err.issues.forEach((issue) => {
                        const path = issue.path.join(".");
                        if (!errors[path]) {
                            errors[path] = issue.message;
                        }
                    });
                    return errors;
                }
                throw err;
            }
        },
    };
}
