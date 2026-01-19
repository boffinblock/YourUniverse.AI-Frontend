"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot, Briefcase, Landmark, MessageSquareHeart } from "lucide-react";
import { cn } from "@/lib/utils";

const experiences = [

    {
        title: "Daily Assistants",
        description: "Get help with tasks, planning, and productivity from specialized AI helpers",
        icon: Briefcase,
        gradient: "from-blue-500 to-cyan-500",
        bgGradient: "from-blue-500/20 to-cyan-500/20",
        iconColor: "text-white",
    },
    {
        title: "Friendship & Companionship",
        description: "Speak to a wide variety of Characters and take the first steps in opening up in a safe and private enviroment",
        icon: MessageSquareHeart,
        gradient: "from-violet-500 to-purple-500",
        bgGradient: "from-violet-500/20 to-purple-500/20",
        iconColor: "text-white",
    },
    {
        title: "Historical Journeys",
        description: "Embark on epic quests with unique characters in a variety of universes.",
        icon: Landmark,
        gradient: "from-emerald-500 to-green-500",
        bgGradient: "from-emerald-500/20 to-green-500/20",
        iconColor: "text-white",
    },
    {
        title: "Fantasy & Sci-Fi Adventures",
        description: "Embark on epic quests with characters from worlds beyond imagination",
        icon: Bot,
        gradient: "from-pink-500 to-rose-500",
        bgGradient: "from-pink-500/20 to-rose-500/20",
        iconColor: "text-white",
    },
];

export default function AiExperience() {
    return (
        <section className="relative w-full py-20 px-4">
            <div className="mx-auto max-w-7xl">

                {/* Section Header */}
                <div className="text-center mb-16 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-5xl font-bold text-white tracking-tight"
                    >
                        Choose Your AI Experience
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-lg text-gray-400 max-w-2xl mx-auto"
                    >
                        Choose from a wide range of premade and user created experiences to having a custom experience created for you.
                    </motion.p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative p-6 rounded-2xl bg-[#0F111A] border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(0,0,0,0.3)] overflow-hidden"
                        >
                            {/* Hover Glow Effect */}
                            <div className={cn(
                                "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-linear-to-br",
                                exp.gradient
                            )} />

                            {/* Icon */}
                            <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg bg-linear-to-br",
                                exp.gradient
                            )}>
                                <exp.icon className={cn("w-6 h-6", exp.iconColor)} />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 space-y-3">
                                <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-white group-hover:to-gray-300 transition-colors">
                                    {exp.title}
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                                    {exp.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
