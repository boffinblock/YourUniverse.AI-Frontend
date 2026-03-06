"use client";

import React from "react";
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
import { Loader2 } from "lucide-react";
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

  const {
    resend: resendVerification,
    isLoading: isResending,
  } = useResendVerification({
    showToasts: true,
  });

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

  /**
   * Initial form values
   */
  const initialValues: LoginFormValues = {
    identifier: "",
    password: "",
  };

  const handleOpenMail = () => {
    window.location.href = "mailto:support@youruniverse.ai";
  };

  const getErrorMessage = (): string => {
    if (!error) return "";
    if (typeof error === "string") return error;
    if (typeof error === "object") {
      return (error as any).message || (error as any).error || "";
    }
    return "";
  };

  const errorMessage = getErrorMessage().toLowerCase();
  const needsVerification = isError && errorMessage.includes("verify");


  return (
    <div className="w-full max-w-xl">
      <div className="relative w-full h-50">
        <Image
          src="/logo/logo.png"
          alt="universe-logo"
          fill
          priority
          className="object-contain"
        />
      </div>
      <Card className="px-6 py-8 text-center border-none bg-transparent backdrop-blur-none w-full space-y-4">
        <Formik
          initialValues={initialValues}
          validationSchema={toFormikValidationSchema(loginSchema as unknown as Parameters<typeof toFormikValidationSchema>[0])}
          onSubmit={handleSubmit}
          enableReinitialize
          validateOnMount={false}
          validateOnBlur={true}
          validateOnChange={false}
        >
          {({ errors, touched, values }) => (
            <Form className="space-y-4">
              <div className="space-y-4 text-left">
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
              </div>

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

              {needsVerification && (
                <div className="pt-2 text-center text-sm">
                  <span className="text-destructive block mb-2">{getErrorMessage()}</span>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isResending}
                    onClick={() => {
                      if (values.identifier) {
                        resendVerification({ email: values.identifier });
                      }
                    }}
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Resend Verification Email"
                    )}
                  </Button>
                </div>
              )}
            </Form>
          )}
        </Formik>

        <div className="flex flex-col items-center">
          <div className="text-muted font-semibold flex items-center gap-x-1">
            Don't have Your own Universe?
            <Link
              href="/sign-up"
              className="text-primary italic underline text-sm font-normal"
            >
              Create YourUniverse
            </Link>
          </div>
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
