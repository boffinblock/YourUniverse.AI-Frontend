import React from "react";
import AboutSection from "@/components/sections/about-section";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About - YourUniverse.AI",
    description: "Learn more about our mission to bring empathy to technology.",
};

export default function AboutPage() {
    return (
        <div className="pt-24 pb-16 w-full">
            <AboutSection />
        </div>
    );
}
