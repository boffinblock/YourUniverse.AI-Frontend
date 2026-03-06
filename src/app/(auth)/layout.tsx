import { ShootingStars } from "@/components/elements/shooting-stars";
import { StarsBackground } from "@/components/elements/stars-background";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-screen h-screen flex flex-col bg-background relative overflow-y-auto overflow-x-hidden">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <ShootingStars />
                <StarsBackground />
            </div>
            <main className="flex-1 flex flex-col relative z-10">{children}</main>
        </div>
    );
}
