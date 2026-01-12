/**
 * useDebouncedUsernameCheck Hook
 * Custom hook for debounced username availability checking
 * Optimized to reduce API calls while user types
 */
"use client";

import { useState, useEffect } from "react";
import { useUsernameCheck } from "./use-username-check";

interface UseDebouncedUsernameCheckOptions {
  username: string;
  debounceMs?: number;
  minLength?: number;
  enabled?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

/**
 * Custom hook for debounced username checking
 * Delays API calls until user stops typing
 */
export const useDebouncedUsernameCheck = (options: UseDebouncedUsernameCheckOptions) => {
  const {
    username,
    debounceMs = 500,
    minLength = 3,
    enabled = true,
    onSuccess,
    onError,
  } = options;

  const [debouncedUsername, setDebouncedUsername] = useState<string>("");

  // Debounce the username value
  useEffect(() => {
    if (!enabled) {
      // If disabled, clear debounced value immediately
      setDebouncedUsername("");
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedUsername(username);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [username, debounceMs, enabled]);

  // Only check if username meets minimum length requirement and is enabled
  const shouldCheck = enabled && debouncedUsername.length >= minLength;

  // Use the username check hook with debounced value
  const queryResult = useUsernameCheck({
    username: debouncedUsername,
    enabled: shouldCheck,
    onSuccess,
    onError,
  });

  return {
    ...queryResult,
    // Indicate if we're waiting for debounce
    isDebouncing: username !== debouncedUsername && username.length >= minLength,
    // Show checking state when debouncing or fetching
    isChecking: queryResult.isFetching || (username !== debouncedUsername && username.length >= minLength),
  };
};

