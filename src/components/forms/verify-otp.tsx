"use client"
import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowLeft, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { otpSchema } from '@/schemas/otp-schema'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useResendOtp, useVerifyOtp } from '@/hooks'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp'

type VerifyOtpRequest = {
    userId: string
    code: string
}

type OtpFormValues = {
    code: string
}

type VerifyOtpProps = {
    userId: string
}

const VerifyOtp: React.FC<VerifyOtpProps> = ({ userId }) => {
    const {
        verify,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useVerifyOtp({
        showToasts: true,
        redirectOnSuccess: true,
        redirectPath: "/",
    });

    const {
        resend,
        isLoading: isResending,
    } = useResendOtp({
        showToasts: true,
    });

    /**
     * Form submission handler
     */
    const handleSubmit = async (values: OtpFormValues) => {
        const verifyOtpData: VerifyOtpRequest = {
            userId: userId,
            code: String(values.code),
        };

        verify(verifyOtpData);
    };

    /**
     * Handle resend OTP
     */
    const handleResendOtp = () => {
        if (userId) {
            resend({ userId });
        }
    };

    /**
     * Initial form values
     */
    const initialValues: OtpFormValues = {
        code: "",
    };

    // Helper function to safely extract error message as string
    const getErrorMessage = (): string => {
        if (!error) return "OTP verification failed. Please try again.";

        // Handle string error
        if (typeof error === "string") return error;

        // Handle object error with message property
        if (error && typeof error === "object") {
            if (typeof (error as any).message === "string") return (error as any).message;
            if (typeof (error as any).error === "string") return (error as any).error;
            // If error has code and message, extract message
            if ("code" in error && "message" in error && typeof (error as any).message === "string") {
                return (error as any).message;
            }
        }

        return "OTP verification failed. Please try again.";
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <div className="w-full max-w-md">
                {/* Logo Section */}
                <div className="relative w-full h-50 mb-6">
                    <Image
                        src="/logo/logo.png"
                        alt="universe-logo"
                        fill
                        priority
                        className="object-contain"
                    />
                </div>

                {/* OTP Verification Card */}
                <Card className="px-6 py-8 text-center bg-primary/20 space-y-6">
                    {/* Header */}
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold text-white/90">
                            OTP Verification
                        </h2>
                        {/* <p className="text-sm text-muted-foreground">
                            Enter the verification code sent to your {verificationMethod === "email" ? "email" : "phone"}
                        </p> */}
                    </div>

                    {/* Success State */}
                    {isSuccess && (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <div className="rounded-full bg-green-500/20 p-4">
                                <CheckCircle2 className="h-12 w-12 text-green-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-white">
                                    Verification Successful!
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Your account has been verified. Redirecting...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {isError && !isLoading && (
                        <div className="flex flex-col items-center gap-4 ">
                            <div className="rounded-full bg-destructive/20 p-4">
                                <XCircle className="h-8 w-8 text-destructive" />
                            </div>
                            <p className="text-sm text-destructive">
                                {getErrorMessage()}
                            </p>
                        </div>
                    )}

                    {/* OTP Form */}
                    {!isSuccess && (
                        <Formik
                            initialValues={initialValues}
                            validationSchema={toFormikValidationSchema(otpSchema)}
                            onSubmit={handleSubmit}
                            enableReinitialize
                            validateOnMount={false}
                            validateOnBlur={true}
                            validateOnChange={false}
                        >
                            {({ errors, touched, values }) => (
                                <Form className="space-y-4">
                                    {/* OTP Code Field */}
                                    <div className="flex flex-col items-center gap-2 mt-4 ">
                                        {/* <Label htmlFor="code" className=' text-center '>Verification Code</Label> */}
                                        <Field name="code">
                                            {({ field, form }: any) => (
                                                <InputOTP
                                                    maxLength={6}
                                                    value={field.value || ""}
                                                    onChange={(val: string) => form.setFieldValue(field.name, val)}
                                                >
                                                    {[0, 1, 2].map(index => (
                                                        <InputOTPGroup key={index}>
                                                            <InputOTPSlot
                                                                index={index}
                                                                className={touched.code && errors.code ? "border-destructive focus-visible:border-destructive bg-destructive/20" : ""}
                                                            />
                                                        </InputOTPGroup>
                                                    ))}
                                                    <InputOTPSeparator />
                                                    {[3, 4, 5].map(index => (
                                                        <InputOTPGroup key={index}>
                                                            <InputOTPSlot
                                                                index={index}
                                                                className={touched.code && errors.code ? "border-destructive focus-visible:border-destructive bg-destructive/20" : ""}
                                                            />
                                                        </InputOTPGroup>
                                                    ))}
                                                </InputOTP>
                                            )}
                                        </Field>
                                        <ErrorMessage
                                            name="code"
                                            component="div"
                                            className="text-xs text-destructive text-left px-1"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="space-y-3 pt-4">
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={isLoading || isSuccess}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Verifying...
                                                </>
                                            ) : (
                                                "Verify OTP"
                                            )}
                                        </Button>

                                        {/* Resend OTP Button */}
                                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                            <p>Didn't receive the code?</p>
                                            <Button
                                                type="button"
                                                variant="link"
                                                onClick={handleResendOtp}
                                                disabled={isResending}
                                                className="h-auto p-0 text-primary hover:text-primary/80"
                                            >
                                                {isResending ? (
                                                    <>
                                                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    "Resend OTP"
                                                )}
                                            </Button>
                                        </div>

                                        <Link href="/sign-in">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className="w-full"
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Back to Sign In
                                            </Button>
                                        </Link>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    )}

                    {/* Help Links */}
                    <div className=" space-y-2">
                        <p className="text-xs text-muted-foreground">
                            Having trouble?{" "}
                            <Link
                                href="/sign-in"
                                className="text-primary underline hover:text-primary/80"
                            >
                                Contact Support
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default VerifyOtp