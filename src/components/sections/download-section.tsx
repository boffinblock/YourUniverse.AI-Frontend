"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Download,
    Server,
    Brain,
    Cloud,
    Command,
    Monitor
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
    {
        title: "Downloadable App",
        description: "Run locally on your machine",
        icon: Download,
        color: "text-blue-400"
    },
    {
        title: "Self-Hosted",
        description: "Full control over your data",
        icon: Server,
        color: "text-purple-400"
    },
    {
        title: "Any LLM",
        description: "Choose your preferred model",
        icon: Brain,
        color: "text-teal-400"
    },
    {
        title: "Cloud or Local",
        description: "Flexible deployment options",
        icon: Cloud,
        color: "text-pink-400"
    }
];

export default function DownloadSection() {
    return (
        <section className="relative w-full py-20 px-4">
            <div className="mx-auto max-w-6xl">

                {/* Main Gradient Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-b from-blue-900/40 via-[#0F111A] to-[#0F111A] border border-blue-500/20 shadow-2xl p-8 md:p-16 text-center"
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

                    {/* Content Header */}
                    <div className="relative z-10 max-w-2xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                            Your Universe, Your Rules
                        </h2>
                        <p className="text-lg text-gray-400 leading-relaxed">
                            Download our local app and take complete control. Host your own chat, use any LLM, and keep everything private.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {features.map((feature, index) => (
                            <div
                                key={feature.title}
                                className="p-6 rounded-2xl bg-[#0a0a0a]/50 border border-white/5 hover:border-blue-500/30 transition-colors group"
                            >
                                <feature.icon className={cn("w-8 h-8 mb-4 mx-auto transition-transform group-hover:scale-110", feature.color)} />
                                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            className="h-14 px-8 rounded-full bg-white text-black hover:bg-gray-100 font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all"
                        >
                            <Monitor className="w-5 h-5 mr-2" />
                            Download for Windows
                        </Button>
                        <Button
                            className="h-14 px-8 rounded-full bg-[#0a0a0a] text-white hover:bg-black border border-white/10 font-bold text-lg hover:border-white/20 transition-all"
                        >
                            <Command className="w-5 h-5 mr-2" />
                            Download for Mac
                        </Button>
                    </div>

                </motion.div>
            </div>
        </section>
    );
}
