import React from "react";
import SubscriptionCard, { SubscriptionCardProps } from "@/components/cards/subscription-card";
const subscriptionPlans: SubscriptionCardProps[] = [
    {
        title: "Adventurer",
        price: "$0",
        description: "Start with basic features at no cost.",
        features: ["5 products", "1,000 subscribers", "Basic analytics", "Community support"],
        buttonLabel: "Start for Free",
    },
    {
        title: "Explorer",
        price: "$19",
        description: "Perfect for small teams starting out.",
        features: ["25 products", "10,000 subscribers", "Standard analytics", "Email support"],
        buttonLabel: "Get Basic",
    },
    {
        title: "Voyager",
        price: "$49",
        description: "Advanced tools for growing businesses.",
        features: ["100 products", "50,000 subscribers", "Advanced analytics", "Priority support"],
        buttonLabel: "Choose Premium",
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
    },
];
const SubscriptionPages = () => {


    return (
        <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2  lg:grid-cols-4 mt-40">
            {subscriptionPlans.map((plan, idx) => (
                <SubscriptionCard key={idx} {...plan} />
            ))}
        </div>
    );
};

export default SubscriptionPages;