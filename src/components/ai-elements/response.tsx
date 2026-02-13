"use client";

import { cn } from "@/lib/utils";
import { type ComponentProps, memo } from "react";
import { Streamdown } from "streamdown";

type ResponseProps = ComponentProps<typeof Streamdown> & {
  /** When true, show streaming cursor. Both streaming and completed use markdown. */
  isStreaming?: boolean;
};

/**
 * Renders assistant message content with full Markdown support (code blocks, lists, tables via GFM).
 * Used for both streaming and completed messages - markdown renders as content arrives.
 */
export const Response = memo(
  ({ className, isStreaming, children, ...props }: ResponseProps) => {
    return (
      <div
        className={cn(
          "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
          "prose prose-invert prose-sm max-w-none prose-pre:bg-white/10 prose-pre:rounded-lg prose-code:before:content-none prose-code:after:content-none",
          className
        )}
      >
        <Streamdown {...props}>{children}</Streamdown>
        {isStreaming && (
          <span className="inline-flex ml-0.5 w-2 h-4 bg-white/70 animate-pulse" aria-hidden />
        )}
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.isStreaming === nextProps.isStreaming
);

Response.displayName = "Response";
