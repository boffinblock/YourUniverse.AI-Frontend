"use client";

import React from "react";
import { motion } from "framer-motion";
import { EyeOff, Lock, ShieldCheck, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const features = [
    {
        title: "Minimal Logging",
        description: "We only collect what's necessary for functionality",
        icon: EyeOff,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
    },
    {
        title: "Strong Security",
        description: "Enterprise-grade encryption and compliance",
        icon: Lock,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
    },
    {
        title: "You Own Your Data",
        description: "Export, delete, or host it yourself anytime",
        icon: ShieldCheck,
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
    },
];

export default function TrustTransparency() {
    return (
        <section className="relative w-full py-24 px-4 border-t border-white/5 bg-[#0a0a0a]">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="text-center mb-20 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge variant="outline" className="px-4 py-1.5 border-emerald-500/30 text-emerald-400 bg-emerald-500/5 gap-2 rounded-full mb-4">
                            <Info className="w-3.5 h-3.5" />
                            Privacy-First Platform
                        </Badge>
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
                            Built on Trust & Transparency
                        </h2>
                        <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            We're not here to harvest your data or build a dystopian AI experience. YourUniverse.AI exists as a safe, private alternative where you're in control.
                        </p>
                    </motion.div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group hover:-translate-y-1 transition-transform duration-300"
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${feature.bgColor}`}>
                                <feature.icon className={`w-8 h-8 ${feature.color}`} />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed max-w-xs mx-auto">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
