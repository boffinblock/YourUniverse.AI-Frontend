"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CtaSection() {
    return (
        <section className="relative w-full py-24 px-4 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none opacity-50" />

            <div className="relative z-10 mx-auto max-w-4xl text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="space-y-6"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                        Ready to Enter Your Universe?
                    </h2>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Join thousands of users creating their own AI experiences in a safe, private, and imaginative environment.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button
                        size="lg"
                        className="h-14 px-8 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transition-all transform hover:scale-105"
                    >
                        Get Started Free
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="h-14 px-8 rounded-full border-white/10 text-white hover:bg-white/5 font-medium text-lg transition-all"
                    >
                        View Pricing
                    </Button>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-sm text-gray-500 pt-4"
                >
                    No credit card required • Start exploring in minutes
                </motion.p>
            </div>
        </section>
    );
}
