"use client";

import React, { useState, useCallback } from "react";
import Footer from "@/components/layout/footer";
import Container from "@/components/elements/container";
import SliderElement from "@/components/elements/slider-element";

interface TuningParam {
  key: string;
  label: string;
  header: string;
  min: number;
  max: number;
  value: number;
  step: number;
  description: string;
}

const TUNING_DATA: TuningParam[] = [
  {
    key: "maxTokens",
    label: "Max Tokens",
    header: "Max Tokens",
    min: 1,
    max: 4096,
    value: 512,
    step: 1,
    description:
      "Max Tokens sets the length of the response. The higher the value the longer the response. The lower the value the quicker the reply. Please keep in mind each word is approximately 1.3 Tokens.",
  },
  {
    key: "temperature",
    label: "Temperature",
    header: "Temperature",
    min: 0,
    max: 2,
    value: 0.7,
    step: 0.01,
    description:
      "Temperature controls the randomness of the response. The lower the value the more mundane the response. The higher the value the more creative and varied the response will be.",
  },
  {
    key: "topP",
    label: "Top P",
    header: "Top P",
    min: 0,
    max: 1,
    value: 0.9,
    step: 0.01,
    description:
      "Top P controls the diversity of the response. The lower the value the safer the response. A higher value will produce more variation in responses.",
  },
  {
    key: "frequencyPenalty",
    label: "Frequency Penalty",
    header: "Frequency Penalty",
    min: 0,
    max: 2,
    value: 0.4,
    step: 0.01,
    description:
      "Frequency Penalty is used to discourage the repetition of phrases and using the same words too often.",
  },
  {
    key: "presencePenalty",
    label: "Presence Penalty",
    header: "Presence Penalty",
    min: 0,
    max: 2,
    value: 0.2,
    step: 0.01,
    description:
      "Presence Penalty is used to encourage the model to use a wide variety of tokens in its response. A higher value will help include tokens that have not been used previously in your conversation.",
  },
];

export default function ModelTuningPage() {
  const [values, setValues] = useState<Record<string, number>>(() =>
    TUNING_DATA.reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {})
  );

  const handleValueChange = useCallback((key: string, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="flex-1 flex flex-col relative">
      <div className="flex-1 py-8">
        <Container className="max-w-7xl ">
          <div className="space-y-8 ">
            {TUNING_DATA.map((item) => (
              <div
                key={item.key}
                className="flex flex-col w-full md:flex-row gap-6 md:gap-8 items-stretch"
              >
                {/* Left: Slider */}
                <div className="shrink-0 w-full md:w-80 lg:w-96 bg-primary/30 backdrop-blur-xl border border-primary/20 rounded-2xl p-6">
                  <SliderElement
                    min={item.min}
                    max={item.max}
                    value={values[item.key] ?? item.value}
                    step={item.step}
                    label={item.label}
                    onValueChange={(val) =>
                      handleValueChange(item.key, val[0])
                    }
                  />
                </div>

                {/* Right: Description */}
                <div className="flex-1 min-w-0 bg-primary/40 backdrop-blur-xl border border-primary/20 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-white text-lg font-bold mb-2">
                    {item.header}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {item.description}
                  </p>
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
