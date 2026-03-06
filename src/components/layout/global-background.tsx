/**
 * GlobalBackground Component
 * Renders the user's global default background as a fixed backdrop.
 * Includes smooth cross-fade transitions for background changes.
 */
"use client";

import React from "react";
import { useActiveBackground } from "@/hooks/background";
import { cn } from "@/lib/utils";

interface GlobalBackgroundProps {
    className?: string;
    showStars?: boolean;
}

export const GlobalBackground: React.FC<GlobalBackgroundProps> = ({
    className,
}) => {
    const { background, isLoading } = useActiveBackground();
    const [currentBg, setCurrentBg] = React.useState<string | null>(null);
    const [prevBg, setPrevBg] = React.useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = React.useState(false);

    // Handle background transitions
    React.useEffect(() => {
        if (background?.image?.url && background.image.url !== currentBg) {
            setPrevBg(currentBg);
            setCurrentBg(background.image.url);
            setIsTransitioning(true);

            // Allow time for the fade animation to complete
            const timer = setTimeout(() => setIsTransitioning(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [background?.image?.url]);

    if (isLoading || (!currentBg && !prevBg)) {
        return <div className="fixed inset-0 pointer-events-none -z-50 bg-black" />;
    }

    return (
        <div
            className={cn(
                "fixed inset-0 pointer-events-none overflow-hidden bg-black -z-50",
                className
            )}
        >
            {/* Previous Background (fading out) */}
            {prevBg && (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out scale-105"
                    style={{
                        backgroundImage: `url(${prevBg})`,
                        filter: "blur(6px) brightness(0.9) contrast(1.1)",
                        opacity: isTransitioning ? 1 : 0,
                    }}
                />
            )}

            {/* Current Background (fading in) */}
            {currentBg && (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out scale-105"
                    style={{
                        backgroundImage: `url(${currentBg})`,
                        filter: "blur(5px) brightness(1) contrast(1.1)",
                        opacity: isTransitioning ? (prevBg ? 0 : 1) : 1,
                    }}
                />
            )}

            {/* Overlay gradient to ensure content readability */}
            <div className="absolute inset-0 bg-black/40" />
        </div>
    );
};
