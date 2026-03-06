import React from "react";
import VerifyEmail from "@/components/forms/verify-email";

const Page = async ({ params }: { params: Promise<{ token: string }> }) => {
    const { token } = await params;
    console.log("token", token)
    return <VerifyEmail token={token} />;
};

export default Page;
