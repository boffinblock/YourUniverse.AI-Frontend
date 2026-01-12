/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import { FormData } from "@/types/form-types";
import { buildZodSchema, buildInitialValues } from "@/utils/build-zod-schema";
import { Formik, Form } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Button } from "@/components/ui/button";
import FormFields from "./fields";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface DynamicFormProps {
    schema: FormData[];
    initialValues?: Record<string, any>;
    onSubmit: (values: any) => void;
    children?: React.ReactNode;
    button?: boolean;
    submitButtonText?: string;
    isSubmitting?: boolean;
    submitButtonDisabled?: boolean;
    /**
     * Key to force Formik to reinitialize when it changes
     * Useful when initialValues change after component mount
     */
    formKey?: string | number;
    /**
     * Ref to access Formik form instance for external reset
     */
    formRef?: React.MutableRefObject<{ resetForm: () => void } | null>;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
    schema,
    initialValues,
    onSubmit,
    children,
    button = true,
    submitButtonText = "Save",
    isSubmitting = false,
    submitButtonDisabled = false,
    formKey,
    formRef,
}) => {
    const validationSchema = buildZodSchema(schema);
    const defaultValues = buildInitialValues(schema);

    // Merge default values with provided initial values
    const mergedInitialValues = useMemo(() => {
        return { ...defaultValues, ...(initialValues || {}) };
    }, [defaultValues, initialValues]);

    // Split schema once
    const fileFields = schema.filter((field) => field.type === "file");
    const otherFields = schema.filter((field) => field.type !== "file");
    return (
        <Formik
            key={formKey}
            initialValues={mergedInitialValues}
            validationSchema={toFormikValidationSchema(validationSchema)}
            enableReinitialize={true}
            validateOnChange={false}
            validateOnBlur={true}
            onSubmit={onSubmit}
            innerRef={(formik) => {
                // Expose resetForm method via ref
                if (formRef && formik) {
                    formRef.current = {
                        resetForm: () => formik.resetForm({ values: defaultValues }),
                    };
                }
            }}
        >
            {
                ({ handleSubmit }) => (
                    <Form
                        className="grid grid-cols-12 gap-3"
                        noValidate
                        onSubmit={handleSubmit}
                    >
                        {fileFields.length > 0 && <div className="col-span-2 flex flex-col gap-y-3">
                            {fileFields.map((field, index) => (
                                <FormFields key={index} {...field} cols={12} />
                            ))}
                        </div>}

                        <div className={cn(" grid grid-cols-12 gap-4", fileFields.length <= 0 ? "col-span-12" : "col-span-10")}>
                            {otherFields.map((field, index) =>
                                index === 0 ? (
                                    <div key={index} className="col-span-12 flex gap-x-3">
                                        <div className="flex-1">
                                            <FormFields {...field} />
                                        </div>
                                        {children && <div className="pt-5.5">{children}</div>}
                                    </div>
                                ) : (
                                    <FormFields key={index} {...field} />
                                )
                            )}
                        </div>

                        {button && <div className="col-span-12 flex justify-end">
                            <Button
                                type="submit"
                                disabled={isSubmitting || submitButtonDisabled}
                            >
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {submitButtonText}
                            </Button>
                        </div>}
                    </Form>
                )
            }
        </Formik>
    );
};

export default DynamicForm;
