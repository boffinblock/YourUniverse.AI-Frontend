"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import PasswordField from "@/components/elements/form-elements/password-field";
import { Loader2, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toFormikValidationSchema } from "@/lib/zod-adapter";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/schemas/reset-password-schema";
import { useResetPassword } from "@/hooks";
import type { ResetPasswordRequest } from "@/lib/api/auth";

interface ResetPasswordFormProps {
    token: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
    const {
        resetPassword,
        isLoading,
        isSuccess,
    } = useResetPassword({
        showToasts: true,
        redirectOnSuccess: true,
        redirectPath: "/sign-in",
    });

    const handleSubmit = (values: ResetPasswordFormValues) => {
        const resetPasswordData: ResetPasswordRequest = {
            token: token,
            password: values.password,
        };
        resetPassword(resetPasswordData);
    };

    const initialValues: ResetPasswordFormValues = {
        password: "",
        confirmPassword: "",
    };

    return (
        <div className="w-full max-w-2xl">
            <div className="relative w-full h-50">
                <Image
                    src="/logo/logo.png"
                    alt="universe-logo"
                    fill
                    priority
                    className="object-contain"
                />
            </div>

            {/* Card */}
            <Card className="px-6 py-8 text-center border-none bg-transparent backdrop-blur-none w-full space-y-4">
                {/* Header */}
                {/* <div>
                    <h2 className="text-2xl font-semibold text-white/90">
                        Reset Password
                    </h2>
                    <p className="text-sm text-muted">
                        Enter your new password below.
                    </p>
                </div> */}

                {/* Success State */}
                {isSuccess && (
                    <div className="flex flex-col items-center gap-4 py-6">
                        <div className="rounded-full bg-green-500/20 p-4">
                            <CheckCircle2 className="h-12 w-12 text-green-500" />
                        </div>
                        <div className="space-y-2 text-center">
                            <h3 className="text-lg font-semibold text-white">
                                Password Reset Successful
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Your password has been reset successfully. Redirecting to sign in...
                            </p>
                        </div>
                    </div>
                )}

                {/* Form */}
                {!isSuccess && (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={toFormikValidationSchema(resetPasswordSchema)}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, values }) => (
                            <Form className="space-y-6">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2 text-left">
                                        <Label htmlFor="password">New Password</Label>
                                        <Field name="password">
                                            {({ field, meta }: any) => (
                                                <>
                                                    <PasswordField
                                                        {...field}
                                                        id="password"
                                                        name="password"
                                                        placeholder="Enter your new password"
                                                        value={field.value || ""}
                                                        autoComplete="new-password"
                                                        className={
                                                            meta.touched && meta.error
                                                                ? "border-destructive focus-visible:border-destructive bg-destructive/20"
                                                                : ""
                                                        }
                                                    />
                                                    {meta.touched && meta.error && (
                                                        <div className="text-xs text-destructive text-left px-1">
                                                            {meta.error}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </Field>
                                    </div>

                                    <div className="space-y-2 text-left">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Field name="confirmPassword">
                                            {({ field, meta }: any) => (
                                                <>
                                                    <PasswordField
                                                        {...field}
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        placeholder="Confirm your new password"
                                                        value={field.value || ""}
                                                        autoComplete="new-password"
                                                        className={
                                                            meta.touched && meta.error
                                                                ? "border-destructive focus-visible:border-destructive bg-destructive/20"
                                                                : ""
                                                        }
                                                    />
                                                    {meta.touched && meta.error && (
                                                        <div className="text-xs text-destructive text-left px-1">
                                                            {meta.error}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </Field>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Resetting Password...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="mr-2 h-4 w-4" />
                                            Reset Password
                                        </>
                                    )}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                )}

                {/* Actions */}
                <div className="space-y-3 pt-4">
                    {!isSuccess && (
                        <Link href="/sign-in">
                            <Button variant="ghost" className="w-full">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Sign In
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Help */}
                <div className="pt-4">
                    <p className="text-xs text-muted-foreground text-center">
                        Remember your password?{" "}
                        <Link
                            href="/sign-in"
                            className="text-primary underline hover:text-primary/80"
                        >
                            Sign in here
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default ResetPasswordForm;
