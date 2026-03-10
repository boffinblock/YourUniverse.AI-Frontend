import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface FolderCardSkeletonProps {
  className?: string;
}

/**
 * Skeleton for FolderCard (Realm) — matches the folder tab + card body layout:
 * tab on top with checkbox + "Realm", then main card with title, tags, description, members.
 */
const FolderCardSkeleton: React.FC<FolderCardSkeletonProps> = ({ className }) => {
  return (
    <div className={cn("group relative rounded-4xl transition-all duration-500", className)}>
      {/* Folder Tab — same as FolderCard */}
      <div className="absolute -top-8 left-0 h-10 w-32 bg-primary/80 backdrop-blur-xl border-t border-x border-primary/30 rounded-t-2xl flex items-center px-4">
        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded-full bg-gray-800/50" />
          <Skeleton className="h-3 w-12 bg-white/20 rounded" />
        </div>
      </div>

      {/* Main Card Body — same structure as FolderCard */}
      <Card className="relative overflow-hidden p-6 rounded-none rounded-b-3xl rounded-tr-3xl border backdrop-blur-3xl border-white/10 bg-primary/20">
        <div className="absolute -right-20 -top-20 size-40 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 size-40 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Header: title + tags + dropdown */}
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1 flex-1">
              <Skeleton className="h-6 w-40 bg-gray-800/50 rounded" />
              <div className="flex gap-1.5 flex-wrap">
                <Skeleton className="h-5 w-14 bg-gray-800/50 rounded-full" />
                <Skeleton className="h-5 w-16 bg-gray-800/50 rounded-full" />
                <Skeleton className="h-5 w-12 bg-gray-800/50 rounded-full" />
              </div>
            </div>
            <Skeleton className="size-8 rounded-full bg-gray-800/50 shrink-0" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-full bg-gray-800/50 rounded" />
            <Skeleton className="h-3.5 w-full bg-gray-800/50 rounded" />
            <Skeleton className="h-3.5 w-[80%] bg-gray-800/50 rounded" />
          </div>

          {/* Members section placeholder */}
          <div className="pt-2 border-t border-white/10">
            <Skeleton className="h-3 w-16 bg-white/20 rounded mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-12 w-full bg-gray-800/30 rounded-xl" />
              <Skeleton className="h-12 w-full bg-gray-800/30 rounded-xl" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FolderCardSkeleton;
