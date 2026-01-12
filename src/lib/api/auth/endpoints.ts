/**
 * Authentication API Endpoints
 * All authentication-related API calls
 */
import { apiClient, generateIdempotencyKey } from "../shared/client";
import { ApiResponse } from "../shared/types";
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  UsernameCheckResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
  LogoutResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ResendVerificationEmailRequest,
  ResendVerificationEmailResponse,
} from "./types";

/**
 * Register a new user
 */
export const registerUser = async (
  data: RegisterRequest,
  idempotencyKey?: string
): Promise<ApiResponse<RegisterResponse>> => {
  const key = idempotencyKey || generateIdempotencyKey();

  const response = await apiClient.post<ApiResponse<RegisterResponse>>(
    "/api/v1/auth/register",
    data,
    {
      headers: {
        "Idempotency-Key": key,
      },
    }
  );

  return response.data;
};

/**
 * Login user (Step 1: Request OTP)
 */
export const loginUser = async (
  data: LoginRequest
): Promise<ApiResponse<LoginResponse>> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    "/api/v1/auth/login",
    data
  );

  return response.data;
};

/**
 * Verify email with token
 */
export const verifyEmail = async (
  token: string
): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.get<ApiResponse<{ message: string }>>(
    "/api/v1/auth/verify",
    {
      params: { token },
    }
  );

  return response.data;
};

/**
 * Verify OTP (Step 2: Complete Login)
 */
export const verifyOtp = async (
  data: VerifyOtpRequest
): Promise<ApiResponse<VerifyOtpResponse>> => {
  const response = await apiClient.post<ApiResponse<VerifyOtpResponse>>(
    "/api/v1/auth/login/verify-otp",
    data
  );

  return response.data;
};

/**
 * Resend OTP
 */
export const resendOtp = async (
  data: ResendOtpRequest
): Promise<ApiResponse<ResendOtpResponse>> => {
  const response = await apiClient.post<ApiResponse<ResendOtpResponse>>(
    "/api/v1/auth/login/resend-otp",
    data
  );

  return response.data;
};

/**
 * Check username availability
 */
export const checkUsernameAvailability = async (
  username: string
): Promise<ApiResponse<UsernameCheckResponse>> => {
  const response = await apiClient.get<ApiResponse<UsernameCheckResponse>>(
    "/api/v1/auth/username/check",
    {
      params: { username },
    }
  );

  return response.data;
};

/**
 * Refresh access token
 * 
 * Note: This endpoint does NOT require authentication (no Authorization header).
 * 
 * Token Rotation:
 * - The old refresh token becomes invalid immediately after refresh
 * - Always use the new refresh token returned in the response for subsequent refreshes
 * - Access token expires in 15 minutes
 * - Refresh token expires in 7 days
 * - If refresh token is expired, user must login again
 */
export const refreshToken = async (
  data: RefreshTokenRequest
): Promise<ApiResponse<RefreshTokenResponse>> => {
  // Refresh endpoint doesn't require auth - interceptor will skip adding Authorization header
  const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
    "/api/v1/auth/refresh",
    data
  );

  return response.data;
};

/**
 * Logout user
 */
export const logoutUser = async (
  data: LogoutRequest,
  accessToken: string
): Promise<ApiResponse<LogoutResponse>> => {
  const response = await apiClient.post<ApiResponse<LogoutResponse>>(
    "/api/v1/auth/logout",
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

/**
 * Request password reset
 */
export const forgotPassword = async (
  data: ForgotPasswordRequest
): Promise<ApiResponse<ForgotPasswordResponse>> => {
  const response = await apiClient.post<ApiResponse<ForgotPasswordResponse>>(
    "/api/v1/auth/forgot-password",
    data
  );

  return response.data;
};

/**
 * Reset password with token
 */
export const resetPassword = async (
  data: ResetPasswordRequest,
  idempotencyKey?: string
): Promise<ApiResponse<ResetPasswordResponse>> => {
  const key = idempotencyKey || generateIdempotencyKey();

  const response = await apiClient.put<ApiResponse<ResetPasswordResponse>>(
    "/api/v1/auth/reset-password",
    data,
    {
      headers: {
        "Idempotency-Key": key,
      },
    }
  );

  return response.data;
};

/**
 * Resend verification email
 */
export const resendVerificationEmail = async (
  data: ResendVerificationEmailRequest
): Promise<ApiResponse<ResendVerificationEmailResponse>> => {
  const response = await apiClient.post<ApiResponse<ResendVerificationEmailResponse>>(
    "/api/v1/auth/resend-verification",
    data
  );

  return response.data;
};

