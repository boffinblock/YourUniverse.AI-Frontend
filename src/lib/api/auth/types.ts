/**
 * Authentication API Types
 * Type definitions for authentication-related endpoints
 */

import { ApiResponse } from "../shared/types";

/**
 * Register API Types
 */
export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  phoneNumber?: string;
  password: string;
}

export interface RegisterUser {
  id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber?: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  role: string;
  subscriptionPlan: string;
  tokensRemaining: number;
}

export interface RegisterResponse {
  user: RegisterUser;
  message: string;
}

/**
 * Login API Types
 */
export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  message: string;
  verificationMethod: "sms" | "email";
  expiresAt: string;
}

/**
 * Verify OTP API Types
 */
export interface VerifyOtpRequest {
  userId: string;
  code: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface VerifyOtpUser {
  id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber?: string | null;
  role: string;
  subscriptionPlan: string;
  tokensRemaining: number;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

export interface VerifyOtpResponse {
  user: VerifyOtpUser;
  tokens: AuthTokens;
}

/**
 * Resend OTP API Types
 */
export interface ResendOtpRequest {
  userId: string;
}

export interface ResendOtpResponse {
  userId: string;
  message: string;
  verificationMethod: "sms" | "email";
  expiresAt: string;
}

/**
 * Username Check API Types
 */
export interface UsernameCheckResponse {
  available: boolean;
  username: string;
  suggestions?: string[];
  errors?: string[];
}

/**
 * Refresh Token API Types
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  tokens: AuthTokens;
}

/**
 * Logout API Types
 */
export interface LogoutRequest {
  refreshToken: string;
}

export interface LogoutResponse {
  message: string;
}

/**
 * Forgot Password API Types
 */
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

/**
 * Reset Password API Types
 */
export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

/**
 * Resend Verification Email API Types
 */
export interface ResendVerificationEmailRequest {
  email: string;
}

export interface ResendVerificationEmailResponse {
  message: string;
}

