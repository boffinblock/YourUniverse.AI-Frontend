import React from "react";
import SubscriptionCard, { SubscriptionCardProps } from "@/components/cards/subscription-card";
import { Sparkles } from "lucide-react";
const subscriptionPlans: SubscriptionCardProps[] = [
    {
        title: "Adventurer",
        price: "$0",
        description: "Start with basic features at no cost.",
        features: ["5 products", "1,000 subscribers", "Basic analytics", "Community support"],
        buttonLabel: "Start for Free",
        cadence: "/month",
    },
    {
        title: "Explorer",
        price: "$19",
        description: "Perfect for small teams starting out.",
        features: ["25 products", "10,000 subscribers", "Standard analytics", "Email support"],
        buttonLabel: "Get Basic",
        cadence: "/month",
    },
    {
        title: "Voyager",
        price: "$49",
        description: "Advanced tools for growing businesses.",
        features: ["100 products", "50,000 subscribers", "Advanced analytics", "Priority support"],
        buttonLabel: "Choose Voyager",
        cadence: "/month",
        highlighted: true,
        badge: "Most popular",
    },
    {
        title: "Pioneer",
        price: "$99",
        description: "Best for enterprises needing full control.",
        features: [
            "Unlimited products",
            "Unlimited subscribers",
            "Custom analytics",
            "24/7 dedicated support",
        ],
        buttonLabel: "Go Exclusive",
        cadence: "/month",
    },
];
const SubscriptionPages = () => {
    return (
        <div className="py-14 md:py-20 space-y-10">
            <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-primary/15 backdrop-blur-2xl p-8 md:p-12">
                <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-indigo-500/10 pointer-events-none" />
                <div className="relative">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-primary/25 px-4 py-1.5 text-xs font-medium tracking-wide text-white/90">
                        <Sparkles className="size-3.5 text-indigo-300" />
                        Flexible plans for every creator
                    </span>
                    <h2 className="mt-4 text-3xl md:text-5xl font-bold text-white tracking-tight">
                        Choose the plan that fits your universe
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm md:text-base text-muted-foreground">
                        Start free, then scale with powerful tools for characters, worlds, and production workflows as your community grows.
                    </p>
                </div>
            </section>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {subscriptionPlans.map((plan, idx) => (
                    <SubscriptionCard key={idx} {...plan} />
                ))}
            </div>
            <p className="text-center text-xs md:text-sm text-muted-foreground">
                Secure checkout, instant upgrade, and cancel anytime.
            </p>
        </div>
    );
};

export default SubscriptionPages;