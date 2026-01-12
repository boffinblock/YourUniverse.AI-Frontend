import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorEmptyStateProps {
  type: "error" | "empty";
  error?: {
    message?: string;
    error?: string;
  } | null;
  onRetry?: () => void;
  title?: string;
  description?: string;
  className?: string;
}

const ErrorEmptyState: React.FC<ErrorEmptyStateProps> = ({
  type,
  error,
  onRetry,
  title,
  description,
  className,
}) => {
  if (type === "error") {
    const errorMessage = error?.message || error?.error || "Something went wrong";
    const errorTitle = title || "Unable to Load Data";
    const errorDescription = description || "We encountered an issue while fetching your data. Please try again.";

    return (
      <div className={cn("flex flex-col items-center justify-center py-16 px-4", className)}>
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="mb-6 p-4 rounded-full bg-destructive/10 border border-destructive/20">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>

          <h3 className="text-3xl font-semibold text-white mb-2">
            {errorTitle}
          </h3>

          <p className="text-muted-foreground mb-6">
            {errorDescription}
          </p>

          {error && errorMessage !== errorDescription && (
            <p className="text-sm text-destructive/80 mb-6 font-mono bg-destructive/5 px-4 py-2 rounded-md">
              {errorMessage}
            </p>
          )}

          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="mt-2">
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Empty state
  const emptyTitle = title || "No Results Found";
  const emptyDescription = description || "We couldn't find what you're looking for. Try adjusting your filters or search query.";

  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4", className)}>
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="mb-6 p-4 rounded-full bg-muted/50 border border-border">
          <Inbox className="h-12 w-12 text-muted-foreground" />
        </div>

        <h3 className="text-3xl font-semibold text-white  mb-2">
          {emptyTitle}
        </h3>

        <p className="text-muted-foreground">
          {emptyDescription}
        </p>
      </div>
    </div>
  );
};

export default ErrorEmptyState;

