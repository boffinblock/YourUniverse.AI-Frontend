import Footer from "@/components/layout/footer";
import Container from "@/components/elements/container";
import SliderElement from "@/components/elements/slider-element";

const filetuningData = [
    {
        label: "Max Tokens",
        min: 1,
        max: 4096,
        value: 512,
        header: "Max Tokens",
        description:
            "Max Tokens sets the length of the response. The higher the value the longer the response. The lower the value the quicker the reply. Please keep in mind each word is approximately 1.3 Tokens.",
    },
    {
        label: "Temperature",
        min: 0,
        max: 2,
        value: 0.7,
        header: "Temperature",
        description:
            "Temperature controls the randomness of the response. The lower the value the more mundane the response. The higher the value the more creative and varied the response will be.",
    },
    {
        label: "Top P",
        min: 0,
        max: 1,
        value: 0.9,
        header: "Top P",
        description:
            "Top P controls the diversity of the response. The lower the value the safer the response. A higher value will produce more variation in response’s",
    },
    {
        label: "Frequency Penalty",
        min: 0,
        max: 2,
        value: 0.4,
        header: "Frequency Penalty",
        description:
            "Frequency Penalty is used to discourage the repetition of phrases and using the same words to often",
    },
    {
        label: "Presence Penalty",
        min: 0,
        max: 2,
        value: 0.2,
        header: "Presence Penalty",
        description:
            "Presence Penalty is used to encourage the model to use a wide variety of tokens in its response. A higher value will help include tokens that have not been used previously in your conversation.",
    },
];
export default function page() {
    return (
        <div className="flex-1 flex flex-col relative">
            <div className="flex-1">
                <Container>
                    <div className="space-y-6">
                        {filetuningData.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col md:flex-row gap-6 items-start"
                            >

                                <div className="w-75 bg-primary/50 backdrop-blur-2xl p-4 rounded-2xl ">
                                    <SliderElement min={item.min} max={item.max} value={item.value} step={0.01} label={item.label} />
                                </div>
                                <div className="flex-1 bg-primary/50 backdrop-blur-2xl relative rounded-xl p-6 shadow-lg text-white">
                                    <div className="w-0 h-0 absolute -top-3 md:-left-4.5   md:top-6 md:-rotate-90 bg-none border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-primary/50  ">
                                    </div>
                                    <h3 className="text-gray-300 text-lg font-bold">
                                        {item.header}
                                    </h3>
                                    <p className="text-gray-300 mt-2">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>
            <Footer />
        </div>
    );
}