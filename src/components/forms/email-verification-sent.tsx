"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog"; // adjust the path based on your setup
import { resendVerificationSchema, type ResendVerificationFormValues } from "@/schemas/resend-verification-schema";
import { useResendVerification } from "@/hooks";

interface EmailVerificationSentProps {
    email?: string;
}

const EmailVerificationSent: React.FC<EmailVerificationSentProps> = ({ email }) => {

    const [countdown, setCountdown] = useState(0);

    const {
        resend,
        isLoading,
        isSuccess,
    } = useResendVerification({
        showToasts: true,
    });

    const handleOpenMail = () => {
        window.location.href = "mailto:support@youruniverse.ai";
    };

    const handleSubmit = () => {
        resend({ email: email || '' });
    };

    // Reset countdown and set to 60 on success
    useEffect(() => {
        if (isSuccess) {
            setCountdown(60);
        }
    }, [isSuccess]);

    // Countdown timer logic
    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [countdown]);


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
                    {/* Success Icon */}
                    <div className="flex justify-center">
                        <div className="rounded-full bg-green-500/20 p-4">
                            <CheckCircle2 className="h-16 w-16 text-green-500" />
                        </div>
                    </div>

                    {/* Header */}
                    <div className="space-y-2 text-center">
                        <h2 className="text-2xl font-semibold text-white/90">
                            Registration Successful!
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            We've sent a verification link to your email address.
                        </p>
                    </div>

                    {/* Email Icon and Message */}
                    <div className="flex flex-col items-center gap-4 py-6">
                        <div className="rounded-full bg-primary/20 p-4">
                            <Mail className="h-12 w-12 text-primary" />
                        </div>
                        <div className="space-y-2 text-center">
                            <h3 className="text-lg font-semibold text-white">
                                Check Your Email
                            </h3>
                            {email && (
                                <p className="text-sm text-muted-foreground">
                                    We've sent a verification link to:
                                </p>
                            )}
                            {email && (
                                <p className="text-sm font-medium text-primary">
                                    {email}
                                </p>
                            )}
                            <p className="text-sm text-muted-foreground mt-4">
                                Please click the verification link in the email to activate your account.
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                The link will expire in 24 hours. If you don't see the email, please check your spam folder.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className=" space-y-2">
                        <Button
                            onClick={handleSubmit}
                            className="w-full"
                            variant="outline"
                            disabled={isLoading || countdown > 0}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Resending...
                                </>
                            ) : countdown > 0 ? (
                                `Resend in ${countdown}s`
                            ) : (
                                <>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Resend Verification Email
                                </>
                            )}
                        </Button>


                        <Link href="/sign-in" className="">
                            <Button variant="ghost" className="w-full">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Sign In
                            </Button>
                        </Link>
                    </div>

                    {/* Help */}
                    <div className="w-full italic text-sm pt-4 text-center">
                        <span className="mr-2 italic text-md text-muted">Need help?</span>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button className="underline text-primary text-sm italic"> Contact Support</button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="border-primary bg-primary/30 backdrop-blur-sm ">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-white">Open Preferred Email ?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Do you want to open your preferred email to contact YourUniverse.AI
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="flex justify-end gap-2 mt-4">
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleOpenMail}>
                                        Yes
                                    </AlertDialogAction>
                                </div>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default EmailVerificationSent;

