"use client";

import * as React from "react";
import {
  Activity,
  AlertCircle,
  Briefcase,
  Camera,
  Check,
  CheckCheck,
  CheckCircle2,
  Clock,
  Copy,
  Crown,
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
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

import { AdSlot } from "@/components/marketing/ad-slot";
import { DEFAULT_TEXT } from "@/lib/default-text";
import { cn } from "@/lib/utils";
import { CounterService } from "@/services/counter.service";

const counterService = new CounterService();

interface TextToolSectionProps {
  mode?: "public" | "dashboard";
}

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

export function TextToolSection({
  mode = "public",
}: TextToolSectionProps) {
  const [text, setText] = React.useState(DEFAULT_TEXT);
  const [copied, setCopied] = React.useState(false);
  const deferredText = React.useDeferredValue(text);
  const analysis = React.useMemo(
    () => counterService.analyze(deferredText),
    [deferredText],
  );
  const isDashboard = mode === "dashboard";

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
      {!isDashboard ? (
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <AdSlot size="leaderboard" />
        </div>
      ) : null}

      <section
        id="tool"
        className={cn(
          "pb-12",
          isDashboard ? "w-full" : "mx-auto max-w-7xl px-4 md:px-8",
        )}
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

            <div className="shadow-soft relative mt-6 min-h-96 overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-gradient-to-r from-sky-50 to-card px-5 py-3 dark:from-sky-950/30">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary">
                    <Wand2 className="h-3.5 w-3.5" />
                  </span>
                  <h2 className="text-sm font-semibold">Analise com IA</h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    <Crown className="h-2.5 w-2.5" /> PRO
                  </span>
                </div>
                <div className="flex gap-1 rounded-lg border border-border bg-card p-1 text-xs">
                  <button className="rounded-md bg-primary px-2.5 py-1 font-medium text-primary-foreground" type="button">
                    SEO & Legibilidade
                  </button>
                  <button className="rounded-md px-2.5 py-1 font-medium text-muted-foreground" type="button">
                    Reescrita & Tom
                  </button>
                  <button className="rounded-md px-2.5 py-1 font-medium text-muted-foreground" type="button">
                    Correcao
                  </button>
                </div>
              </div>

              <div className="relative select-none p-6 blur-sm">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="md:col-span-1">
                    <div className="rounded-xl border border-border bg-muted/20 p-5 text-center">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Score SEO
                      </span>
                      <div className="mt-2 text-5xl font-bold tracking-tight text-primary">82</div>
                      <div className="mt-1 text-[11px] text-muted-foreground">/100 · Bom</div>
                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-primary to-sky-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Sugestoes da IA
                    </h3>
                    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-success/10 text-success">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Meta title bem dimensionado</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          58 de 60 caracteres — ideal pra preview do Google sem corte.
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-warning/10 text-warning">
                        <AlertCircle className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">
                          Pouca repeticao da palavra-chave principal
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          Considere usar &quot;design de produto&quot; mais 1x na primeira frase.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-card/40 via-card/80 to-card backdrop-blur-[2px]">
                <div className="shadow-elegant mx-4 max-w-md rounded-2xl border border-primary/30 bg-card p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Crown className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">
                    Desbloqueie a Analise com IA
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    SEO, reescrita de tom e correcao gramatical com IA — em todos os seus
                    textos, ilimitado.
                  </p>
                  <div className="mt-5 flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold tracking-tight">R$ 20</span>
                    <span className="text-sm text-muted-foreground">/mes</span>
                  </div>
                  <a
                    href="#tool"
                    className="shadow-glow mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <Sparkles className="h-4 w-4" /> Assinar Pro
                  </a>
                </div>
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

            <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-sky-50 via-card to-card p-6 dark:from-sky-950/40">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                    TextoTools Pro
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold tracking-tight">
                  IA pra polir cada texto
                </h3>
                <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    Analise SEO e legibilidade
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    Reescrita em tons diferentes
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    Correcao gramatical avancada
                  </li>
                </ul>
                <a
                  href="#tool"
                  className="shadow-soft mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
                >
                  Assinar por R$ 20/mes
                </a>
              </div>
            </div>

            {!isDashboard ? <AdSlot size="rectangle" /> : null}
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

        {!isDashboard ? (
          <div className="pt-6">
            <AdSlot size="inline" className="mx-auto max-w-3xl" />
          </div>
        ) : null}
      </section>
    </>
  );
}
