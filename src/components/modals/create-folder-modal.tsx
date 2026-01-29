"use client";

import React from "react";
import {
    X,
    CircleDollarSign,
    GraduationCap,
    PenLine,
    Plane,
    Lightbulb
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CreateFolderModalProps {
    children: React.ReactNode;
}

const suggestions = [
    { label: "Investing", icon: CircleDollarSign, color: "text-green-500", bgColor: "bg-green-500/10" },
    { label: "Homework", icon: GraduationCap, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { label: "Writing", icon: PenLine, color: "text-purple-500", bgColor: "bg-purple-500/10" },
    { label: "Travel", icon: Plane, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
];

export const CreateFolderModal = ({ children }: CreateFolderModalProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="bg-primary/20 backdrop-filter border-2 border-primary transition-transform  backdrop-blur-lg hover:border-2  hover:border-primary duration-500 text-white w-fit p-0 overflow-hidden rounded-[24px] shadow-2xl">
                <div className="p-6 pt-5 space-y-6">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold tracking-tight text-white">
                            Create Folder
                        </DialogTitle>
                        {/* Settings icon removed as requested */}
                    </div>

                    {/* Input Section */}
                    <div className="relative">
                      
                        <Input
                            placeholder="Enter Folder Name"
                        />
                    </div>

                    {/* Suggestions Tags */}
                    

                    {/* Info/Explanation Box */}
                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 pr-6 flex gap-3.5">
                        <div className="shrink-0 pt-0.5">
                            <Lightbulb className="h-5 w-5 text-white/40" />
                        </div>
                        <p className="text-[14px] text-white/50 leading-snug">
                            Folders keep chats, files, and custom instructions in one place. Use them for ongoing work, or just to keep things tidy.
                        </p>
                    </div>

                    {/* Footer / Create Button */}
                    <div className="flex justify-end pt-2">
                        <Button className=" text-white/90 rounded-full px-6  py-2 transition-all duration-200 border-none shadow-none text-sm">
                            Create Folder
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
