"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Footer from "@/components/layout/footer";
import Container from "@/components/elements/container";
import SliderElement from "@/components/elements/slider-element";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useGetModels } from "@/hooks/models/use-get-models";
import { updateModel } from "@/lib/api/models";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { ModelConfig } from "@/lib/api/models";
import type { Model } from "@/lib/api/models";
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Settings2,
  Sparkles,
  Hash,
  ThermometerSun,
  Layers,
  Repeat,
  MessageCircle,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TuningParam {
  key: keyof ModelConfig;
  label: string;
  header: string;
  min: number;
  max: number;
  value: number;
  step: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  hint?: string;
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
    icon: Hash,
    hint: "~390 words at 512 tokens",
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
    icon: ThermometerSun,
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
    icon: Layers,
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
    icon: Repeat,
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
    icon: MessageCircle,
  },
];

const defaultValues: Record<string, number> = TUNING_DATA.reduce(
  (acc, item) => ({ ...acc, [item.key]: item.value }),
  {}
);

function formatSliderValue(value: number, step: number): string {
  return step >= 1 ? Math.round(value).toString() : value.toFixed(2);
}

export default function ModelTuningPage() {
  const queryClient = useQueryClient();
  const { models, defaultModel, isLoading, isError } = useGetModels();
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, number>>(defaultValues);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const lastSavedValues = useRef<Record<string, number> | null>(null);

  const selectedModel: Model | undefined =
    selectedModelId != null
      ? models.find((m) => m.id === selectedModelId)
      : defaultModel ?? models[0];

  const syncedModelId = useRef<string | null>(null);
  useEffect(() => {
    const model = selectedModel;
    if (!model?.id) return;
    if (syncedModelId.current === model.id) return;
    syncedModelId.current = model.id;
    const config = model.config;
    if (config) {
      setValues((prev) => ({
        ...prev,
        maxTokens: config.maxTokens ?? prev.maxTokens,
        temperature: config.temperature ?? prev.temperature,
        topP: config.topP ?? prev.topP,
        frequencyPenalty: config.frequencyPenalty ?? prev.frequencyPenalty,
        presencePenalty: config.presencePenalty ?? prev.presencePenalty,
      }));
    }
  }, [selectedModel?.id, selectedModel?.config]);

  useEffect(() => {
    if (defaultModel && selectedModelId === null) {
      setSelectedModelId(defaultModel.id);
    }
  }, [defaultModel?.id, selectedModelId]);

  const isDefault = TUNING_DATA.every(
    (item) => (values[item.key] ?? item.value) === item.value
  );

  const hasUnsavedChanges = lastSavedValues.current
    ? TUNING_DATA.some(
        (item) =>
          (values[item.key] ?? item.value) !==
          (lastSavedValues.current![item.key] ?? item.value)
      )
    : TUNING_DATA.some(
        (item) => (values[item.key] ?? item.value) !== item.value
      );

  const handleValueChange = useCallback((key: string, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    const model = selectedModel;
    if (!model?.id) {
      setSaveMessage("No model selected to update.");
      return;
    }
    setSaving(true);
    setSaveMessage(null);
    try {
      const config: ModelConfig = {
        maxTokens: values.maxTokens ?? defaultValues.maxTokens,
        temperature: values.temperature ?? defaultValues.temperature,
        topP: values.topP ?? defaultValues.topP,
        frequencyPenalty:
          values.frequencyPenalty ?? defaultValues.frequencyPenalty,
        presencePenalty: values.presencePenalty ?? defaultValues.presencePenalty,
      };
      await updateModel(model.id, { config });
      lastSavedValues.current = { ...values };
      await queryClient.invalidateQueries({ queryKey: queryKeys.models.all });
      setSaveMessage("Settings saved.");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch {
      setSaveMessage("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }, [selectedModel, values, queryClient]);

  const handleReset = useCallback(() => {
    setValues({ ...defaultValues });
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col relative min-h-0">
        <div className="flex-1 py-20 flex flex-col items-center justify-center gap-5">
          <div className="rounded-2xl bg-primary/15 p-5">
            <Loader2 className="size-12 animate-spin text-primary" />
          </div>
          <p className="text-muted-foreground font-medium">
            Loading model settings…
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || (!defaultModel && models.length === 0)) {
    return (
      <div className="flex-1 flex flex-col relative min-h-0">
        <div className="flex-1 py-20 flex flex-col items-center justify-center gap-5">
          <div className="rounded-2xl bg-destructive/10 p-5">
            <AlertCircle className="size-12 text-destructive" />
          </div>
          <div className="text-center space-y-1">
            <p className="font-semibold text-white">
              {isError ? "Couldn’t load models" : "No models available"}
            </p>
            <p className="text-sm text-muted-foreground max-w-sm">
              {isError
                ? "Something went wrong. Please try again later."
                : "Add or activate a model to tune its settings."}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const modelName = selectedModel?.name ?? "Default model";

  return (
    <div className="flex-1 flex flex-col relative min-h-0">
      {/* Sticky toolbar */}
      <div className="sticky top-0 z-10 border-b border-white/10  ">
        <Container className="">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
            <div className="flex flex-wrap items-center gap-3 min-w-0">
              <div className="flex items-center gap-3">
                <div className="shrink-0 flex size-9 items-center justify-center rounded-xl bg-primary/15">
                  <Sparkles className="size-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary/90">
                    Tuning
                  </p>
                  {models.length > 1 ? (
                    <Select
                      value={selectedModelId ?? defaultModel?.id ?? ""}
                      onValueChange={(v) => setSelectedModelId(v || null)}
                    >
                      <SelectTrigger className="h-9 w-[200px] rounded-xl border-white/15 bg-white/5 text-white font-medium mt-0.5">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-semibold text-white truncate mt-0.5">
                      {modelName}
                    </p>
                  )}
                </div>
              </div>
              {isDefault && (
                <Badge
                  variant="secondary"
                  className="bg-primary/20 text-primary border-primary/40 text-xs font-medium"
                >
                  Default values
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              {saveMessage && (
                <span
                  className={cn(
                    "flex items-center gap-1.5 text-sm font-medium",
                    saveMessage === "Settings saved."
                      ? "text-primary"
                      : "text-destructive"
                  )}
                >
                  {saveMessage === "Settings saved." ? (
                    <CheckCircle2 className="size-4 shrink-0" />
                  ) : (
                    <AlertCircle className="size-4 shrink-0" />
                  )}
                  {saveMessage}
                </span>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="h-9 rounded-xl border-white/15 text-muted-foreground hover:bg-white/5 hover:text-white gap-2 font-medium"
              >
                <RotateCcw className="size-4 shrink-0" />
                Reset
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={saving || !hasUnsavedChanges}
                className="h-9 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2 shadow-lg shadow-primary/25 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="size-4 shrink-0 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="size-4 shrink-0" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Main content */}
      <div className="flex-1 py-8 overflow-y-auto custom-scroll">
        <Container >
          {/* Page header */}
          <header className="mb-10">
            <div className="flex items-center gap-2.5 text-primary mb-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15">
                <Settings2 className="size-5 shrink-0" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary/90">
                Model Tuning
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mt-2">
              Adjust response behavior
            </h1>
            <p className="mt-2 text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed">
              Control length, creativity, and diversity. Changes apply to new
              conversations using this model.
            </p>
          </header>

          {/* Tuning parameter cards */}
          <div className="space-y-5">
            {TUNING_DATA.map((item) => {
              const Icon = item.icon;
              const currentValue = values[item.key] ?? item.value;
              return (
                <Card
                  key={item.key}
                  className="overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex flex-col lg:flex-row lg:min-h-0">
                    {/* Left: control + value */}
                    <div className="lg:w-80 xl:w-96 lg:shrink-0 flex flex-col p-6 border-b lg:border-b-0 lg:border-r border-white/10 bg-white/2">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="shrink-0 flex size-9 items-center justify-center rounded-xl bg-primary/15">
                            <Icon className="size-4 text-primary" />
                          </div>
                          <span className="text-sm font-semibold text-white truncate">
                            {item.label}
                          </span>
                        </div>
                        <Badge
                          variant="secondary"
                          className="shrink-0 font-mono text-sm tabular-nums bg-primary/20 text-primary-foreground border-primary/40 px-2.5 py-0.5"
                        >
                          {formatSliderValue(currentValue, item.step)}
                        </Badge>
                      </div>
                      <SliderElement
                        min={item.min}
                        max={item.max}
                        value={currentValue}
                        step={item.step}
                        label=""
                        onValueChange={(val) =>
                          handleValueChange(item.key, val[0])
                        }
                      />
                      <div className="flex justify-between text-xs text-muted-foreground/80 mt-1.5">
                        <span>{item.min}</span>
                        <span>{item.max}</span>
                      </div>
                      {item.hint && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {item.hint}
                        </p>
                      )}
                    </div>
                    {/* Right: description */}
                    <div className="flex-1 min-w-0 p-6 flex flex-col justify-center">
                      <h3 className="text-base font-semibold text-white mb-2">
                        {item.header}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
}
