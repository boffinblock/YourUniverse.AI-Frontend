"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Users,
    Lightbulb,
    BarChart2,
    Music,
    MessageSquare,
    Clock,
    ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const discussions = [
    {
        title: "Best LLMs for Fantasy Roleplay?",
        description: "Looking for recommendations on models that handle creative storytelling well...",
        replies: 24,
        timeAgo: "2h ago",
        avatarColor: "bg-pink-500",
    },
    {
        title: "Music Recommendations for Ambiance",
        description: "Share your favorite soundtracks for different AI chat scenarios...",
        replies: 18,
        timeAgo: "5h ago",
        avatarColor: "bg-emerald-500",
    },
    {
        title: "Tips for Creating Consistent Characters",
        description: "How do you maintain personality consistency across long conversations?...",
        replies: 32,
        timeAgo: "1d ago",
        avatarColor: "bg-blue-500",
    },
];

const features = [
    {
        icon: Lightbulb,
        text: "Share creative tips and techniques",
        color: "text-blue-400"
    },
    {
        icon: BarChart2,
        text: "Compare and discuss LLM performance",
        color: "text-blue-400"
    },
    {
        icon: Music,
        text: "Discover ambient music for immersion",
        color: "text-cyan-400"
    },
    {
        icon: Users,
        text: "Get help from experienced creators",
        color: "text-purple-400"
    }
];

export default function CommunityForums() {
    return (
        <section className="relative w-full py-20 px-4 overflow-hidden">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Column: Recent Discussions Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="rounded-3xl bg-[#0F111A] border border-white/5 p-6 md:p-8 relative overflow-hidden group hover:border-white/10 transition-colors shadow-2xl">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-white">Recent Discussions</h3>
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                            </div>

                            {/* Discussions List */}
                            <div className="space-y-4">
                                {discussions.map((item, index) => (
                                    <div
                                        key={index}
                                        className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                                    >
                                        <div className="flex gap-4">
                                            {/* Avatar Placeholder */}
                                            <div className={`w-10 h-10 rounded-full shrink-0 ${item.avatarColor} flex items-center justify-center text-white font-bold text-xs`}>
                                                {item.title.charAt(0)}
                                            </div>

                                            <div className="space-y-1">
                                                <h4 className="font-semibold text-white text-sm line-clamp-1">{item.title}</h4>
                                                <p className="text-xs text-gray-400 line-clamp-1">{item.description}</p>

                                                <div className="flex items-center gap-4 pt-1">
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <MessageSquare className="w-3 h-3" />
                                                        <span>{item.replies} replies</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{item.timeAgo}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <Badge variant="secondary" className="px-4 py-2 bg-[#1A1D2B] text-blue-400 hover:bg-[#1A1D2B]/80 text-sm border-blue-500/20 gap-2">
                            <Users className="w-4 h-4" />
                            Community Hub
                        </Badge>

                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                                Forums & Community
                            </h2>
                            <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
                                Join discussions about AI, share tips for creating characters and lorebooks, compare LLMs, and discover music to enhance your experiences.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
                                    className="flex items-center gap-3"
                                >
                                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                                    <span className="text-gray-300 font-medium">{feature.text}</span>
                                </motion.div>
                            ))}
                        </div>

                        <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 gap-2">
                            Join Community
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
