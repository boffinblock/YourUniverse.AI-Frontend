
import React from "react";
import Footer from "@/components/layout/footer";
import Container from "@/components/elements/container";
import Android from "@/components/icons/android";
import Apple from "@/components/icons/apple";
import Ios from "@/components/icons/ios";
import Linux from "@/components/icons/linux";
import Window from "@/components/icons/window";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
const downloads = [
    {
        name: "Android",
        icon: Android,
        link: "/downloads/android.apk",
    },
    {
        name: "Windows",
        icon: Window,
        link: "/downloads/windows.exe",
    },
    {
        name: "Linux",
        icon: Linux,
        link: "/downloads/linux.AppImage",
    },
    {
        name: "macOS",
        icon: Apple,
        link: "/downloads/macos.dmg",
    },
    {
        name: "iOS",
        icon: Ios,
        link: "/downloads/ios.ipa",
    },
];

export default function page() {
    return (
        <div className="flex-1 flex flex-col relative">
            <div className="flex-1 ">
                <Container className="h-full flex justify-center  items-center">
                    
                    <div className=" text-center px-4">
                        <h1 className="text-5xl text-white font-bold mb-20">Download Your App</h1>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {downloads.map((item) => {
                                const Icon = item.icon || null
                                const displayName = item.name || null;

                                return (
                                    <Card
                                        key={item.name}
                                        className="
                                             text-white
                                           bg-primary/30 backdrop-blur-lg backdrop-filter
                                            flex flex-col justify-between
                                        "
                                    >
                                        <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4 pt-8">

                                            {Icon && <Icon className={cn("size-20 text-indigo-400 mb-2")} />}

                                            <h2 className="text-xl font-semibold text-white">
                                                {displayName}
                                            </h2>

                                            <p className="text-sm text-gray-400">
                                                Installer for {displayName} system.
                                            </p>
                                        </CardContent>

                                        <div className="p-6 pt-0">
                                            <Link href={item.link} target="_blank" className="block">
                                                <Button
                                                    className="
                                                        w-full
                                                        bg-indigo-600 hover:bg-indigo-700
                                                        text-white font-bold
                                                        transition duration-200
                                                    "
                                                >
                                                    Download
                                                </Button>
                                            </Link>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                </Container>
            </div>
            <Footer />
        </div>
    );
}
