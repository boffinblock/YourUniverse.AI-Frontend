
import VerifyOtp from "@/components/forms/verify-otp";
import React from "react";


const VerifyOtpPage = ({ params }: { params: Promise<{ userId: string }> }) => {
    const { userId } = React.use(params);


    return (
        <VerifyOtp userId={userId} />
    );
};

export default VerifyOtpPage;
