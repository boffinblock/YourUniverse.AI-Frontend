"use client";

import React from "react";
import Link from "next/link";
import { Twitter, Disc, Github } from "lucide-react";
import YourUniverse from "../icons/your-universe";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const footerLinks = {
    product: [
        { name: "Features", href: "/features" },
        { name: "Pricing", href: "/pricing" },
        { name: "Download", href: "/download" },
        { name: "Character Market", href: "/market" },
    ],
    community: [
        { name: "Forum", href: "/forum" },
        { name: "Blog", href: "/blog" },
        { name: "Discord", href: "https://discord.gg/youruniverse" },
        { name: "Creators", href: "/creators" },
    ],
    company: [
        { name: "About", href: "/about" },
        { name: "Privacy", href: "/privacy" },
        { name: "Terms", href: "/terms" },
    ],
};

export default function LandingFooter() {
    return (
        <footer className="w-full bg-[#0a0a0a] border-t border-white/5 pt-16 pb-8 px-4">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative flex h-8 w-8 items-center justify-center text-white transition-transform duration-300 group-hover:scale-110">
                                <YourUniverse />
                            </div>
                            <span className="text-xl font-bold text-white tracking-wide">
                                YourUniverse.AI
                            </span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed max-w-sm">
                            A gateway to a universe of your own. Private, safe, and infinitely customizable.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                                <Disc className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                                <Github className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-white text-lg">Product</h4>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-gray-400 hover:text-blue-400 transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-white text-lg">Community</h4>
                        <ul className="space-y-2">
                            {footerLinks.community.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-gray-400 hover:text-blue-400 transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-white text-lg">Company</h4>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-gray-400 hover:text-blue-400 transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button className="text-gray-400 hover:text-blue-400 transition-colors">
                                            Contact
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="border-primary bg-primary/30 backdrop-blur-sm">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-white">Open Preferred Email?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Do you want to open your preferred email to contact YourUniverse.AI
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <div className="flex justify-end gap-2 mt-4">
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => window.location.href = "mailto:support@youruniverse.ai"}>
                                                Yes
                                            </AlertDialogAction>
                                        </div>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">
                        © 2024 YourUniverse.AI. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Built with privacy and imagination in mind</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
