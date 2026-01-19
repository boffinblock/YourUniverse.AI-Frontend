"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Shield, Server, Infinity } from "lucide-react";
import YourUniverse from "../icons/your-universe";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StarsBackground } from "@/components/elements/stars-background";

export default function LandingHero() {
    const containerRef = React.useRef<HTMLElement>(null);
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        containerRef.current.style.setProperty("--mouse-x", `${x}px`);
        containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 pt-16 pb-16 md:pt-32 group"
        >
            {/* Mouse Glow Effect */}
            <div
                className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{
                    background: isMounted ? `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(85,46,251,0.15), transparent 40%)` : undefined,
                }}
            />

            {/* Stars Background */}
            <StarsBackground
                starDensity={0.0003}
                allStarsTwinkle={true}
                twinkleProbability={0.7}
                minTwinkleSpeed={0.5}
                maxTwinkleSpeed={1.5}
                className="z-0"
            />

            <div className="z-10 flex w-full max-w-5xl flex-col items-center text-center">

                {/* Logo and Badge */}
                
                {/* <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className=" flex flex-col items-center"
                >
                    <div className="relative h-fit w-[20rem]  transition-transform duration-300 group-hover:scale-110 text-white">
                        <YourUniverse />
                    </div>
                </motion.div> */}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="mb-8 flex flex-col items-center gap-2"
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/20 px-4 py-1.5 text-sm font-medium text-blue-300 backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:bg-blue-950/30 transition-colors">
                        <Lock className="h-3.5 w-3.5" />
                        <span>Privacy-First AI Platform</span>
                    </div>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                    className="mb-6 max-w-4xl text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl"
                >
                    A Gateway to a Universe <br className="hidden md:block" />
                    <span className="bg-linear-to-b from-gray-100 to-gray-400 bg-clip-text text-transparent">
                        of Your Own
                    </span>
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                    className="mb-10 max-w-2xl text-lg text-gray-400 md:text-xl leading-relaxed"
                >
                    YourUinverse.AI is an AI Chatbot that servers as a gateway to a Universe of your own. A
                    temporary escape, an aid to accomplish tasks, and a companion to carry with you.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                    className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6"
                >
                    <Button
                        size="lg"
                        className="h-14 rounded-full bg-[#552EFB] px-8 text-lg font-semibold text-white shadow-[0_0_30px_rgba(85,46,251,0.3)] transition-all hover:bg-[#4422e0] hover:scale-105 hover:shadow-[0_0_40px_rgba(85,46,251,0.5)]"
                    >
                        Start Exploring
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className="h-14 rounded-full border-white/10 bg-transparent px-8 text-lg font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
                    >
                        Learn More
                    </Button>
                </motion.div>

                {/* Bottom Features */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                    className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16 text-sm md:text-base font-medium text-gray-400"
                >
                    <div className="flex items-center gap-2 transition-colors hover:text-blue-400">
                        <Shield className="h-5 w-5 text-blue-500" />
                        <span>Private by Design</span>
                    </div>
                    <div className="flex items-center gap-2 transition-colors hover:text-cyan-400">
                        <Server className="h-5 w-5 text-cyan-500" />
                        <span>Self or Cloud-Hostable</span>
                    </div>
                    <div className="flex items-center gap-2 transition-colors hover:text-purple-400">
                        <Infinity className="h-5 w-5 text-purple-500" />
                        <span>Unlimited Customization</span>
                    </div>
                </motion.div>
            </div>

            {/* Background Ambient Effects */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                <div className="h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
            </div>
            <div className="pointer-events-none absolute top-0 left-0">
                <div className="h-[400px] w-[400px] rounded-full bg-purple-900/10 blur-[100px]" />
            </div>
        </section>
    );
}
