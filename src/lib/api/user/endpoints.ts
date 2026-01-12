/**
 * User API Endpoints
 * All user-related API calls
 */
import { apiClient } from "../shared/client";
import { ApiResponse } from "../shared/types";
import type {
  GetCurrentUserResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UpdateProfilePictureResponse,
} from "./types";

/**
 * Get current user profile
 */
export const getCurrentUser = async (
  accessToken: string
): Promise<ApiResponse<GetCurrentUserResponse>> => {
  const response = await apiClient.get<ApiResponse<GetCurrentUserResponse>>(
    "/api/v1/user/me",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

/**
 * Update user profile
 */
export const updateProfile = async (
  data: UpdateProfileRequest,
  accessToken: string
): Promise<ApiResponse<UpdateProfileResponse>> => {
  const response = await apiClient.put<ApiResponse<UpdateProfileResponse>>(
    "/api/v1/user/profile",
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
 * Update profile picture
 */
export const updateProfilePicture = async (
  file: File,
  accessToken: string
): Promise<ApiResponse<UpdateProfilePictureResponse>> => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await apiClient.put<ApiResponse<UpdateProfilePictureResponse>>(
    "/api/v1/user/profile-picture",
    formData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

