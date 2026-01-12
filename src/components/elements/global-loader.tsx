"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface GlobalLoaderProps {
    isLoading: boolean;
    className?: string;
}

const GlobalLoader: React.FC<GlobalLoaderProps> = ({ isLoading, className }) => {
    return (
        <div
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
                isLoading
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-full pointer-events-none",
                className
            )}
        >
            <div className="h-1 w-full bg-primary/10 relative overflow-hidden">
                {/* Animated progress bar with gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer" />
                {/* Secondary shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-primary/60 to-primary/40 animate-shimmer" style={{ animationDelay: "0.75s" }} />
            </div>
        </div>
    );
};

export default GlobalLoader;

