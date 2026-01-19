"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe, Wand2, BookTemplate } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    {
        title: "Prebuilt Worlds",
        description: "Jump into fully realized universes with rich characters and storylines ready to explore",
        icon: Globe,
        gradient: "from-pink-500 to-rose-500",
        bgGradient: "from-pink-500/20 to-rose-500/20",
    },
    {
        title: "Custom Creation",
        description: "Design your own characters, scenarios, and worlds from scratch.",
        icon: Wand2,
        gradient: "from-blue-500 to-cyan-500",
        bgGradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
        title: "Lorebooks",
        description: " Add depth and consistency with detailed keywords and terms to add depth and further enhance the conversation.",
        icon: BookTemplate,
        gradient: "from-emerald-500 to-green-500",
        bgGradient: "from-emerald-500/20 to-green-500/20",
    },
];

export default function BuildUniverses() {
    return (
        <section className="relative w-full py-24 px-4">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-5xl font-bold text-white tracking-tight"
                    >
                        Build Living Universes
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        Interact with prebuilt characters and worlds, or create your own. Enhance experiences with lorebooks for deeper, more consistent interactions.
                    </motion.p>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative p-8 rounded-2xl bg-[#0F111A] border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(0,0,0,0.3)] text-center"
                        >
                            {/* Icon */}
                            <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg bg-linear-to-br",
                                feature.gradient
                            )}>
                                <feature.icon className="w-8 h-8 text-white" />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-white mb-4">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
