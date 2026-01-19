import { ShootingStars } from "@/components/elements/shooting-stars";
import { StarsBackground } from "@/components/elements/stars-background";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-screen h-screen flex flex-col bg-background relative overflow-hidden">
            <ShootingStars />
            <StarsBackground />
            <main className="flex-1 flex flex-col relative ">{children}</main>
        </div>
    );
}
