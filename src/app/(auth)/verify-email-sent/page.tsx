"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import EmailVerificationSent from "@/components/forms/email-verification-sent";

const VerifyEmailSentPageContent = () => {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || undefined;

    return <EmailVerificationSent email={email} />;
};

const VerifyEmailSentPage = () => {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-muted-foreground">Loading...</div>
                </div>
            }
        >
            <VerifyEmailSentPageContent />
        </Suspense>
    );
};

export default VerifyEmailSentPage;

