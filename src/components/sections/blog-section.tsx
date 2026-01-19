"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const blogs = [
    {
        title: "The Future of Local LLMs",
        excerpt: "Why running AI on your own hardware is the ultimate privacy move.",
        date: "Jan 2, 2025",
        author: "Dev Team",
        category: "Tech"
    },
    {
        title: "Creating Immersive Lorebooks",
        excerpt: "A guide to building deep, consistent worlds for your AI characters.",
        date: "Dec 28, 2024",
        author: "Community",
        category: "Guide"
    },
    {
        title: "Update v1.2.0 Release Notes",
        excerpt: "New character editor features, performance improvements, and more.",
        date: "Dec 15, 2024",
        author: "Engineering",
        category: "Update"
    }
];

export default function BlogSection() {
    return (
        <section className="relative w-full py-24 px-4 bg-[#0a0a0a]">
            <div className="mx-auto max-w-7xl">

                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="space-y-4">
                        <Badge variant="outline" className="text-purple-400 border-purple-500/30 bg-purple-500/5">
                            From the Blog
                        </Badge>
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                            Latest Insights & Updates
                        </h2>
                    </div>
                    <Link href="/blog">
                        <Button variant="ghost" className="text-gray-400 hover:text-white group">
                            Explore All Articles
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogs.map((blog, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative flex flex-col p-6 rounded-2xl bg-[#0F111A] border border-white/5 hover:border-white/10 transition-all hover:bg-[#131620]"
                        >
                            <div className="mb-4">
                                <span className="text-xs font-medium text-purple-400 mb-2 block">{blog.category}</span>
                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                                    {blog.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                                    {blog.excerpt}
                                </p>
                            </div>

                            <div className="mt-auto flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    <span>{blog.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="w-3 h-3" />
                                    <span>{blog.author}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
