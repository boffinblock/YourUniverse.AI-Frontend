import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CharacterCardSkeletonProps {
  className?: string;
}

const CharacterCardSkeleton: React.FC<CharacterCardSkeletonProps> = ({ className }) => {
  return (
    <Card
      className={cn(
        "group rounded-2xl w-full overflow-hidden bg-primary/20 backdrop-blur-xl border border-white/10",
        "flex flex-row min-h-[200px]",
        className
      )}
    >
      {/* Left: Character image - 40% width, full height (matches CharacterCard) */}
      <div className="p-0 m-0 relative shrink-0 w-[40%] min-w-[40%] self-stretch overflow-hidden border-r border-white/5 rounded-l-2xl">
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
          {/* Checkbox placeholder */}
          <Skeleton className="size-6 rounded-full bg-gray-800/70" />
        </div>

        <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
          {/* Favourite + menu placeholders */}
          <Skeleton className="size-7 rounded-full bg-black/50" />
          <Skeleton className="size-7 rounded-full bg-black/50" />
        </div>

        {/* Image area */}
        <Skeleton className="absolute inset-0 w-full h-full rounded-none bg-linear-to-br from-gray-800/60 to-gray-900/80" />
      </div>

      {/* Right: Content + Footer */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Content */}
        <div className="space-y-2.5 py-4 px-5 flex-1">
          {/* Title + tokens + rating badge */}
          <div className="flex justify-between items-start gap-2">
            <Skeleton className="h-5 w-32 bg-gray-800/60 rounded" />
            <div className="flex items-center gap-1.5 shrink-0">
              <Skeleton className="h-3.5 w-16 bg-gray-800/60 rounded" />
              <Skeleton className="h-4 w-10 bg-gray-800/60 rounded" />
            </div>
          </div>

          {/* Rating + chats */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-20 bg-gray-800/60 rounded" />
            <Skeleton className="h-3 w-14 bg-gray-800/60 rounded" />
          </div>

          {/* Tags */}
          <div className="flex gap-1.5 flex-wrap">
            <Skeleton className="h-5 w-14 bg-gray-800/60 rounded-full" />
            <Skeleton className="h-5 w-16 bg-gray-800/60 rounded-full" />
            <Skeleton className="h-5 w-12 bg-gray-800/60 rounded-full" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-full bg-gray-800/60 rounded" />
            <Skeleton className="h-3.5 w-full bg-gray-800/60 rounded" />
            <Skeleton className="h-3.5 w-[80%] bg-gray-800/60 rounded" />
          </div>

          {/* Visibility + Chat button */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-20 bg-gray-800/60 rounded" />
            <Skeleton className="h-7 w-20 bg-gray-800/60 rounded-full" />
          </div>
        </div>

        {/* Footer (Created / Updated) */}
        <div className="flex justify-between items-center px-5 py-2 border-t border-white/5 gap-2">
          <Skeleton className="h-3 w-24 bg-gray-800/60 rounded" />
          <Skeleton className="h-3 w-24 bg-gray-800/60 rounded" />
        </div>
      </div>
    </Card>
  );
};

export default CharacterCardSkeleton;
