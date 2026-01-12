"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const STAR_COUNT = 200;
const RADIUS = 150;

type Star = {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    glow: string;
};

export default function StarField() {
    const [stars, setStars] = useState<Star[]>([]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const generatedStars = Array.from({ length: STAR_COUNT }, (_, i) => ({
            id: i,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 2 + 1,
            color: "#ffffff",
            glow: "rgba(255,255,255,0.6)"
        }));
        setStars(generatedStars);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 bg-black overflow-hidden">
            {stars.map((star) => (
                <StarComponent key={star.id} star={star} mousePos={mousePos} />
            ))}
        </div>
    );
}

function StarComponent({ star, mousePos }: { star: Star; mousePos: { x: number; y: number } }) {
    const controls = useAnimation();
    const twinkleControls = useAnimation();

    // Random Twinkle Effect
    useEffect(() => {
        const twinkle = async () => {
            while (true) {
                const duration = 0.5 + Math.random() * 1.5;
                const delay = Math.random() * 2; // random delay for each star
                await twinkleControls.start({
                    opacity: [1, 0.3 + Math.random() * 0.5, 1],
                    scale: [1, 0.7 + Math.random() * 0.3, 1],
                    transition: { duration, ease: "easeInOut" }
                });
                await new Promise((res) => setTimeout(res, delay * 1000));
            }
        };
        twinkle();
    }, [twinkleControls]);

    // Mouse hover movement
    useEffect(() => {
        const dx = mousePos.x - star.x;
        const dy = mousePos.y - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < RADIUS) {
            controls.start({
                x: star.x + dx * 0.1,
                y: star.y + dy * 0.1,
                transition: { type: "spring", stiffness: 80, damping: 12 },
            });
        } else {
            controls.start({ x: star.x, y: star.y });
        }
    }, [mousePos, star.x, star.y, controls]);

    return (
        <motion.div
            animate={controls}
            initial={{ x: star.x, y: star.y }}
            className="absolute rounded-full"
            style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: star.color,
                boxShadow: `0 0 ${star.size * 8}px ${star.glow}`,
                borderRadius: "50%",
            }}
        >
            <motion.div
                animate={twinkleControls}
                initial={{ opacity: 1, scale: 1 }}
                className="w-full h-full rounded-full"
                style={{
                    backgroundColor: star.color,
                    boxShadow: `0 0 ${star.size * 12}px ${star.glow}`,
                }}
            />
        </motion.div>
    );
}
