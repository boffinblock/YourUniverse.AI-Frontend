"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    User,
    BookOpen,
    Palette,
    Store,
    ArrowRight,
    Star
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const marketItems = [
    {
        title: "Elara the Wise",
        category: "Fantasy Character",
        price: "$4.99",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", // Placeholder
        gradient: "from-purple-500/20 to-blue-500/20"
    },
    {
        title: "Neo City Pack",
        category: "Background Set",
        price: "$6.99",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1515630278258-407f66498911?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", // Placeholder
        gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
        title: "Arcane Lorebook",
        category: "Lorebook",
        price: "$3.99",
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", // Placeholder
        gradient: "from-amber-500/20 to-orange-500/20"
    },
    {
        title: "ARIA Assistant",
        category: "AI Helper",
        price: "$5.99",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", // Placeholder
        gradient: "from-emerald-500/20 to-teal-500/20"
    }
];

const features = [
    {
        icon: User,
        title: "Custom Characters",
        description: "Unique personalites, scenarios, worlds or universe crafted by talented Creators"
    },
 
    {
        icon: Palette,
        title: "Avatars & Backgrounds",
        description: "ustom and unique Avatars and Backgrounds created by Artist for Your Universe"
    },
       {
        icon: BookOpen,
        title: "Lorebooks",
        description: "Add context and depth to conversations and universe’s with Lorebooks"
    }
];

export default function CharacterMarket() {
    return (
        <section className="relative w-full py-20 px-4 overflow-hidden">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Column: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <Badge variant="secondary" className="px-4 py-2 bg-[#1A1D2B] text-blue-400 hover:bg-[#1A1D2B]/80 text-sm border-blue-500/20 gap-2">
                            <Store className="w-4 h-4" />
                            Creator Economy
                        </Badge>

                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                                The Character Market
                            </h2>
                            <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
                                The Character Market is a place to connect
                                with Creators to have unique Characters,
                                Personas, Lorebooks, Avatars and
                                Backgrounds created. Build Your perfect
                                Universe with custom assets.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
                                    className="flex items-start gap-4"
                                >
                                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white text-lg">{feature.title}</h3>
                                        <p className="text-gray-400">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 gap-2">
                            Explore Market
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </motion.div>

                    {/* Right Column: Market Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {marketItems.map((item, index) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group relative bg-[#0F111A] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300"
                            >
                                {/* Image Area */}
                                <div className="aspect-[16/10] overflow-hidden relative">
                                    <div className={`absolute inset-0 bg-linear-to-b ${item.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                    />
                                </div>

                                {/* Content Area */}
                                <div className="p-5 space-y-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {item.category}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                        <span className="font-semibold text-blue-400">
                                            {item.price}
                                        </span>
                                        <div className="flex items-center gap-1 text-sm text-gray-300">
                                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                            <span>{item.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
