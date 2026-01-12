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
import { toFormikValidationSchema } from "zod-formik-adapter";
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
        <div className="flex justify-center items-center min-h-screen p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Logo */}
                <div className="relative w-full h-50 mb-6">
                    <Image
                        src="/logo/logo.png"
                        alt="Logo"
                        fill
                        priority
                        className="object-contain"
                    />
                </div>

                {/* Card */}
                <Card className="px-6 py-8 bg-primary/20 space-y-6">
                    {/* Header */}
                    <div className="space-y-2 text-center">
                        <h2 className="text-2xl font-semibold text-white/90">
                            Reset Password
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Enter your new password below.
                        </p>
                    </div>

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
                                <Form className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">New Password</Label>
                                        <Field
                                            as={PasswordField}
                                            id="password"
                                            name="password"
                                            placeholder="Enter your new password"
                                            value={values.password || ""}
                                            autoComplete="new-password"
                                            className={
                                                touched.password && errors.password
                                                    ? "border-destructive bg-destructive/30 focus-visible:border-destructive"
                                                    : ""
                                            }
                                        />
                                        <ErrorMessage
                                            name="password"
                                            component="div"
                                            className="text-xs text-destructive text-left"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Field
                                            as={PasswordField}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            placeholder="Confirm your new password"
                                            value={values.confirmPassword || ""}
                                            autoComplete="new-password"
                                            className={
                                                touched.confirmPassword && errors.confirmPassword
                                                    ? "border-destructive bg-destructive/30 focus-visible:border-destructive"
                                                    : ""
                                            }
                                        />
                                        <ErrorMessage
                                            name="confirmPassword"
                                            component="div"
                                            className="text-xs text-destructive text-left"
                                        />
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
        </div>
    );
};

export default ResetPasswordForm;
