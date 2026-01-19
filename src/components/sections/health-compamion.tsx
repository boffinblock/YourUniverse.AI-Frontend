"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Upload, Bell, Scan, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HealthCompanion() {
    return (
        <section className="relative w-full py-24 px-4 overflow-hidden">
            {/* Background Soft Glows */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="mx-auto max-w-5xl relative z-10 text-center space-y-12">

                {/* Badge/Label */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium"
                >
                    <ShieldCheck className="w-4 h-4" />
                    Your AI Health Companion
                </motion.div>

                {/* Main Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="space-y-6"
                >
                    <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                        Never Miss a Dose, <br className="hidden md:block" />
                        <span className="text-blue-500">Never Feel Alone</span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Upload your prescriptions, get timely medicine reminders, and chat with your caring AI companion whenever you need support.
                    </p>
                </motion.div>

                {/* Main Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <Button
                        size="lg"
                        className="h-14 px-10 rounded-2xl bg-[#552EFB] hover:bg-[#4422e0] text-white font-bold text-lg shadow-[0_0_30px_rgba(85,46,251,0.3)] transition-all flex items-center gap-3 group"
                    >
                        <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                        Upload Prescription
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="h-14 px-10 rounded-2xl border-white/10 text-white hover:bg-white/10 font-bold text-lg transition-all flex items-center gap-3"
                    >
                        <Bell className="w-5 h-5" />
                        Learn More
                    </Button>
                </motion.div>

                {/* Feature Pills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-wrap items-center justify-center gap-4 pt-8"
                >
                    {[
                        { icon: Scan, text: "Smart Prescription Scanning" },
                        { icon: Clock, text: "Timely Reminders" },
                        { icon: MessageSquare, text: "24/7 AI Support" }
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-blue-500/30 transition-all cursor-default"
                        >
                            <feature.icon className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-semibold tracking-wide">{feature.text}</span>
                        </div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
}
