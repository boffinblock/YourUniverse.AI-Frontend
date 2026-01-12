/**
 * User API Types
 * Type definitions for user-related endpoints
 */

import { ApiResponse } from "../shared/types";

/**
 * User Profile Types
 */
export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber?: string | null;
  avatar: string | null;
  backgroundImg: string | null;
  role: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  subscriptionPlan: string;
  tokensRemaining: number;
  tokensUsed: number;
  profileVisibility: string;
  profileRating: string;
  theme: string;
  fontStyle: string;
  fontSize: string;
  language: string;
  tagsToFollow: string[];
  tagsToAvoid: string[];
  aboutMe: string;
  following: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Get Current User Response
 */
export interface GetCurrentUserResponse {
  user: UserProfile;
}

/**
 * Update Profile Request
 */
export interface UpdateProfileRequest {
  name?: string;
  username?: string;
  aboutMe?: string;
  theme?: "dark-purple" | "white" | "yellow";
  fontStyle?: "serif" | "sans-serif" | "monospace";
  fontSize?: "12" | "16" | "20";
  language?: "en" | "hi" | "es";
  tagsToFollow?: string[];
  tagsToAvoid?: string[];
  profileVisibility?: "public" | "private";
  profileRating?: "SFW" | "NSFW";
}

/**
 * Update Profile Response
 */
export interface UpdateProfileResponse {
  user: UserProfile;
}

/**
 * Avatar Image Type
 */
export interface AvatarImage {
  url: string;
  width: number;
  height: number;
}

/**
 * Update Profile Picture Response
 */
export interface UpdateProfilePictureResponse {
  user: {
    id: string;
    avatar: AvatarImage;
  };
}

