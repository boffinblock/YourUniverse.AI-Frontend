"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { resendVerificationSchema, type ResendVerificationFormValues } from "@/schemas/resend-verification-schema";
import { useResendVerification } from "@/hooks";

const ResendVerificationForm = () => {
  const {
    resend,
    isLoading,
    isSuccess,
  } = useResendVerification({
    showToasts: true,
  });

  const handleSubmit = (values: ResendVerificationFormValues) => {
    resend({ email: values.email });
  };

  const initialValues: ResendVerificationFormValues = {
    email: "",
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
              Resend Verification Email
            </h2>
            <p className="text-sm text-muted-foreground">
              {isSuccess
                ? "Verification email sent successfully!"
                : "Enter your email address to receive a new verification link."}
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
                  Email Sent!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Please check your inbox for the verification link. The link will expire in 24 hours.
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          {!isSuccess && (
            <Formik
              initialValues={initialValues}
              validationSchema={toFormikValidationSchema(resendVerificationSchema)}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="email"
                      className={
                        touched.email && errors.email
                          ? "border-destructive bg-destructive/30 focus-visible:border-destructive"
                          : ""
                      }
                    />
                    <ErrorMessage
                      name="email"
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
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Verification Email
                      </>
                    )}
                  </Button>
                </Form>
              )}
            </Formik>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-4">
            {isSuccess && (
              <Link href="/sign-in">
                <Button className="w-full">Continue to Sign In</Button>
              </Link>
            )}

            <Link href="/sign-in">
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

export default ResendVerificationForm;

