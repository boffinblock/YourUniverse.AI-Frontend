import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LorebookCardSkeletonProps {
  className?: string;
}

/**
 * Skeleton for LorebookCard — matches the landscape layout:
 * left 40% image area, right 60% content + footer.
 * Uses a root div so flex-row is not overridden by Card's default flex-col.
 */
const LorebookCardSkeleton: React.FC<LorebookCardSkeletonProps> = ({ className }) => {
  return (
    <div
      role="presentation"
      className={cn(
        "rounded-2xl w-full overflow-hidden bg-primary/20 backdrop-blur-xl border border-white/10",
        "flex flex-row min-h-[200px]",
        className
      )}
    >
      {/* Left: Image area — 40% width, full height (same as LorebookCard) */}
      <div className="relative shrink-0 w-[40%] min-w-[40%] self-stretch overflow-hidden border-r border-white/5 rounded-l-2xl">
        <div className="absolute top-2 left-2 z-10">
          <Skeleton className="size-6 rounded-full bg-gray-800/50" />
        </div>
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
          <Skeleton className="size-7 rounded-full bg-gray-800/50" />
          <Skeleton className="size-7 rounded-full bg-gray-800/50" />
        </div>
        <Skeleton className="absolute inset-0 w-full h-full rounded-none bg-linear-to-br from-gray-800/50 to-gray-900/50" />
      </div>

      {/* Right: Content + Footer — same structure as LorebookCard */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="space-y-2.5 py-4 px-5 flex-1">
          <div className="flex justify-between items-start gap-2">
            <Skeleton className="h-5 w-28 bg-gray-800/50 rounded" />
            <div className="flex items-center gap-1.5 shrink-0">
              <Skeleton className="h-3.5 w-14 bg-gray-800/50 rounded" />
              <Skeleton className="h-4 w-10 bg-gray-800/50 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-20 bg-gray-800/50 rounded" />
            <Skeleton className="h-3 w-14 bg-gray-800/50 rounded" />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <Skeleton className="h-5 w-14 bg-gray-800/50 rounded-full" />
            <Skeleton className="h-5 w-16 bg-gray-800/50 rounded-full" />
            <Skeleton className="h-5 w-12 bg-gray-800/50 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-full bg-gray-800/50 rounded" />
            <Skeleton className="h-3.5 w-full bg-gray-800/50 rounded" />
            <Skeleton className="h-3.5 w-[80%] bg-gray-800/50 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-16 bg-gray-800/50 rounded" />
            <Skeleton className="h-7 w-16 rounded-full bg-gray-800/50" />
          </div>
        </div>

        <div className="flex justify-between items-center px-5 py-2 border-t border-white/5 gap-2">
          <Skeleton className="h-3 w-24 bg-gray-800/50 rounded" />
          <Skeleton className="h-3 w-24 bg-gray-800/50 rounded" />
        </div>
      </div>
    </div>
  );
};

export default LorebookCardSkeleton;
