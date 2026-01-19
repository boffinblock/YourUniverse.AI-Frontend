"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutSection() {
    return (
        <section className="relative w-full py-24 px-4 overflow-hidden">
            <div className="mx-auto max-w-7xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                            <Sparkles className="w-4 h-4" />
                            <span>Our Mission</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                            Technology with <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">Empathy at its Core</span>
                        </h2>

                        <p className="text-lg text-gray-400 leading-relaxed">
                            YourUniverse.AI believes that Artificial Intelligence should be
                            personal, private, and something that can make life better. We
                            are building a platform where you are in control, Your own
                            Universe.
                        </p>

                        <p className="text-lg text-gray-400 leading-relaxed">
                            Whether you want a supportive friend, help with daily tasks, a
                            creative writing partner, or an immersive roleplay experience,
                            YourUniverse.AI gives is there to support you.
                        </p>

                        <div className="pt-4">
                            <Link href="/about">
                                <Button className="rounded-full h-12 px-8 bg-white text-black hover:bg-gray-100 font-bold group">
                                    Read More About Us
                                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right Visual (Abstract Representation) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[500px] w-full rounded-3xl overflow-hidden border border-white/10"
                    >
                        <Image
                            src="/about-art.png"
                            alt="Digital Companionship Art"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F111A] via-transparent to-transparent opacity-60" />
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
