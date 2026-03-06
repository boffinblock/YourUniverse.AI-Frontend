"use client";

import Header2 from "@/components/layout/header2";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ShootingStars } from "@/components/elements/shooting-stars";
import { StarsBackground } from "@/components/elements/stars-background";
import { GlobalBackground } from "@/components/layout/global-background";
import { useActiveBackground } from "@/hooks/background";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { background, isLoading } = useActiveBackground();
    const hasGlobalBg = !!background?.image?.url;

    return (
        <ProtectedRoute requireAuth={true} redirectTo="/sign-in">
            <div className="w-screen h-screen flex flex-col relative  ">
                <GlobalBackground />

                {/* Fallback to stars only if no custom background is set */}
                {!isLoading && !hasGlobalBg && (
                    <>
                        <ShootingStars />
                        <StarsBackground />
                    </>
                )}

                <Header2 />
                <main className="relative flex-1 min-h-0 flex flex-col overflow-y-auto">{children}</main>

            </div>
        </ProtectedRoute>
    );
}