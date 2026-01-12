import { Check } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

export interface SubscriptionCardProps {
    title: string;
    price: string;
    description: string;
    features: string[];
    buttonLabel: string;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
    title,
    price,
    description,
    features,
    buttonLabel,
}) => {
    return (
        <div className="rounded-4xl bg-primary/30 backdrop-blur-lg backdrop-filter   border border-r-4 border-primary/80  overflow-hidden hover:scale-105 duration-500 ">
            <h3 className="text-base/7 font-semibold text-white px-4 py-1 rounded-r-full bg-primary w-fit mt-6 uppercase tracking-wider ">{title}</h3>
            <div className=" px-4  py-6 space-y-4">
                <p className=" flex items-baseline gap-x-2">
                    <span className="text-5xl font-semibold tracking-tight text-white">{price}</span>
                    <span className="text-base text-gray-400">/month</span>
                </p>

                <p className="  text-gray-300">{description}</p>

                <ul role="list" className="mt-8 space-y-3 text-sm/6 text-gray-300 ">
                    {features.map((feature, idx) => (
                        <li key={idx} className="flex gap-x-3">
                            <Check />
                            {feature}
                        </li>
                    ))}
                </ul>

                <Button className="w-full">{buttonLabel}</Button>
            </div>
        </div>
    );
};

export default SubscriptionCard;