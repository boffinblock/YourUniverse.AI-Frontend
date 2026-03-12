"use client";

import { useState } from "react";
import Footer from "@/components/layout/footer";
import Container from "@/components/elements/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetModels } from "@/hooks/models/use-get-models";
import { updateModel } from "@/lib/api/models";
import { queryKeys } from "@/lib/api/shared/query-keys";
import type { Model } from "@/lib/api/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDownToLine,
  CheckCircle2,
  Cloud,
  Cpu,
  Loader2,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const PROVIDER_LABELS: Record<Model["provider"], string> = {
  openai: "OpenAI",
  gemini: "Google Gemini",
  aws: "AWS",
  anthropic: "Anthropic",
  local: "Local",
};

interface ModelCardProps {
  model: Model;
  defaultModelId: string | null;
  onSetDefault: (modelId: string, currentDefaultId: string | null) => void;
  settingDefaultForId: string | null;
}

function StatusChip({
  children,
  variant = "neutral",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "primary" | "neutral" | "success" | "muted";
  className?: string;
}) {
  const styles = {
    default:
      "bg-primary/20 text-primary border-primary/40 [&_svg]:text-primary",
    primary:
      "bg-primary/15 text-primary-foreground border-primary/35 [&_svg]:text-primary",
    neutral:
      "bg-white/10 text-muted-foreground border-white/15 [&_svg]:text-muted-foreground",
    success:
      "bg-primary/15 text-primary border-primary/30 [&_svg]:text-primary",
    muted:
      "bg-white/5 text-muted-foreground/90 border-white/10 [&_svg]:text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium [&_svg]:size-3 [&_svg]:shrink-0",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

function ModelCard({
  model,
  defaultModelId,
  onSetDefault,
  settingDefaultForId,
}: ModelCardProps) {
  const isInstalled = model.isActive;
  const isDefault = model.isDefault || model.id === defaultModelId;
  const providerLabel = PROVIDER_LABELS[model.provider] ?? model.provider;
  const thisIsSettingDefault = settingDefaultForId === model.id;

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex flex-col lg:flex-row lg:min-h-0">
        {/* Left: identity, chips, action */}
        <div className="lg:w-80 lg:shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-white/10 bg-white/2">
          <div className="p-6 flex flex-col gap-5">
            {/* Model name + provider */}
            <div className="space-y-1.5 min-w-0">
              <h3 className="text-lg font-semibold text-white leading-tight wrap-break-word">
                {model.name}
              </h3>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {providerLabel}
              </p>
            </div>

            {/* Status chips row */}
            <div className="flex flex-wrap gap-2">
              {isDefault && (
                <StatusChip variant="default">
                  <Star className="size-3 fill-current" />
                  Default
                </StatusChip>
              )}
              <StatusChip variant="neutral">
                <Cloud className="size-3" />
                Cloud
              </StatusChip>
              <StatusChip variant={isInstalled ? "success" : "muted"}>
                {isInstalled ? (
                  <>
                    <span className="size-1.5 rounded-full bg-current shrink-0" />
                    Online
                  </>
                ) : (
                  <>
                    <span className="size-1.5 rounded-full bg-current shrink-0 opacity-70" />
                    Not installed
                  </>
                )}
              </StatusChip>
            </div>

            {/* Primary action */}
            <div className="mt-auto pt-2">
              {isInstalled ? (
                isDefault ? (
                  <Button
                    disabled
                    className="w-full h-11 rounded-xl bg-primary/20 text-primary-foreground border border-primary/40 font-medium gap-2 cursor-default"
                  >
                    <CheckCircle2 className="size-4 shrink-0" />
                    In use
                  </Button>
                ) : (
                  <Button
                    onClick={() => onSetDefault(model.id, defaultModelId)}
                    disabled={thisIsSettingDefault}
                    className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2 shadow-lg shadow-primary/25 transition-colors"
                  >
                    {thisIsSettingDefault ? (
                      <>
                        <Loader2 className="size-4 shrink-0 animate-spin" />
                        Setting…
                      </>
                    ) : (
                      <>
                        <Star className="size-4 shrink-0" />
                        Use this model
                      </>
                    )}
                  </Button>
                )
              ) : (
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-xl border-white/20 text-muted-foreground hover:bg-white/5 hover:text-white hover:border-white/30 font-medium gap-2 transition-colors"
                >
                  <ArrowDownToLine className="size-4 shrink-0" />
                  Download model
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right: description + meta */}
        <div className="flex-1 min-w-0 p-6 flex flex-col justify-center lg:py-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {model.description ||
              "No description available for this model."}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-muted-foreground/90">
            <span>
              Updated{" "}
              {new Date(model.updatedAt).toLocaleDateString(undefined, {
                dateStyle: "medium",
              })}
            </span>
            {model.isActive && (
              <Link
                href="/models-tuning"
                className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline focus:outline-none focus-visible:underline"
              >
                <Sparkles className="size-3.5 shrink-0" />
                Tune parameters
              </Link>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function ModelCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-80 p-6 border-b lg:border-b-0 lg:border-r border-white/10 space-y-5">
          <div className="space-y-2">
            <div className="h-5 w-4/5 rounded bg-primary/15" />
            <div className="h-3 w-1/4 rounded bg-primary/10" />
          </div>
          <div className="flex gap-2">
            <div className="h-7 w-16 rounded-lg bg-primary/10" />
            <div className="h-7 w-14 rounded-lg bg-primary/10" />
            <div className="h-7 w-20 rounded-lg bg-primary/10" />
          </div>
          <div className="h-11 w-full rounded-xl bg-primary/10 mt-2" />
        </div>
        <div className="flex-1 p-6 space-y-3">
          <div className="h-3 w-full rounded bg-primary/10" />
          <div className="h-3 w-full rounded bg-primary/10" />
          <div className="h-3 w-3/4 rounded bg-primary/10" />
          <div className="h-3 w-1/3 rounded bg-primary/10 mt-4" />
        </div>
      </div>
    </Card>
  );
}

export default function ModelSelectionPage() {
  const queryClient = useQueryClient();
  const { models, isLoading, isError, defaultModel } = useGetModels({
    params: { isActive: true },
  });

  const [settingDefaultForId, setSettingDefaultForId] = useState<string | null>(
    null
  );

  const setDefaultMutation = useMutation({
    mutationFn: async ({
      modelId,
      previousDefaultId,
    }: {
      modelId: string;
      previousDefaultId: string | null;
    }) => {
      await updateModel(modelId, { isDefault: true });
      if (previousDefaultId && previousDefaultId !== modelId) {
        await updateModel(previousDefaultId, { isDefault: false });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.models.all });
    },
    onSettled: () => {
      setSettingDefaultForId(null);
    },
  });

  const handleSetDefault = (modelId: string, currentDefaultId: string | null) => {
    setSettingDefaultForId(modelId);
    setDefaultMutation.mutate({
      modelId,
      previousDefaultId: currentDefaultId ?? null,
    });
  };

  const defaultModelId = defaultModel?.id ?? null;

  return (
    <div className="flex-1 flex flex-col h-full relative min-h-0">
      <div className="flex-1 text-white ">
        <Container className="h-full flex flex-col ">
          <header className="shrink-0 pt-10 pb-8">
            <div className="flex items-center gap-2.5 text-primary mb-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15">
                <Cpu className="size-5 shrink-0" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary/90">
                Models
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mt-2">
              Model selection
            </h1>
            <p className="mt-2 text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed">
              Choose which model to use for chat and set a default. Installed
              models can be tuned from the tuning page.
            </p>
            {!isLoading && !isError && models.length > 0 && (
              <p className="mt-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{models.length}</span>{" "}
                {models.length === 1 ? "model" : "models"} available
                {defaultModel && (
                  <span className="ml-2 text-primary">
                    · Default: {defaultModel.name}
                  </span>
                )}
              </p>
            )}
          </header>

          <div className="flex-1 min-h-0 overflow-y-auto custom-scroll pb-12">
            {isLoading ? (
              <div className="space-y-5">
                {[1, 2, 3].map((i) => (
                  <ModelCardSkeleton key={i} />
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-20 gap-5 rounded-2xl border border-white/10 bg-white/2">
                <div className="rounded-2xl bg-destructive/10 p-5">
                  <Cpu className="size-12 text-destructive" />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-semibold text-white">Couldn’t load models</p>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Something went wrong. Please try again later.
                  </p>
                </div>
              </div>
            ) : models.length > 0 ? (
              <div className="space-y-5">
                {models.map((model) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    defaultModelId={defaultModelId}
                    onSetDefault={handleSetDefault}
                    settingDefaultForId={settingDefaultForId}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-5 rounded-2xl border border-white/10 bg-white/2">
                <div className="rounded-2xl bg-primary/10 p-5">
                  <Cpu className="size-12 text-primary" />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-semibold text-white">No models yet</p>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Models will appear here when they’re available.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
}
