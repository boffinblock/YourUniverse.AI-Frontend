import Footer from "@/components/layout/footer";
import Container from "@/components/elements/container";
import { Button } from "@/components/ui/button";
import { ArrowBigDownDash } from "lucide-react";

export default function page() {
    return (
        <div className="flex-1 flex flex-col relative">
            <div className="flex-1  text-white">
                <Container>
                    <div className="space-y-4">
                        {
                            [1, 2, 3, 4, 5].map((item) => (
                                <div key={item} className="flex flex-col md:flex-row gap-4 ">
                                    <div className="bg-primary/50 backdrop-blur-2xl  rounded-2xl py-4 px-6 text-start md:text-center h-fit w-fit space-y-2">
                                        <div className="w-full ">
                                            <h4 className="font-bold text-lg text-white">Gemma 2B</h4>
                                            <p className="text-sm">Transformer-based LLM</p>
                                            <p className="text-sm ">Offline · HuggingFace</p>
                                        </div>
                                        <Button  >Download Model<ArrowBigDownDash /></Button>
                                    </div>
                                    <div className="bg-primary/50  backdrop-blur-2xl rounded-2xl p-4 px-6 flex-1 relative ">
                                        <div className="w-0 h-0 absolute -top-3 md:-left-4.5   md:top-6 md:-rotate-90 bg-none border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-primary/50  ">
                                        </div>
                                        <h4 className="font-bold text-lg text-white">Gemma 2B</h4>
                                        <p className="text-xs">Last updated: Sep 10, 2025</p>
                                        <p className="text-sm mt-2">
                                            A lightweight open-source LLM optimized for local inference, ideal for
                                            chatbots and small-scale AI assistants. Supports quantized GGUF models for
                                            edge devices.
                                        </p>
                                    </div>
                                </div>
                            ))
                        }

                    </div>

                </Container>
            </div >
            <Footer />
        </div >
    );
}   