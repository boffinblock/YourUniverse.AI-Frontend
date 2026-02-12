"use client";

import { cn } from "@/lib/utils";
import { type ComponentProps, memo, useEffect, useRef, useState } from "react";
import { Streamdown } from "streamdown";

/** Characters to reveal per animation frame (~30-40 chars/sec at 60fps) */
const CHARS_PER_FRAME = 2;

/**
 * Typewriter effect for streaming: reveals content progressively for ChatGPT-like typing.
 * When content grows (new tokens), we animate from current to target length.
 */
function StreamingTypewriter({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const [displayedLength, setDisplayedLength] = useState(0);
  const targetRef = useRef(content.length);
  const rafRef = useRef<number | null>(null);

  // When content shrinks (e.g. new message), reset
  useEffect(() => {
    if (content.length < targetRef.current) {
      targetRef.current = content.length;
      setDisplayedLength(content.length);
    } else {
      targetRef.current = content.length;
    }
  }, [content.length]);

  // Animate toward target
  useEffect(() => {
    if (displayedLength >= targetRef.current) return;

    const tick = () => {
      setDisplayedLength((prev) => {
        const target = targetRef.current;
        const next = Math.min(prev + CHARS_PER_FRAME, target);
        if (next < target) {
          rafRef.current = requestAnimationFrame(tick);
        }
        return next;
      });
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [content.length, displayedLength]);

  const visible = content.slice(0, displayedLength);
  return (
    <span className={cn("inline-block w-full", className)}>
      <Streamdown>{visible}</Streamdown>
    </span>
  );
}

type ResponseProps = ComponentProps<typeof Streamdown> & {
  /** When true, use typewriter effect + show cursor. When false, render full markdown. */
  isStreaming?: boolean;
};

/**
 * Renders assistant message content.
 * - Streaming: Typewriter effect for gradual reveal (ChatGPT-like)
 * - Completed: Full Markdown with code blocks, lists, tables
 */
export const Response = memo(
  ({ className, isStreaming, children, ...props }: ResponseProps) => {
    const text = typeof children === "string" ? children : String(children ?? "");

    if (isStreaming) {
      return (
        <div
          className={cn(
            "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
            "prose prose-invert prose-sm max-w-none prose-pre:bg-white/10 prose-pre:rounded-lg prose-code:before:content-none prose-code:after:content-none",
            className
          )}
        >
          <StreamingTypewriter content={text} className="size-full" />
          <span
            className="inline-flex ml-0.5 w-2 h-4 bg-white/70 animate-pulse align-middle"
            aria-hidden
          />
        </div>
      );
    }

    return (
      <div
        className={cn(
          "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
          "prose prose-invert prose-sm max-w-none prose-pre:bg-white/10 prose-pre:rounded-lg prose-code:before:content-none prose-code:after:content-none",
          className
        )}
      >
        <Streamdown {...props}>{children}</Streamdown>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.isStreaming === nextProps.isStreaming
);

Response.displayName = "Response";
