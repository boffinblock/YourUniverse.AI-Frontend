import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface PersonaCardSkeletonProps {
    className?: string;
}

const PersonaCardSkeleton: React.FC<PersonaCardSkeletonProps> = ({ className }) => {
    return (
        <Card
            className={cn(
                "rounded-4xl border overflow-hidden bg-primary/20 backdrop-filter backdrop-blur-lg relative",
                className
            )}
        >
            <CardHeader className="p-0 m-0 relative">
                {/* Header controls skeleton */}
                <div className="w-full absolute top-3 z-10 flex items-start justify-between px-4">
                    <Skeleton className="size-6 rounded-full bg-gray-800/50" />
                    <Skeleton className="size-6 rounded-full bg-gray-800/50" />
                </div>

                {/* Avatar skeleton */}
                <Skeleton className="w-full h-48 rounded-none bg-gradient-to-br from-gray-800/50 to-gray-900/50" />
            </CardHeader>

            <CardContent className="space-y-2 px-4">
                {/* Title skeleton */}
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-32 bg-gray-800/50" />
                    <Skeleton className="h-4 w-20 bg-gray-800/50" />
                </div>

                {/* Rating skeleton */}
                <div className="flex items-center gap-2 -mt-1">
                    <Skeleton className="h-4 w-20 bg-gray-800/50" />
                    <Skeleton className="h-3 w-12 bg-gray-800/50" />
                </div>

                {/* Tags skeleton */}
                <div className="flex gap-2 flex-wrap">
                    <Skeleton className="h-5 w-16 bg-gray-800/50 rounded-full" />
                    <Skeleton className="h-5 w-20 bg-gray-800/50 rounded-full" />
                    <Skeleton className="h-5 w-14 bg-gray-800/50 rounded-full" />
                </div>

                {/* Description skeleton */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-gray-800/50" />
                    <Skeleton className="h-4 w-full bg-gray-800/50" />
                    <Skeleton className="h-4 w-3/4 bg-gray-800/50" />
                </div>

                {/* Visibility skeleton */}
                <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-16 bg-gray-800/50" />
                    <Skeleton className="h-3 w-24 bg-gray-800/50" />
                </div>
            </CardContent>

            <CardFooter className="flex justify-between px-4 py-2 border-t border-primary/70">
                <Skeleton className="h-3 w-24 bg-gray-800/50" />
                <Skeleton className="h-3 w-24 bg-gray-800/50" />
            </CardFooter>
        </Card>
    );
};

export default PersonaCardSkeleton;
