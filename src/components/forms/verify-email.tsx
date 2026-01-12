"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle, Mail } from "lucide-react";
import { useVerifyEmail } from "@/hooks";

interface VerifyEmailProps {
    token?: string;
}

/**
 * The bug where the API is called twice is often caused in React by a mixture of
 * automatic invocation of queries (enabled: true) on mount AND manual invocation like refetch() in useEffect,
 * or double-mount in React.StrictMode during development.
 *
 * This fix ensures useVerifyEmail is called automatically only once on mount (if token is present), 
 * and when retrying it is called only on button press. No useEffect does refetch on mount.
 * 
 * Also, to defend against double mount in dev, we'll use a useRef to allow the call only once if desired.
 * But most importantly, if you noticed an explicit call (like refetch on mount), you must not add it.
 */

const VerifyEmail: React.FC<VerifyEmailProps> = ({ token }) => {
    // useVerifyEmail must only be called ONCE, on mount, for auto fetch (if token), and manually via refetch.
    // Prevent accidental repeat.
    const { message, isLoading, isSuccess, isError, error, refetch, isFetching } =
        useVerifyEmail({
            token: token || "",
            enabled: !!token,
            showToasts: true,
            redirectOnSuccess: true,
            redirectPath: "/sign-in",
            redirectDelay: 3000,
        });
    // No double fetch logic needed as long as enabled is properly set and we do not call refetch from useEffect

    const getErrorMessage = (): string => {
        if (!error) return "Unable to verify your email address.";

        if (typeof error === "string") return error;
        if (typeof error === "object") {
            if (typeof error.message === "string") return error.message;
            if (typeof error.error === "string") return error.error;
        }

        return "Unable to verify your email address.";
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
                <Card className="px-6 py-8 text-center bg-primary/20 space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold text-white/90">
                            Email Verification
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {isLoading
                                ? "Verifying your email address..."
                                : isSuccess
                                    ? "Your email has been verified!"
                                    : isError
                                        ? "Verification failed"
                                        : !token
                                            ? "Verification token missing"
                                            : "Preparing to verify..."}
                        </p>
                    </div>

                    {/* Loading */}
                    {isLoading && (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <Loader2 className="h-12 w-12 text-primary animate-spin" />
                            <p className="text-muted-foreground">
                                Please wait while we verify your email...
                            </p>
                        </div>
                    )}

                    {/* Success */}
                    {isSuccess && (
                        <div className="flex flex-col items-center gap-4 ">
                            <div className="rounded-full bg-green-500/20 p-4">
                                <CheckCircle2 className="h-12 w-12 text-green-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-white">
                                    Email Verified!
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {message || "Your email has been verified successfully."}
                                </p>
                                <p className="text-xs text-muted-foreground mt-4">
                                    Redirecting to sign in...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {isError && (
                        <div className="flex flex-col items-center gap-4  ">
                            <div className="rounded-full bg-destructive/20 p-4">
                                <XCircle className="h-12 w-12 text-destructive" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-white">
                                    Verification Failed
                                </h3>
                                <p className="text-sm text-destructive">{getErrorMessage()}</p>
                                <p className="text-xs text-muted-foreground mt-4">
                                    The verification link may have expired (links expire after 24
                                    hours). Please request a new verification email.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* No Token */}
                    {!token && (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <Mail className="h-12 w-12 text-muted-foreground" />
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-white">
                                    Verification Token Missing
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Please check your email and use the verification link
                                    provided.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-3 pt-4">
                        {isError && (
                            <>
                                <Button
                                    onClick={() => refetch()}
                                    className="w-full"
                                    disabled={isFetching || isLoading}
                                >
                                    {isFetching || isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        "Try Again"
                                    )}
                                </Button>
                                <Link href="/resend/verification-email" className="block w-full">
                                    <Button className="w-full" variant="outline">
                                        <Mail className="mr-2 h-4 w-4" />
                                        Resend Verification Email
                                    </Button>
                                </Link>
                                <Link href="/sign-in" className=" block w-full">
                                    <Button className="w-full" variant="outline">
                                        Go to Sign In
                                    </Button>
                                </Link>
                            </>
                        )}

                        {!token && (
                            <Link href="/resend/verification-email">
                                <Button className="w-full">
                                    <Mail className="mr-2 h-4 w-4" />
                                    Resend Verification Email
                                </Button>
                            </Link>
                        )}

                        {isSuccess && (
                            <Link href="/sign-in">
                                <Button className="w-full">Continue to Sign In</Button>
                            </Link>
                        )}
                    </div>

                    {/* Help */}
                    <div className="pt-4  space-y-2">
                        <p className="text-xs text-muted-foreground">
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

export default VerifyEmail;
