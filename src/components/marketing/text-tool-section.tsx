"use client";

import * as React from "react";
import {
  Activity,
  Briefcase,
  Camera,
  CheckCheck,
  Clock,
  Copy,
  Download,
  Hash,
  Layers,
  Lock,
  Search,
  Share2,
  Sparkles,
  Trash2,
  TrendingUp,
  Type,
} from "lucide-react";
import { toast } from "sonner";

import { AdSlot } from "@/components/marketing/ad-slot";
import { DEFAULT_TEXT } from "@/lib/default-text";
import { cn } from "@/lib/utils";
import { CounterService } from "@/services/counter.service";

const counterService = new CounterService();

const metricIcons = {
  characters: Type,
  charactersWithoutSpaces: Hash,
  words: Type,
  uniqueWords: Layers,
  sentences: Activity,
  paragraphs: Layers,
  lines: Hash,
  readingTime: Clock,
} as const;

const qualityIcons = {
  readingTime: Clock,
  speechTime: Activity,
  level: Layers,
  tone: Sparkles,
} as const;

const limitIcons = {
  "meta-title": Search,
  "meta-description": Search,
  "post-x": Share2,
  "instagram-caption": Camera,
  "linkedin-post": Briefcase,
} as const;

function statusStyles(status: "danger" | "good" | "warning") {
  if (status === "danger") {
    return {
      bar: "bg-destructive",
      text: "text-destructive",
    };
  }

  if (status === "warning") {
    return {
      bar: "bg-warning",
      text: "text-warning",
    };
  }

  return {
    bar: "bg-success",
    text: "text-success",
  };
}

export function TextToolSection() {
  const [text, setText] = React.useState(DEFAULT_TEXT);
  const [copied, setCopied] = React.useState(false);
  const deferredText = React.useDeferredValue(text);
  const analysis = React.useMemo(
    () => counterService.analyze(deferredText),
    [deferredText],
  );

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Texto copiado");
    window.setTimeout(() => setCopied(false), 1200);
  }

  function handleExport() {
    const blob = new Blob([text], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "texto.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <AdSlot size="leaderboard" slot="1111111111" />
      </div>

      <section
        id="tool"
        className={cn("mx-auto max-w-7xl px-4 pb-12 md:px-8")}
      >
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="shadow-soft overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border bg-muted/30 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Type className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm font-semibold">Editor</span>
                  <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    Ao vivo
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Lock className="h-3 w-3" /> Local · privado
                </div>
              </div>

              <textarea
                rows={11}
                className="block w-full resize-none border-0 bg-transparent p-6 font-mono text-[15px] leading-relaxed outline-none"
                value={text}
                onChange={(event) => setText(event.target.value)}
              />

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/20 px-5 py-3">
                <div className="font-mono text-xs text-muted-foreground">
                  <span className="text-foreground">{analysis.summary.characters}</span>
                  {" "}chars ·{" "}
                  <span className="text-foreground">{analysis.summary.words}</span>
                  {" "}palavras ·{" "}
                  <span className="text-foreground">{analysis.summary.sentences}</span>
                  {" "}frases
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                    type="button"
                    onClick={() => void handleCopy()}
                  >
                    {copied ? (
                      <CheckCheck className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    Copiar
                  </button>
                  <button
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                    type="button"
                    onClick={() => setText("")}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Limpar
                  </button>
                  <button
                    className="shadow-soft inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    type="button"
                    onClick={handleExport}
                  >
                    <Download className="h-3.5 w-3.5" /> Exportar
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold">Limites por plataforma</h2>
                </div>
                <span className="text-[11px] text-muted-foreground">5 alvos monitorados</span>
              </div>
              <div className="divide-y divide-border">
                {analysis.platformLimits.map((limit) => {
                  const Icon = limitIcons[limit.id as keyof typeof limitIcons];
                  const styles = statusStyles(limit.status);

                  return (
                    <div
                      key={limit.id}
                      className="grid grid-cols-12 items-center gap-4 px-5 py-4"
                    >
                      <div className="col-span-12 flex items-center gap-2.5 sm:col-span-4">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                        </span>
                        <div>
                          <div className="text-sm font-medium">{limit.name}</div>
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            {limit.target}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-9 sm:col-span-6">
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn("h-full rounded-full", styles.bar)}
                            style={{ width: `${limit.percent}%` }}
                          />
                        </div>
                      </div>
                      <div className="col-span-3 text-right sm:col-span-2">
                        <span className={cn("font-mono text-xs font-semibold", styles.text)}>
                          {limit.current}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {" "}/ {limit.max}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Qualidade do texto</h2>
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <div className="mt-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Legibilidade
                  </span>
                  <span className="font-mono text-xs text-success">
                    {analysis.quality.readabilityLabel}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-5xl font-bold tracking-tight">
                    {analysis.quality.readabilityScore}
                  </span>
                  <span className="text-sm text-muted-foreground">/100</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-success to-primary"
                    style={{ width: `${analysis.quality.readabilityScore}%` }}
                  />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {analysis.quality.items.map((item) => {
                  const Icon = qualityIcons[item.id];
                  return (
                    <div
                      key={item.id}
                      className="rounded-lg border border-border bg-muted/30 p-3"
                    >
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <div className="mt-2 text-base font-semibold">{item.value}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <AdSlot size="rectangle" slot="2222222222" />
          </aside>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {analysis.metrics.map((metric) => {
            const Icon = metricIcons[metric.id];

            return (
              <div
                key={metric.id}
                className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-soft"
              >
                <div className="flex items-center">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                </div>
                <div className="mt-3 text-2xl font-bold tracking-tight">{metric.value}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {metric.label}
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground/70">
                  {metric.hint}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-6">
          <AdSlot size="inline" className="mx-auto max-w-3xl" slot="3333333333" />
        </div>
      </section>
    </>
  );
}
