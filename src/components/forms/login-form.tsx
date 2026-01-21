"use client";

import React, { useState, useEffect } from "react";
import { Card } from "../ui/card";
import Image from "next/image";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import PasswordField from "../elements/form-elements/password-field";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { loginSchema, type LoginFormValues } from "@/schemas/login-schema";
import { useLogin } from "@/hooks/auth/use-login";
import { useResendVerification } from "@/hooks/auth/use-resend-verification";
import { Loader2, Mail } from "lucide-react";
import type { LoginRequest } from "@/lib/api/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
const LoginForm = () => {
  const {
    login,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useLogin({
    showToasts: true,
    redirectOnSuccess: true,
    redirectPath: "/verify/otp",
  });

  const [countdown, setCountdown] = useState(0);

  const {
    resend,
    isLoading: isResending,
    isSuccess: isResendSuccess,
  } = useResendVerification({
    showToasts: true,
  });

  // Reset countdown and set to 60 on success
  useEffect(() => {
    if (isResendSuccess) {
      setCountdown(60);
    }
  }, [isResendSuccess]);

  // Countdown timer logic
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const isUnverifiedError = isError && error?.statusCode === 403 && (error?.message?.toLowerCase()?.includes("verify") || error?.error?.toLowerCase()?.includes("verify"));

  /**
   * Form submission handler
   * Transforms form values to API request format
   */
  const handleSubmit = async (values: LoginFormValues) => {
    // Transform form values to API request format
    const loginData: LoginRequest = {
      identifier: values.identifier,
      password: values.password,
    };

    // Trigger login mutation
    login(loginData);
  };
  const handleOpenMail = () => {
    window.location.href = "mailto:support@youruniverse.ai";
  };
  /**
   * Initial form values
   */
  const initialValues: LoginFormValues = {
    identifier: "",
    password: "",
  };




  return (
    <div className="w-full max-w-md">
      <div className="relative w-full h-50">
        <Image
          src="/logo/logo.png"
          alt="universe-logo"
          fill
          priority
          className="object-contain"
        />
      </div>
      <div className="relative w-[85%] h-[40%] mx-auto">
        <Image
          src="/logoname.png"
          alt="universe-logo"
          fill
          priority
          className="object-contain"
        />
      </div>
      <Card className="px-6 py-8 text-center bg-primary/20 space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-widest text-white/90">
            Welcome Back
          </h2>
          <p className="text-sm text-muted">Login in to Your Universe</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={toFormikValidationSchema(loginSchema)}
          onSubmit={handleSubmit}
          enableReinitialize
          validateOnMount={false}
          validateOnBlur={true}
          validateOnChange={false}
        >
          {({ errors, touched, values }) => (
            <Form className="space-y-4">
              {/* Email or Username Field */}
              <div className="space-y-2">
                <Label htmlFor="identifier">Email or Username</Label>
                <Field
                  as={Input}
                  id="identifier"
                  name="identifier"
                  placeholder="Enter your Email or Username"
                  value={values.identifier || ""}
                  autoComplete="username"
                  className={
                    touched.identifier && errors.identifier
                      ? "border-destructive focus-visible:border-destructive bg-destructive/20"
                      : ""
                  }
                />
                <ErrorMessage
                  name="identifier"
                  component="div"
                  className="text-xs text-destructive text-left px-1"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Field
                  as={PasswordField}
                  id="password"
                  name="password"
                  placeholder="Enter Your Password"
                  value={values.password || ""}
                  autoComplete="current-password"
                  className={
                    touched.password && errors.password
                      ? "border-destructive focus-visible:border-destructive bg-destructive/20"
                      : ""
                  }
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-xs text-destructive text-left px-1"
                />
              </div>

              {/* Forgot Password Link */}
              <div>
                <Link
                  href="/reset-password"
                  className="underline text-primary italic float-end text-sm hover:text-primary/80 mb-2"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || isSuccess}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </div>

              {/* Unverified Email Link */}
              {isUnverifiedError && (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 text-sm text-primary-foreground animate-in fade-in slide-in-from-top-4 duration-500 ease-out backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-4 text-left">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-white/90 text-sm">Action Required</p>
                      <p className="text-primary/80 text-xs text-left">Your email address is not verified yet.</p>
                    </div>
                  </div>

                  {values.identifier?.includes("@") ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-center bg-primary gap-2 border-primary/30 hover:bg-primary/10 hover:text-white text-white/90 font-semibold transition-all duration-300 h-10"
                      onClick={() => resend({ email: values.identifier })}
                      disabled={isResending || countdown > 0}
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Resending...
                        </>
                      ) : countdown > 0 ? (
                        `Resend in ${countdown}s`
                      ) : (
                        <>
                          <Mail className="h-4 w-4" />
                          Resend verification email
                        </>
                      )}
                    </Button>
                  ) : (
                    <Link
                      href="/resend/verification-email"
                      className="flex items-center justify-center gap-2 p-3 rounded-lg border border-primary/20 bg-primary/5 underline font-medium hover:text-white hover:bg-primary/10 transition-all duration-300"
                    >
                      <Mail className="h-4 w-4" />
                      Go to resend page
                    </Link>
                  )}
                </div>
              )}
            </Form>
          )}
        </Formik>

        <div className="text-center flex flex-col">
          <p className="text-muted font-semibold">
            {`Don't have Your own Universe?`}
          </p>
          <Link
            href="/sign-up"
            className="underline text-primary text-sm italic hover:text-primary/80"
          >
            Create Your Universe Here
          </Link>
        </div>
        <div className="w-full italic text-sm  text-center">
          <span className="mr-2 italic text-md text-muted">Issues creating Your Universe?</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="underline text-primary text-sm italic"> Contact us here.</button>
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
  );
};

export default LoginForm;
