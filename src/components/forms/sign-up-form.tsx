"use client";
import { Card } from "../ui/card";
import Image from "next/image";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import PasswordField from "../elements/form-elements/password-field";
import UsernameInput from "../ui/username-input";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { registerSchema, type RegisterFormValues } from "@/schemas/register-schema";
import { useRegister } from "@/hooks/auth/use-register";
import { Loader2 } from "lucide-react";
import type { RegisterRequest } from "@/lib/api/auth";

const SignUpForm = () => {
  const {
    register,
    isLoading,
    isSuccess,
    isError,
  } = useRegister({
    showToasts: true,
    redirectOnSuccess: true,
  });

  /**
   * Form submission handler
   * Transforms form values to API request format
   */
  const handleSubmit = async (values: RegisterFormValues) => {
    // Transform form values to API request format
    const registerData: RegisterRequest = {
      name: values.name,
      username: values.username,
      email: values.email,
      password: values.password,
      // Include phone number only if provided
      ...(values.phoneNumber && { phoneNumber: values.phoneNumber }),
    };

    // Trigger registration mutation
    register(registerData);
  };

  /**
   * Initial form values
   */
  const initialValues: RegisterFormValues = {
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo Section */}
      <div className="relative w-full h-50">
        <Image
          src="/logo/logo.png"
          alt="universe-logo"
          fill
          priority
          className="object-contain"
        />
      </div>

      {/* Registration Card */}
      <Card className="px-6 py-8 text-center bg-primary/20 space-y-4">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-white/90">
            Your Universe Registration
          </h2>
        </div>

        {/* Registration Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={toFormikValidationSchema(registerSchema)}
          onSubmit={handleSubmit}
          enableReinitialize
          validateOnMount={false}
          validateOnBlur={true}
          validateOnChange={false}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Field
                  as={Input}
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={values.name || ""}
                  className={
                    touched.name && errors.name
                      ? "border-destructive focus-visible:border-destructive bg-destructive/20"
                      : ""
                  }
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-xs text-destructive text-left px-1"
                />
              </div>

              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <UsernameInput
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={values.username || ""}
                  onChange={(e) => setFieldValue("username", e.target.value)}
                  disabled={isLoading || isSuccess}
                  disableCheck={isLoading || isSuccess}
                  className={
                    touched.username && errors.username
                      ? "border-destructive focus-visible:border-destructive bg-destructive/20"
                      : ""
                  }
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-xs text-destructive text-left px-1"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Field
                  as={Input}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={values.email || ""}
                  className={
                    touched.email && errors.email
                      ? "border-destructive focus-visible:border-destructive bg-destructive/20"
                      : ""
                  }
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-xs text-destructive text-left px-1"
                />
              </div>

              {/* Phone Number Field (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">
                  Phone Number <span className="text-muted-foreground text-xs">(Optional)</span>
                </Label>
                <Field
                  as={Input}
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+1234567890"
                  value={values.phoneNumber || ""}
                  className={
                    touched.phoneNumber && errors.phoneNumber
                      ? "border-destructive focus-visible:border-destructive bg-destructive/20"
                      : ""
                  }
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="text-xs text-destructive text-left px-1"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Field name="password">
                  {({ field, meta }: any) => (
                    <>
                      <PasswordField
                        {...field}
                        id="password"
                        name="password"
                        value={field.value || ""}
                        placeholder="Enter your password"
                        className={
                          meta.touched && meta.error
                            ? "border-destructive focus-visible:border-destructive bg-destructive/20"
                            : ""
                        }
                      />
                      {meta.touched && meta.error && (
                        <div className="text-xs text-destructive text-left px-1">
                          {meta.error}
                        </div>
                      )}
                    </>
                  )}
                </Field>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Field name="confirmPassword">
                  {({ field, meta }: any) => (
                    <>
                      <PasswordField
                        {...field}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={field.value || ""}
                        placeholder="Please confirm your password here"
                        className={
                          meta.touched && meta.error
                            ? "  border-destructive focus-visible:border-destructive !bg-destructive/20"
                            : ""
                        }
                      />
                      {meta.touched && meta.error && (
                        <div className="text-xs text-destructive text-left px-1">
                          {meta.error}
                        </div>
                      )}
                    </>
                  )}
                </Field>
              </div>

              {/* Subscription Plans Section */}
              <div className="py-4 border border-primary rounded-2xl text-center">
                <h2 className="text-white">Subscription Plans</h2>
              </div>

              {/* Submit Button */}
              <div className="py-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || isSuccess}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : isSuccess ? (
                    "Registration Successful!"
                  ) : (
                    "Register Your Universe"
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>

        {/* Sign In Link */}
        <div className="flex flex-col items-center">
          <div className="text-muted font-semibold flex items-center gap-x-1">
            Already have an account?
            <Link
              className="text-primary italic underline text-sm font-normal"
              href="/sign-in"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Support Link */}
        <Link
          href=""
          className="underline text-primary text-sm italic"
          onClick={(e) => {
            e.preventDefault();
            // Handle support link click
          }}
        >
          Issues creating Your Universe? Contact us here.
        </Link>
      </Card>
    </div>
  );
};

export default SignUpForm;
