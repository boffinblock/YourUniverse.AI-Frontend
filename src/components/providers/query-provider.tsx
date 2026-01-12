/**
 * QueryClientProvider Wrapper
 * Provides TanStack Query context to the application
 */
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, ReactNode } from "react";

/**
 * Query client configuration
 * Optimized for production use with sensible defaults
 */
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: data is considered fresh for 5 minutes
        staleTime: 1000 * 60 * 5,
        // Cache time: unused data stays in cache for 10 minutes
        gcTime: 1000 * 60 * 10,
        // Retry failed requests
        retry: 1,
        // Refetch on window focus in development only
        refetchOnWindowFocus: process.env.NODE_ENV === "development",
      },
      mutations: {
        // Retry mutations on network errors
        retry: 1,
      },
    },
  });
};

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * QueryProvider Component
 * Wraps the app with TanStack Query provider
 * Uses singleton pattern to prevent creating multiple clients
 */
export const QueryProvider = ({ children }: QueryProviderProps) => {
  // Use useState with lazy initialization to create client once
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query Devtools - only in development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};

