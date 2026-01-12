"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";

interface EmailVerificationSentProps {
    email?: string;
}

const EmailVerificationSent: React.FC<EmailVerificationSentProps> = ({ email }) => {
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
                        <Link href="/resend/verification-email" className="block ">
                            <Button className="w-full" variant="outline">
                                <Mail className="mr-2 h-4 w-4" />
                                Resend Verification Email
                            </Button>
                        </Link>

                        <Link href="/sign-in" className="">
                            <Button variant="ghost" className="w-full">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Sign In
                            </Button>
                        </Link>
                    </div>

                    {/* Help */}
                    <div className="pt-4">
                        <p className="text-xs text-muted-foreground text-center">
                            Need help?{" "}
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
    );
};

export default EmailVerificationSent;

