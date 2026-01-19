"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";

interface AgeVerificationModalProps {
    onVerified: () => void;
}

export default function AgeVerificationModal({ onVerified }: AgeVerificationModalProps) {
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [error, setError] = useState("");
    const [isVisible, setIsVisible] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!day || !month || !year) {
            setError("Please fill in all fields");
            return;
        }

        const d = parseInt(day);
        const m = parseInt(month);
        const y = parseInt(year);

        if (isNaN(d) || isNaN(m) || isNaN(y)) {
            setError("Please enter valid numbers");
            return;
        }

        if (d < 1 || d > 31 || m < 1 || m > 12) {
            setError("Please enter a valid date");
            return;
        }

        const today = new Date();
        const birthDate = new Date(y, m - 1, d);
        let age = today.getFullYear() - birthDate.getFullYear();
        const mDiff = today.getMonth() - birthDate.getMonth();

        if (mDiff < 0 || (mDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            setError("You must be 18 or older to enter.");
            return;
        }

        // Success animation trigger
        setIsVisible(false);
        setTimeout(onVerified, 500); // Wait for exit animation
    };

    const handleInputChange = (
        setter: React.Dispatch<React.SetStateAction<string>>,
        value: string,
        maxLength: number
    ) => {
        const numericValue = value.replace(/\D/g, "");
        if (numericValue.length <= maxLength) {
            setter(numericValue);
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md px-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="w-full max-w-md p-8 rounded-3xl bg-[#0F111A] border border-white/10 shadow-2xl text-center space-y-8"
                    >
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-white tracking-tight">
                                Age Verification
                            </h2>
                            <p className="text-gray-400">
                                Please enter your date of birth to continue.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex gap-4 justify-center">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 font-medium">DD</label>
                                    <Input
                                        type="text"
                                        placeholder="DD"
                                        value={day}
                                        onChange={(e) => handleInputChange(setDay, e.target.value, 2)}
                                        className="w-20 text-center bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500 h-12 text-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 font-medium">MM</label>
                                    <Input
                                        type="text"
                                        placeholder="MM"
                                        value={month}
                                        onChange={(e) => handleInputChange(setMonth, e.target.value, 2)}
                                        className="w-20 text-center bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500 h-12 text-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 font-medium">YYYY</label>
                                    <Input
                                        type="text"
                                        placeholder="YYYY"
                                        value={year}
                                        onChange={(e) => handleInputChange(setYear, e.target.value, 4)}
                                        className="w-28 text-center bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500 h-12 text-lg"
                                    />
                                </div>
                            </div>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-red-400 text-sm"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full h-12 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors"
                            >
                                Enter Universe
                            </Button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
