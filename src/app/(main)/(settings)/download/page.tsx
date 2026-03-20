
import Footer from "@/components/layout/footer";
import Container from "@/components/elements/container";
import Android from "@/components/icons/android";
import Apple from "@/components/icons/apple";
import Ios from "@/components/icons/ios";
import Linux from "@/components/icons/linux";
import Window from "@/components/icons/window";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Download, ShieldCheck, Sparkles, ArrowDownToLine } from "lucide-react";
const downloads = [
    {
        name: "Android",
        icon: Android,
        link: "/downloads/android.apk",
        fileType: "APK",
        architecture: "ARM64 / x64",
    },
    {
        name: "Windows",
        icon: Window,
        link: "/downloads/windows.exe",
        fileType: "EXE",
        architecture: "x64",
    },
    {
        name: "Linux",
        icon: Linux,
        link: "/downloads/linux.AppImage",
        fileType: "AppImage",
        architecture: "x64",
    },
    {
        name: "macOS",
        icon: Apple,
        link: "/downloads/macos.dmg",
        fileType: "DMG",
        architecture: "Apple Silicon ",
    },
    {
        name: "iOS",
        icon: Ios,
        link: "/downloads/ios.ipa",
        fileType: "IPA",
        architecture: "Universal",
    },
];

export default function page() {
    return (
        <div className="flex-1 flex flex-col relative">
            <div className="flex-1">
                <Container className="h-full py-14 md:py-20">
                    <div className="mx-auto max-w-6xl space-y-10">
                        <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-primary/15 backdrop-blur-2xl p-8 md:p-12">
                            <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-indigo-500/10 pointer-events-none" />
                            <div className="relative">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-primary/25 px-4 py-1.5 text-xs font-medium tracking-wide text-white/90">
                                    <Sparkles className="size-3.5 text-indigo-300" />
                                    Fast, secure, and cross-platform
                                </div>
                                <h1 className="mt-4 text-3xl md:text-5xl font-bold text-white tracking-tight">
                                    Download Your Universe
                                </h1>
                                <p className="mt-4 max-w-2xl text-sm md:text-base text-muted-foreground">
                                    Choose your device and start creating characters, realms, and stories with the same immersive experience across every platform.
                                </p>
                                <div className="mt-6 flex flex-wrap items-center gap-3 text-xs md:text-sm text-white/80">
                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
                                        <ShieldCheck className="size-4 text-emerald-400" />
                                        Verified installers
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
                                        <Download className="size-4 text-indigo-300" />
                                        One-click downloads
                                    </span>
                                </div>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                            {downloads.map((item) => {
                                const Icon = item.icon || null;
                                const displayName = item.name || null;

                                return (
                                    <Card
                                        key={item.name}
                                        className="
                                            text-white
                                            pt-4
                                            bg-primary/20 backdrop-blur-xl
                                            border border-white/10
                                            hover:border-primary/50 hover:bg-primary/30 hover:shadow-xl hover:shadow-primary/10
                                            transition-all duration-300
                                            flex flex-col justify-between min-h-[240px] relative overflow-hidden
                                        "
                                    >
                                        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-indigo-300/80 to-transparent" />
                                        <CardHeader className="pb-3">
                                            <div className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-black/25 border border-white/15 shadow-sm shadow-indigo-900/40">
                                                {Icon && <Icon className={cn("size-8 text-indigo-300")} />}
                                            </div>
                                            <CardTitle className="text-2xl text-white">{displayName}</CardTitle>
                                            <CardDescription className="text-muted-foreground text-sm">
                                                Installer for {displayName} system.
                                            </CardDescription>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <span className="rounded-full border border-white/15 bg-black/20 px-2.5 py-1 text-[11px] text-white/80">
                                                    {item.fileType}
                                                </span>
                                                <span className="rounded-full border border-white/15 bg-black/20 px-2.5 py-1 text-[11px] text-white/80">
                                                    {item.architecture}
                                                </span>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="pt-0">
                                            <Link href={item.link} target="_blank" className="block">
                                                <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl gap-2">
                                                    <ArrowDownToLine className="size-4" />
                                                    Download
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </Container>
            </div>
            <Footer />
        </div>
    );
}
