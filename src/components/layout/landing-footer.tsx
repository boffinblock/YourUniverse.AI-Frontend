"use client";

import React, { useState } from "react";
import Link from "next/link";
import YourUniverse from "../icons/your-universe";
import Bluesky from "../icons/social/bluesky";
import Facebook from "../icons/social/facebook";
import Mastodon from "../icons/social/mastodon";
import Reddit from "../icons/social/reddit";
import TikTok from "../icons/social/tiktok";
import Twitter from "../icons/social/twitter";
import YouTube from "../icons/social/youtube";
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
import EnquiryModal from "@/components/modals/enquiry-modal";

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
        { name: "Creators", href: "/creators" },
    ],
    company: [
        { name: "About", href: "/about" },
        { name: "Privacy", href: "/privacy" },
        { name: "Terms", href: "/terms" },
    ],
};

const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Bluesky", icon: Bluesky, href: "#" },
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Mastodon", icon: Mastodon, href: "#" },
    { name: "Reddit", icon: Reddit, href: "#" },
    { name: "TikTok", icon: TikTok, href: "#" },
    { name: "YouTube", icon: YouTube, href: "#" },
];

export default function LandingFooter() {
        const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
    
    return (
        <footer className="w-full bg-[#0a0a0a] relative z-10 border-t border-white/5 pt-16 pb-8 px-4">
            <EnquiryModal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />

            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative flex h-12 w-12 items-center justify-center text-white transition-transform duration-300 group-hover:scale-110">
                                <YourUniverse />
                            </div>
                            <span className="text-xl font-bold text-white tracking-wide">
                                YourUniverse.AI
                            </span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed max-w-sm">
                            A gateway to a universe of your own. Private, safe, and infinitely customizable.
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <Link
                                        key={social.name}
                                        href={social.href}
                                        className=" rounded-lg  w-9 h-9 overflow-hidden "
                                        aria-label={social.name}
                                    >
                                        <Icon className="w-full h-full scale-150 hover:text-primary " />
                                    </Link>
                                );
                            })}
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
                               
                                        <button onClick={()=>setIsEnquiryOpen(true)} className="text-gray-400 hover:text-blue-400 transition-colors">
                                            Contact
                                        </button>
                                  
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
