"use client";

import { motion } from "framer-motion";
import { Sparkles, Users, Shield, Lightbulb, Heart, Lock } from "lucide-react";

const principles = [
    {
        title: "Simplicity is Beauty, & Beauty is Complexity",
        icon: Sparkles,
        color: "from-blue-400 to-cyan-400",
        items: [
            "Ease of use",
            "Elegant solutions",
            "Beauty at the heart of everything we create"
        ]
    },
    {
        title: "You, then me",
        icon: Heart,
        color: "from-purple-400 to-pink-400",
        items: [
            "To create a quality AI chatbot experience that helps in as many ways as possible",
            "To create a trusted AI experience",
            "To create a resource that helps people live fuller lives",
            "To help people walk out the door"
        ]
    },
    {
        title: "Power is an Illusion & Control is Reality",
        icon: Shield,
        color: "from-green-400 to-emerald-400",
        items: [
            "To help people become more comfortable and in control when using AI",
            "To help people take control of their lives through our mental health / companionship characters",
            "To help our Elders feel more in control by providing companionship, and aid should the need arise.",
            "To hopefully make life better for us all"
        ]
    }
];

const features = [
    { icon: Lock, text: "Privacy-First", color: "text-blue-400" },
    { icon: Lightbulb, text: "Innovative", color: "text-purple-400" },
    { icon: Users, text: "Community-Driven", color: "text-pink-400" }
];

export default function AboutPage() {
    return (
        <div className="min-h-screen text-white pt-24 pb-16 px-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-20 text-center space-y-8"
                >
                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white/90">
                        Building the Universe of{" "}
                        <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Personal AI
                        </span>
                    </h1>

                    {/* Mission Paragraphs */}
                    <div className="space-y-6 text-gray-400 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
                        <p className="text-lg">
                            YourUniverse.AI serves as a gateway to a Universe of your own. A temporary escape, a companion, and an aid to keep by your side.
                        </p>
                        <p>
                            We set out to build a platform that allows access to powerful, locally-run AI models. We did this by combining a state-of-the-art interface design with robust privacy controls. Offering a sanctuary for writers, roleplayers, and dreamers.
                        </p>
                    </div>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={feature.text}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
                                >
                                    <Icon className={`w-4 h-4 ${feature.color}`} />
                                    <span className="text-sm text-gray-300">{feature.text}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Guiding Principles Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="space-y-8"
                >
                    <div className="text-center space-y-3">
                        <h2 className="text-3xl md:text-4xl font-bold text-white/90">
                            Guiding Principles
                        </h2>
                        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
                            We at YourUniverse.AI follow 3 guiding principles in everything we do.
                        </p>
                    </div>

                    {/* Principles Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        {principles.map((principle, index) => {
                            const Icon = principle.icon;
                            return (
                                <motion.div
                                    key={principle.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
                                    className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
                                >
                                    {/* Icon with Gradient Background */}
                                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${principle.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg md:text-xl font-bold text-white/90 mb-4 leading-tight">
                                        {principle.title}
                                    </h3>

                                    {/* Items */}
                                    <ul className="space-y-3">
                                        {principle.items.map((item, itemIndex) => (
                                            <li key={itemIndex} className="flex items-start gap-2 text-sm text-gray-400">
                                                <span className={`inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r ${principle.color} mt-1.5 flex-shrink-0`} />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Hover Glow Effect */}
                                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${principle.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
