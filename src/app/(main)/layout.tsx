"use client";

import Header2 from "@/components/layout/header2";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ShootingStars } from "@/components/elements/shooting-stars";
import { StarsBackground } from "@/components/elements/stars-background";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute requireAuth={true} redirectTo="/sign-in">
            <div className="w-screen h-screen flex flex-col bg-background relative  ">
                <ShootingStars />
                <StarsBackground />
                <Header2 />
                <main className="relative flex-1 min-h-0 flex flex-col overflow-y-auto">{children}</main>
            </div>
        </ProtectedRoute>
    );
}