"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getAccessToken } from "@/lib/utils/token-storage";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import Loader from "../elements/loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

/**
 * ProtectedRoute Component
 * Protects routes that require authentication
 * 
 * Token refresh is now handled automatically by the API client interceptor.
 * This component simply:
 * - Checks for access token presence
 * - Validates token by fetching current user (which will auto-refresh if needed)
 * - Redirects to login if authentication fails
 */
export const ProtectedRoute = ({
  children,
  redirectTo = "/sign-in",
  requireAuth = true,
}: ProtectedRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const accessToken = getAccessToken();

  // Fetch current user to validate token
  // The API client will automatically refresh token on 401
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isUserError,
  } = useCurrentUser({
    enabled: !!accessToken && requireAuth,
    retry: false, // Don't retry - interceptor handles refresh
    onError: () => {
      // If user fetch fails after refresh attempts, redirect to login
      setIsAuthorized(false);
      setIsChecking(false);
      router.replace(`${redirectTo}?redirect=${encodeURIComponent(pathname)}`);
    },
  });

  useEffect(() => {
    // If route doesn't require auth, allow access
    if (!requireAuth) {
      setIsAuthorized(true);
      setIsChecking(false);
      return;
    }

    // Check if user has access token
    if (!accessToken) {
      setIsAuthorized(false);
      setIsChecking(false);
      router.replace(`${redirectTo}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Wait for user query to complete
    if (isLoadingUser) {
      return;
    }

    // If user data is loaded successfully, authorize
    if (user && !isUserError) {
      setIsAuthorized(true);
      setIsChecking(false);
      return;
    }

    // If user query failed (after refresh attempts), redirect to login
    if (isUserError) {
      setIsAuthorized(false);
      setIsChecking(false);
      router.replace(`${redirectTo}?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [
    accessToken,
    user,
    isLoadingUser,
    isUserError,
    requireAuth,
    redirectTo,
    pathname,
    router,
  ]);

  // Listen for token expiration events (from refresh manager)
  useEffect(() => {
    const handleTokenExpired = () => {
      setIsAuthorized(false);
      setIsChecking(false);
      router.replace(`${redirectTo}?redirect=${encodeURIComponent(pathname)}`);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("auth:token-expired", handleTokenExpired);
      return () => {
        window.removeEventListener("auth:token-expired", handleTokenExpired);
      };
    }
  }, [redirectTo, pathname, router]);

  // Show loading state while checking authentication
  if (isChecking || isLoadingUser) {
    return (
      <div className=" bg-gray-900/70 backdrop-blur-3xl h-full w-full ">
        <Loader />
      </div>
    );
  }

  // If not authorized, don't render children (redirect will happen)
  if (!isAuthorized) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
};

