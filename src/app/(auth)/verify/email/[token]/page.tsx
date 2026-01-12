import React from "react";
import VerifyEmail from "@/components/forms/verify-email";

const VerifyEmailPage = async ({ params }: { params: Promise<{ token: string }> }) => {
    const { token } = await params;

    return <VerifyEmail token={token} />;
};

export default VerifyEmailPage;
