import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface BackgroundCardSkeletonProps {
  className?: string;
}

const BackgroundCardSkeleton: React.FC<BackgroundCardSkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/10 bg-primary/20 overflow-hidden aspect-video",
        className
      )}
    >
      {/* Image area skeleton */}
      <Skeleton className="w-full h-full rounded-none bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10" />

      {/* Overlay controls skeleton - matches BackgroundCard layout */}
      <div className="absolute inset-0 flex justify-between items-start p-2 pointer-events-none">
        <Skeleton className="size-6 rounded-full bg-black/40 shrink-0" />
        <Skeleton className="size-7 rounded-full bg-black/40 shrink-0" />
      </div>
    </div>
  );
};

export default BackgroundCardSkeleton;
