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
import { Loader2 } from "lucide-react";
import type { LoginRequest } from "@/lib/api/auth";

const LoginForm = () => {
  const {
    login,
    isLoading,
    isSuccess,
    isError,
  } = useLogin({
    showToasts: true,
    redirectOnSuccess: true,
    redirectPath: "/verify/otp",
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
        <div className="text-center flex items-center gap-1 justify-center">
          <p className="text-muted font-semibold">{`Issue's signing in?`}</p>
          <Link
            href=""
            className="underline text-primary text-sm italic hover:text-primary/80"
          >
            Contact us here
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
