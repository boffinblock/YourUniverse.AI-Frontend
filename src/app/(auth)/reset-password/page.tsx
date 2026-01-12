"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ResetPasswordForm from "@/components/forms/reset-password-form";

const ResetPasswordPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  if (!token) {
    router.push("/forget-password");
    return null;
  }

  return <ResetPasswordForm token={token} />;
};

const ResetPasswordPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <ResetPasswordPageContent />
    </Suspense>
  );
};

export default ResetPasswordPage;
