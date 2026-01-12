
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-screen h-screen flex flex-col bg-background">
            <main className="flex-1 flex flex-col relative ">{children}</main>
        </div>
    );
}
