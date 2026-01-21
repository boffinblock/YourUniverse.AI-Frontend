"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const blogPosts = [
    {
        category: "TECH",
        title: "The Future of Local LLMs",
        excerpt: "Why running AI on your own hardware is the ultimate privacy move.",
        date: "Jan 2, 2025",
        author: "Dev Team"
    },
    {
        category: "GUIDE",
        title: "Creating Immersive Lorebooks",
        excerpt: "A guide to building deep, consistent worlds for your AI characters.",
        date: "Dec 28, 2024",
        author: "Community"
    },
    {
        category: "UPDATE",
        title: "Update v1.2.0 Release Notes",
        excerpt: "New character editor features, performance improvements, and more.",
        date: "Dec 15, 2024",
        author: "Engineering"
    },
    {
        category: "GUIDE",
        title: "Creating Immersive Lorebooks",
        excerpt: "A guide to building deep, consistent worlds for your AI characters.",
        date: "Dec 28, 2024",
        author: "Community"
    },
    {
        category: "UPDATE",
        title: "Update v1.2.0 Release Notes",
        excerpt: "New character editor features, performance improvements, and more.",
        date: "Dec 15, 2024",
        author: "Engineering"
    },
    {
        category: "DESIGN",
        title: "The Art of Character Design",
        excerpt: "Tips and tricks for creating visually stunning and believable complex AI personas.",
        date: "Dec 10, 2024",
        author: "Design Team"
    }
];

export default function BlogPage() {
    return (
        <div className="min-h-screen  text-white pt-24 pb-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-16">
                    {/* Logo */}
                 

                    {/* Title and Subtitle */}
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl text-white/90 lg:text-6xl font-bold tracking-tight">
                            Latest News & Updates
                        </h1>
                        <div className="flex items-center gap-2 text-gray-400">
                            <p className="text-sm md:text-base">
                                Stay up to date with the latest features, guides, and community stories from the YourUniverse.AI team.
                            </p>
                            <ArrowRight className="w-5 h-5 flex-shrink-0" />
                        </div>
                    </div>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {blogPosts.map((post, index) => (
                        <motion.article
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative bg-[#0a0d1a] border border-blue-900/30 rounded-2xl p-6 hover:border-blue-700/50 transition-all duration-300 cursor-pointer"
                        >
                            {/* Category Badge */}
                            <div className="mb-4">
                                <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-400 bg-blue-500/10 rounded-full border border-blue-500/20">
                                    {post.category}
                                </span>
                                <span className="float-right text-xs text-gray-500">{post.date}</span>
                            </div>

                            {/* Title */}
                            <h2 className="text-xl md:text-2xl text-white/90 font-bold mb-3 group-hover:text-blue-400 transition-colors">
                                {post.title}
                            </h2>

                            {/* Excerpt */}
                            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                                {post.excerpt}
                            </p>

                            {/* Author */}
                            <div className="text-xs text-gray-500">
                                By {post.author}
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </div>
    );
}
