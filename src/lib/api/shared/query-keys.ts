/**
 * Query Keys Factory
 * Centralized query key management for TanStack Query
 * Organized by feature/module for better cache management
 */

/**
 * Base query keys
 */
export const queryKeys = {
  /**
   * Authentication related query keys
   */
  auth: {
    all: ["auth"] as const,
    register: () => [...queryKeys.auth.all, "register"] as const,
    login: () => [...queryKeys.auth.all, "login"] as const,
    verify: (token?: string) => [...queryKeys.auth.all, "verify", token] as const,
    verifyOtp: () => [...queryKeys.auth.all, "verify-otp"] as const,
    resendOtp: () => [...queryKeys.auth.all, "resend-otp"] as const,
    usernameCheck: (username?: string) => [...queryKeys.auth.all, "username-check", username] as const,
    refresh: () => [...queryKeys.auth.all, "refresh"] as const,
    logout: () => [...queryKeys.auth.all, "logout"] as const,
    forgotPassword: () => [...queryKeys.auth.all, "forgot-password"] as const,
    resetPassword: () => [...queryKeys.auth.all, "reset-password"] as const,
    user: () => [...queryKeys.auth.all, "user"] as const,
  },

  /**
   * User related query keys
   */
  user: {
    all: ["user"] as const,
    current: () => [...queryKeys.user.all, "current"] as const,
    profile: () => [...queryKeys.user.all, "profile"] as const,
    updateProfile: () => [...queryKeys.user.all, "update-profile"] as const,
    updateProfilePicture: () => [...queryKeys.user.all, "update-profile-picture"] as const,
  },

  /**
   * Characters related query keys
   */
  characters: {
    all: ["characters"] as const,
    lists: () => [...queryKeys.characters.all, "list"] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.characters.lists(), filters] as const,
    details: () => [...queryKeys.characters.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.characters.details(), id] as const,
    create: () => [...queryKeys.characters.all, "create"] as const,
  },

  /**
   * Personas related query keys
   */
  personas: {
    all: ["personas"] as const,
    lists: () => [...queryKeys.personas.all, "list"] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.personas.lists(), filters] as const,
    details: () => [...queryKeys.personas.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.personas.details(), id] as const,
  },

  /**
   * Lorebooks related query keys
   */
  lorebooks: {
    all: ["lorebooks"] as const,
    lists: () => [...queryKeys.lorebooks.all, "list"] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.lorebooks.lists(), filters] as const,
    details: () => [...queryKeys.lorebooks.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.lorebooks.details(), id] as const,
    create: () => [...queryKeys.lorebooks.all, "create"] as const,
  },

  /**
   * Tags related query keys
   */
  tags: {
    all: ["tags"] as const,
    lists: () => [...queryKeys.tags.all, "list"] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.tags.lists(), filters] as const,
    details: () => [...queryKeys.tags.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.tags.details(), id] as const,
    popular: (category?: string) => [...queryKeys.tags.all, "popular", category] as const,
    create: () => [...queryKeys.tags.all, "create"] as const,
  },
} as const;

