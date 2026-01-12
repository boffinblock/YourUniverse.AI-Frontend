"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useCallback } from "react";

interface StarProps {
    x: number;
    y: number;
    radius: number;
    opacity: number;
    twinkleSpeed: number | null;
    originalX: number;
    originalY: number;
}

interface StarBackgroundProps {
    starDensity?: number;
    allStarsTwinkle?: boolean;
    twinkleProbability?: number;
    minTwinkleSpeed?: number;
    maxTwinkleSpeed?: number;
    className?: string;
    repelRadius?: number;
    repelStrength?: number;
}

export const StarsBackground: React.FC<StarBackgroundProps> = ({
    starDensity = 0.0005,
    allStarsTwinkle = true,
    twinkleProbability = 0.08,
    minTwinkleSpeed = 0.5,
    maxTwinkleSpeed = 1,
    className,
    repelRadius = 100,
    repelStrength = 0.3,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<StarProps[]>([]);
    const mousePos = useRef({ x: -1000, y: -1000 });

    const generateStars = useCallback(
        (width: number, height: number) => {
            const area = width * height;
            const numStars = Math.floor(area * starDensity);
            const stars: StarProps[] = [];

            for (let i = 0; i < numStars; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const shouldTwinkle =
                    allStarsTwinkle || Math.random() < twinkleProbability;
                stars.push({
                    x,
                    y,
                    originalX: x,
                    originalY: y,
                    radius: Math.random() * 0.9 + 0.5,
                    opacity: Math.random() * 0.3 + 0.5,
                    twinkleSpeed: shouldTwinkle
                        ? minTwinkleSpeed +
                        Math.random() * (maxTwinkleSpeed - minTwinkleSpeed)
                        : null,
                });
            }
            return stars;
        },
        [
            starDensity,
            allStarsTwinkle,
            twinkleProbability,
            minTwinkleSpeed,
            maxTwinkleSpeed,
        ]
    );

    // Resize canvas to viewport
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            starsRef.current = generateStars(canvas.width, canvas.height);
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        return () => window.removeEventListener("resize", resizeCanvas);
    }, [generateStars]);

    // Mouse tracking
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
        };
        const handleMouseLeave = () => {
            mousePos.current = { x: -1000, y: -1000 };
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    // Animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            starsRef.current.forEach((star) => {
                // Twinkle
                if (star.twinkleSpeed !== null) {
                    star.opacity =
                        0.5 +
                        Math.abs(Math.sin(Date.now() * 0.001 / star.twinkleSpeed) * 0.5);
                }

                // Repel effect
                const dx = star.x - mousePos.current.x;
                const dy = star.y - mousePos.current.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < repelRadius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (1 - dist / repelRadius) * repelStrength * 20;
                    star.x += Math.cos(angle) * force;
                    star.y += Math.sin(angle) * force;
                } else {
                    star.x += (star.originalX - star.x) * 0.02;
                    star.y += (star.originalY - star.y) * 0.02;
                }

                // Draw star
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [repelRadius, repelStrength]);

    return (
        <canvas
            ref={canvasRef}
            className={cn("h-full w-full absolute inset-0 pointer-events-none", className)}
        />
    );
};

