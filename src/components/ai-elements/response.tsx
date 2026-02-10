"use client";

import { cn } from "@/lib/utils";
import { type ComponentProps, memo, useEffect, useRef, useState } from "react";
import { Streamdown } from "streamdown";

const TYPEWRITER_CHARS_PER_FRAME = 2;

/** Typewriter effect: reveals streaming text character-by-character. */
function TypewriterText({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const [displayedLength, setDisplayedLength] = useState(0);
  const targetLengthRef = useRef(content.length);
  const rafRef = useRef<number | null>(null);

  // When content shrinks (e.g. new message), reset displayed length
  useEffect(() => {
    if (content.length < targetLengthRef.current) {
      targetLengthRef.current = content.length;
      setDisplayedLength(content.length);
    } else {
      targetLengthRef.current = content.length;
    }
  }, [content]);

  useEffect(() => {
    if (displayedLength >= content.length) return;

    const tick = () => {
      setDisplayedLength((prev) => {
        const target = targetLengthRef.current;
        const next = Math.min(prev + TYPEWRITER_CHARS_PER_FRAME, target);
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
    <span className={cn("size-full whitespace-pre-wrap", className)}>
      {visible}
    </span>
  );
}

type ResponseProps = ComponentProps<typeof Streamdown> & {
  /** When true, show streaming content with typewriter effect. */
  isStreaming?: boolean;
};

export const Response = memo(
  ({ className, isStreaming, children, ...props }: ResponseProps) => {
    const text = typeof children === "string" ? children : String(children ?? "");

    if (isStreaming) {
      return (
        <span
          className={cn(
            "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
            className
          )}
        >
          <TypewriterText content={text} className="size-full" />
        </span>
      );
    }
    return (
      <Streamdown
        className={cn(
          "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
          className
        )}
        {...props}
      >
        {children}
      </Streamdown>
    );
  },
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.isStreaming === nextProps.isStreaming
);

Response.displayName = "Response";
