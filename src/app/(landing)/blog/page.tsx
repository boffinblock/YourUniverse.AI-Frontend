import React from "react";
import BlogSection from "@/components/sections/blog-section";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog - YourUniverse.AI",
    description: "Latest insights, updates, and guides from the YourUniverse team.",
};

export default function BlogPage() {
    return (
        <div className="pt-24 pb-16 w-full">
            <BlogSection />
        </div>
    );
}
