"use client";

import Footer from "@/components/layout/footer";
import Container from "@/components/elements/container";
import { Button } from "@/components/ui/button";
import { ArrowBigDownDash, CheckCircle2 } from "lucide-react";
import { useGetModels } from "@/hooks/models/use-get-models";

export default function Page() {
    const { models, isLoading } = useGetModels({ params: { isActive: true } });

    return (
        <div className="flex-1 flex flex-col h-full relative">
            <div className="flex-1 text-white overflow-hidden">
                <Container className="h-full">
                    <div className="space-y-4 h-full overflow-y-auto px-3 pb-10">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            </div>
                        ) : models.length > 0 ? (
                            models.map((model) => (
                                <div key={model.id} className="flex flex-col md:flex-row  gap-4">
                                    <div className="bg-primary/50 !w-[20rem] backdrop-blur-2xl rounded-2xl py-4 px-6 text-start md:text-center h-fit w-fit space-y-2">
                                        <div className="w-full">
                                            <h4 className="font-bold text-lg text-white">{model.name}</h4>
                                            <p className="text-sm capitalize">{model.provider}</p>
                                            <p className="text-sm">Online · Cloud</p>
                                        </div>
                                        {model.isActive ? (
                                            <Button disabled className="bg-green-600/50 text-white cursor-default hover:bg-green-600/50">
                                                Installed <CheckCircle2 className="w-4 h-4 ml-1" />
                                            </Button>
                                        ) : (
                                            <Button>Download Model<ArrowBigDownDash /></Button>
                                        )}
                                    </div>
                                    <div className="bg-primary/50 backdrop-blur-2xl rounded-2xl p-4 px-6 flex-1 relative">
                                        <div className="w-0 h-0 absolute -top-3 md:-left-4.5 md:top-6 md:-rotate-90 bg-none border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-primary/50">
                                        </div>
                                        <h4 className="font-bold text-lg text-white">{model.name}</h4>
                                        <p className="text-xs">Last updated: {new Date(model.updatedAt).toLocaleDateString()}</p>
                                        <p className="text-sm mt-2">
                                            {model.description || "No description available for this model."}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-lg text-white/50">No models found.</p>
                            </div>
                        )}
                    </div>
                </Container>
            </div>
            <Footer />
        </div>
    );
}