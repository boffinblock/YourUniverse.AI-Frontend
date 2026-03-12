import Footer from "@/components/layout/footer";
import Container from "@/components/elements/container";
import FeatureForm from '@/components/forms/feature-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquarePlus } from "lucide-react";

export default function FeatureRequestPage() {
    return (
        <div className="flex-1 flex flex-col relative ">
            <div className="flex-1">
                <Container className="max-w-4xl h-full py-12">
                    <Card className="overflow-hidden relative bg-transparent border-none backdrop-blur-none">
                        {/* Decorative Background Element */}
                        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 rounded-full blur-3xl pointer-events-none" />

                        <CardHeader className="space-y-4 pb-6 pl-0 text-center sm:text-left flex flex-col sm:flex-row gap-4 sm:gap-6 items-center border-b border-border/50 relative z-10">
                            <div className="size-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center shrink-0 shadow-inner border border-primary/20">
                                <MessageSquarePlus className="size-8 stroke-[1.5]" />
                            </div>
                            <div className="space-y-1.5 flex-1">
                                <CardTitle className="text-3xl font-bold tracking-tight text-white/80">
                                    Create a Feature Request or Submit a Bug Report
                                </CardTitle>
                                <CardDescription className="text-base font-medium text-white/60">
                                    Help us to continue to improve YourUniverse by submitting your Feature Request
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-8 relative z-10">
                            <FeatureForm />
                        </CardContent>
                    </Card>
                </Container>
            </div>
            <Footer />
        </div>
    );
}
