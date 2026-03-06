import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LorebookCardSkeletonProps {
    className?: string;
}

const LorebookCardSkeleton: React.FC<LorebookCardSkeletonProps> = ({ className }) => {
    return (
        <Card
            className={cn(
                "rounded-2xl border overflow-hidden bg-primary/20 backdrop-blur-xl relative flex flex-row min-h-[200px]",
                className
            )}
        >
            {/* Left: Image skeleton - 40% width */}
            <CardHeader className="p-0 m-0 relative shrink-0 w-[40%] min-w-[40%] self-stretch overflow-hidden border-r border-white/5 rounded-l-2xl">
                <div className="absolute top-2 left-2 z-10">
                    <Skeleton className="size-6 rounded-full bg-gray-800/50" />
                </div>
                <div className="absolute top-2 right-2 z-10 flex gap-1">
                    <Skeleton className="size-7 rounded-full bg-gray-800/50" />
                    <Skeleton className="size-7 rounded-full bg-gray-800/50" />
                </div>
                <Skeleton className="w-full h-full min-h-[200px] rounded-l-2xl bg-primary/20 animate-pulse" />
            </CardHeader>

            {/* Right: Content + Footer */}
            <div className="flex flex-col flex-1 min-w-0">
                <CardContent className="space-y-2.5 py-4 px-5 flex-1">
                    <div className="flex justify-between items-start gap-2">
                        <Skeleton className="h-5 w-32 bg-gray-800/50" />
                        <div className="flex gap-1.5">
                            <Skeleton className="h-4 w-20 bg-gray-800/50" />
                            <Skeleton className="h-4 w-12 bg-gray-800/50" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-20 bg-gray-800/50" />
                        <Skeleton className="h-3 w-16 bg-gray-800/50" />
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                        <Skeleton className="h-5 w-16 bg-gray-800/50 rounded-full" />
                        <Skeleton className="h-5 w-20 bg-gray-800/50 rounded-full" />
                        <Skeleton className="h-5 w-14 bg-gray-800/50 rounded-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full bg-gray-800/50" />
                        <Skeleton className="h-4 w-full bg-gray-800/50" />
                        <Skeleton className="h-4 w-3/4 bg-gray-800/50" />
                    </div>
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-3 w-20 bg-gray-800/50" />
                        <Skeleton className="h-7 w-16 rounded-full bg-gray-800/50" />
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between px-5 py-2 border-t border-white/5 mt-auto">
                    <Skeleton className="h-3 w-24 bg-gray-800/50" />
                    <Skeleton className="h-3 w-24 bg-gray-800/50" />
                </CardFooter>
            </div>
        </Card>
    );
};

export default LorebookCardSkeleton;
