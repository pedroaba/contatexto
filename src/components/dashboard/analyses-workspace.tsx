"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Bot,
  Briefcase,
  Camera,
  CheckCheck,
  Clock3,
  Copy,
  Crown,
  Download,
  Eraser,
  FileStack,
  Hash,
  Layers,
  Lock,
  Plus,
  Save,
  Search,
  Share2,
  Trash2,
  Type,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CounterService } from "@/services/counter.service";
import type {
  AnalysisFilter,
  AnalysisListItem,
  SavedAnalysis,
  UserPlan,
} from "@/services/analysis.types.ts";

const counterService = new CounterService();
const FREE_ANALYSIS_LIMIT = 50;

const metricIcons = {
  characters: Type,
  charactersWithoutSpaces: Hash,
  words: Type,
  uniqueWords: Layers,
  sentences: Activity,
  paragraphs: Layers,
  lines: Hash,
  readingTime: Clock3,
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

function sortAnalyses<T extends { updatedAt: string }>(analyses: T[]) {
  return [...analyses].sort((left, right) =>
    right.updatedAt.localeCompare(left.updatedAt),
  );
}

async function parseApiResponse(response: Response) {
  const body = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw new Error(body?.error ?? "Não foi possível concluir a operação.");
  }

  return body;
}

interface AnalysesWorkspaceProps {
  initialAnalyses: AnalysisListItem[];
  userPlan: UserPlan;
}

export function AnalysesWorkspace({
  initialAnalyses,
  userPlan,
}: AnalysesWorkspaceProps) {
  const [analyses, setAnalyses] = React.useState<AnalysisListItem[]>(
    sortAnalyses(initialAnalyses),
  );
  const [activeAnalysisId, setActiveAnalysisId] = React.useState<string | null>(
    initialAnalyses[0]?.id ?? null,
  );
  const [title, setTitle] = React.useState(initialAnalyses[0]?.title ?? "");
  const [text, setText] = React.useState(initialAnalyses[0]?.text ?? "");
  const [filter, setFilter] = React.useState<AnalysisFilter>("all");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isDuplicating, setIsDuplicating] = React.useState(false);
  const [isRunningAi, setIsRunningAi] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const deferredText = React.useDeferredValue(text);
  const liveAnalysis = React.useMemo(
    () => counterService.analyze(deferredText),
    [deferredText],
  );

  const activeSavedAnalysis = React.useMemo(
    () => analyses.find((analysis) => analysis.id === activeAnalysisId) ?? null,
    [activeAnalysisId, analyses],
  );

  const isDirty = activeSavedAnalysis
    ? title.trim() !== activeSavedAnalysis.title || text !== activeSavedAnalysis.text
    : title.trim().length > 0 || text.length > 0;

  const visibleAnalyses = React.useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    return analyses.filter((analysis) => {
      const matchesFilter =
        filter === "with-ai"
          ? analysis.aiStatus === "ready"
          : filter === "without-ai"
            ? analysis.aiStatus !== "ready"
            : true;

      if (!matchesFilter) {
        return false;
      }

      if (!normalizedSearchTerm) {
        return true;
      }

      return [analysis.title, analysis.excerpt]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearchTerm);
    });
  }, [analyses, filter, searchTerm]);

  const saveUsageLabel =
    userPlan === "Pro"
      ? `${analyses.length} análises salvas`
      : `${analyses.length}/${FREE_ANALYSIS_LIMIT} análises salvas`;

  const activeAiAnalysis = activeSavedAnalysis?.aiStatus === "ready"
    ? activeSavedAnalysis.aiAnalysis
    : null;
  const hasStaleAiAnalysis = Boolean(activeAiAnalysis && isDirty);
  const lastSavedLabel = activeSavedAnalysis
    ? new Date(activeSavedAnalysis.updatedAt).toLocaleString("pt-BR")
    : "Ainda não salvo";

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isSaveShortcut =
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "s";

      if (!isSaveShortcut) {
        return;
      }

      event.preventDefault();

      if (!isSaving) {
        void handleSave();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSaving, title, text, activeSavedAnalysis]);

  function canLeaveCurrentDraft() {
    if (!isDirty) {
      return true;
    }

    return window.confirm(
      "Você tem alterações não salvas. Deseja descartá-las e continuar?",
    );
  }

  function syncEditor(
    analysis: AnalysisListItem | SavedAnalysis | null,
    options?: {
      force?: boolean;
    },
  ) {
    if (!options?.force && !canLeaveCurrentDraft()) {
      return false;
    }

    setActiveAnalysisId(analysis?.id ?? null);
    setTitle(analysis?.title ?? "");
    setText(analysis?.text ?? "");

    return true;
  }

  function upsertAnalysis(nextAnalysis: SavedAnalysis) {
    setAnalyses((current) =>
      sortAnalyses(
        current
          .filter((analysis) => analysis.id !== nextAnalysis.id)
          .concat({
            ...nextAnalysis,
            excerpt:
              nextAnalysis.text.trim().replace(/\s+/g, " ").slice(0, 120) ||
              "Sem conteúdo salvo.",
          }),
      ),
    );
  }

  async function saveAnalysis() {
    setIsSaving(true);

    try {
      const response = await fetch(
        activeSavedAnalysis ? `/api/analyses/${activeSavedAnalysis.id}` : "/api/analyses",
        {
          method: activeSavedAnalysis ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            title,
          }),
        },
      );
      const body = await parseApiResponse(response);
      const nextAnalysis = body.analysis as SavedAnalysis;
      upsertAnalysis(nextAnalysis);
      syncEditor(nextAnalysis, {
        force: true,
      });
      toast.success("Análise salva");

      return nextAnalysis;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar.");

      return null;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSave() {
    await saveAnalysis();
  }

  async function handleDuplicate(targetAnalysis = activeSavedAnalysis) {
    setIsDuplicating(true);

    try {
      const sourceAnalysis =
        targetAnalysis && targetAnalysis.id === activeSavedAnalysis?.id && !isDirty
          ? targetAnalysis
          : await saveAnalysis();

      if (!sourceAnalysis) {
        return;
      }

      const response = await fetch(`/api/analyses/${sourceAnalysis.id}/duplicate`, {
        method: "POST",
      });
      const body = await parseApiResponse(response);
      const duplicated = body.analysis as SavedAnalysis;
      upsertAnalysis(duplicated);
      syncEditor(duplicated, {
        force: true,
      });

      toast.success("Análise duplicada");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível duplicar.");
    } finally {
      setIsDuplicating(false);
    }
  }

  async function handleDelete(targetId = activeSavedAnalysis?.id) {
    if (!targetId) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/analyses/${targetId}`, {
        method: "DELETE",
      });
      await parseApiResponse(response);
      const nextAnalyses = analyses.filter((analysis) => analysis.id !== targetId);

      setAnalyses(nextAnalyses);

      if (activeAnalysisId === targetId) {
        syncEditor(nextAnalyses[0] ?? null, {
          force: true,
        });
      }

      toast.success("Análise removida");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível remover.");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleRunAi() {
    if (userPlan !== "Pro") {
      toast.error("Análise com IA disponível apenas no plano Pro.");
      return;
    }

    setIsRunningAi(true);

    try {
      const savedAnalysis = isDirty || !activeSavedAnalysis
        ? await saveAnalysis()
        : activeSavedAnalysis;

      if (!savedAnalysis) {
        return;
      }

      const response = await fetch(`/api/analyses/${savedAnalysis.id}/ai`, {
        method: "POST",
      });
      const body = await parseApiResponse(response);
      const updated = body.analysis as SavedAnalysis;
      upsertAnalysis(updated);
      syncEditor(updated, {
        force: true,
      });
      toast.success("Análise com IA pronta");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível executar a IA.");
    } finally {
      setIsRunningAi(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Texto copiado");
    window.setTimeout(() => setCopied(false), 1200);
  }

  function handleClear() {
    if (!text.trim()) {
      setText("");
      return;
    }

    const shouldClear = window.confirm(
      "Deseja limpar o texto do editor? As alterações não salvas serão perdidas.",
    );

    if (!shouldClear) {
      return;
    }

    setText("");
    toast.success("Texto limpo");
  }

  function handleExport() {
    const blob = new Blob([text], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "analise.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleNewAnalysis() {
    syncEditor(null);
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[1.9rem] border border-border bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--color-primary)_18%,transparent),transparent_30%),linear-gradient(135deg,color-mix(in_oklab,var(--color-card)_96%,white_4%)_0%,var(--color-card)_60%,color-mix(in_oklab,var(--color-card)_88%,black_12%)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.12)] sm:p-8">
        <div className="absolute -right-12 top-0 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-success/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <FileStack className="h-3.5 w-3.5 text-sky-300" />
              Workspace de análises
            </span>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Escreva, salve snapshots e execute a leitura PRO com IA sem perder o histórico.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Fluxo rápido para edição e métricas. Fluxo PRO sob demanda para clareza,
              SEO e tom.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground">
              <div className="text-muted-foreground">Plano atual</div>
              <div className="mt-1 flex items-center gap-2 font-semibold">
                {userPlan === "Pro" ? <Crown className="h-4 w-4 text-amber-300" /> : null}
                {userPlan}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground">
              <div className="text-muted-foreground">Histórico</div>
              <div className="mt-1 font-semibold">{saveUsageLabel}</div>
            </div>

            <Button
              type="button"
              size="lg"
              className="rounded-2xl px-5"
              onClick={handleNewAnalysis}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova análise
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-6">
          <Card className="overflow-hidden rounded-[1.8rem] py-0 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <CardHeader className="gap-4 border-b px-6 py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardDescription>Análise ativa</CardDescription>
                  <CardTitle className="mt-1 text-xl">Editor e contagem em tempo real</CardTitle>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    {activeSavedAnalysis ? "saved" : "draft"}
                  </Badge>
                  <Badge
                    variant={isDirty ? "outline" : "secondary"}
                    className={cn(
                      isDirty ? "text-amber-700 dark:text-amber-300" : "text-emerald-700 dark:text-emerald-300",
                    )}
                  >
                    {isDirty ? "alterações não salvas" : "snapshot atualizado"}
                  </Badge>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleClear}
                  >
                    <Eraser className="mr-2 h-4 w-4" />
                    Limpar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => void handleDuplicate()}
                    disabled={isDuplicating}
                  >
                    {isDuplicating ? (
                      <Spinner className="mr-2 h-4 w-4" />
                    ) : (
                      <Copy className="mr-2 h-4 w-4" />
                    )}
                    Duplicar
                  </Button>
                </div>
              </div>

              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Título da análise"
                className="bg-background"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>
                  Use este espaço como área principal de escrita. Ajuste o título
                  para encontrar a análise mais rápido depois.
                </span>
                <span>
                  Atalho: <kbd className="rounded bg-muted px-1.5 py-0.5">Ctrl</kbd>/
                  <kbd className="rounded bg-muted px-1.5 py-0.5">Cmd</kbd> +{" "}
                  <kbd className="rounded bg-muted px-1.5 py-0.5">S</kbd>
                </span>
              </div>
            </CardHeader>

            <div className="px-6 py-6">
              <div className="overflow-hidden rounded-[1.6rem] border border-border bg-background shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/25 px-5 py-3 text-xs text-muted-foreground">
                  <span>Escreva, cole ou revise seu texto aqui</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-background px-2.5 py-1">
                      Leitura {liveAnalysis.metrics.find((metric) => metric.id === "readingTime")?.value}
                    </span>
                    <span className="rounded-full bg-background px-2.5 py-1">
                      {liveAnalysis.summary.words} palavras
                    </span>
                  </div>
                </div>

                <textarea
                  rows={16}
                  className="block min-h-[34rem] w-full resize-y border-0 bg-transparent px-5 py-5 text-[1.05rem] leading-8 text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder={"Comece a escrever aqui...\n\nDica: use frases curtas, títulos objetivos e quebras de parágrafo para facilitar a leitura."}
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                />
              </div>
            </div>

            <CardFooter className="justify-between gap-3 border-t px-6 py-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-full bg-muted px-2.5 py-1">
                  <span className="font-medium text-foreground">
                    {liveAnalysis.summary.characters}
                  </span>{" "}
                  caracteres
                </span>
                <span className="rounded-full bg-muted px-2.5 py-1">
                  <span className="font-medium text-foreground">
                    {liveAnalysis.summary.words}
                  </span>{" "}
                  palavras
                </span>
                <span className="rounded-full bg-muted px-2.5 py-1">
                  <span className="font-medium text-foreground">
                    {liveAnalysis.summary.sentences}
                  </span>{" "}
                  frases
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void handleCopy()}
                >
                  {copied ? (
                    <CheckCheck className="mr-2 h-4 w-4" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  Copiar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleExport}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
                <Button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={isSaving}
                >
                  {isSaving ? <Spinner className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                  Salvar análise
                </Button>
              </div>
            </CardFooter>
          </Card>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {liveAnalysis.metrics.map((metric) => {
              const Icon = metricIcons[metric.id];

              return (
                <article
                  key={metric.id}
                  className="rounded-[1.5rem] border border-border bg-card p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                        {metric.value}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">{metric.hint}</p>
                </article>
              );
            })}
          </section>

          <Card className="overflow-hidden rounded-[1.8rem] py-0 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <CardHeader className="flex-row items-center justify-between border-b px-6 py-5">
              <div>
                <CardDescription>Qualidade local</CardDescription>
                <CardTitle className="mt-1 text-xl">Clareza e leitura</CardTitle>
              </div>

              <Badge variant="secondary">{liveAnalysis.quality.readabilityLabel}</Badge>
            </CardHeader>

            <CardContent className="grid gap-4 px-6 py-6 sm:grid-cols-2 xl:grid-cols-4">
              {liveAnalysis.quality.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border bg-muted/35 p-4"
                >
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {item.label}
                  </div>
                  <div className="mt-2 text-lg font-semibold text-foreground">{item.value}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[1.8rem] py-0 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <CardHeader className="border-b px-6 py-5">
              <div>
                <CardDescription>Limites monitorados</CardDescription>
                <CardTitle className="mt-1 text-xl">Plataformas e SEO</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="divide-y px-0">
              {liveAnalysis.platformLimits.map((limit) => {
                const Icon = limitIcons[limit.id as keyof typeof limitIcons];
                const styles = statusStyles(limit.status);

                return (
                  <div
                    key={limit.id}
                    className="grid grid-cols-12 items-center gap-4 px-6 py-4"
                  >
                    <div className="col-span-12 flex items-center gap-2.5 sm:col-span-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </span>
                      <div>
                        <div className="text-sm font-medium text-foreground">{limit.name}</div>
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
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden rounded-[1.8rem] py-0 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <CardHeader className="border-b px-6 py-5">
              <div>
                <CardDescription>Ações</CardDescription>
                <CardTitle className="mt-1 text-xl">Snapshot atual</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 px-6 py-6">
              <div className="rounded-2xl border border-border bg-muted/20 px-4 py-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-foreground">
                    {activeSavedAnalysis ? "Snapshot vinculado" : "Rascunho local"}
                  </span>
                  <span className="text-muted-foreground">
                    Último salvamento: {lastSavedLabel}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Atalho rápido: <kbd className="rounded bg-background px-1.5 py-0.5">Ctrl</kbd>/
                  <kbd className="rounded bg-background px-1.5 py-0.5">Cmd</kbd> +{" "}
                  <kbd className="rounded bg-background px-1.5 py-0.5">S</kbd>
                </p>
              </div>

              <Button
                type="button"
                className="w-full justify-start"
                onClick={() => void handleSave()}
                disabled={isSaving}
              >
                {isSaving ? <Spinner className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                Salvar análise
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full justify-start"
                onClick={() => void handleDuplicate()}
                disabled={isDuplicating}
              >
                {isDuplicating ? (
                  <Spinner className="mr-2 h-4 w-4" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                  Duplicar análise
              </Button>

              <Button
                type="button"
                variant="destructive"
                className="w-full justify-start"
                onClick={() => void handleDelete()}
                disabled={!activeSavedAnalysis || isDeleting}
              >
                {isDeleting ? (
                  <Spinner className="mr-2 h-4 w-4" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                  Excluir análise
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[1.8rem] py-0 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <CardHeader className="flex-row items-center justify-between border-b bg-primary/5 px-6 py-5">
              <div>
                <CardDescription>Camada PRO</CardDescription>
                <CardTitle className="mt-1 flex items-center gap-2 text-xl">
                  <Wand2 className="h-5 w-5 text-primary" />
                  Análise com IA
                </CardTitle>
              </div>

              <Badge variant="secondary" className="text-amber-700 dark:text-amber-300">
                <Crown className="mr-1 h-3 w-3" />
                PRO
              </Badge>
            </CardHeader>

            {userPlan === "Pro" ? (
              <CardContent className="space-y-5 px-6 py-6">
                <Button
                  type="button"
                  className="w-full justify-start"
                  onClick={() => void handleRunAi()}
                  disabled={isRunningAi}
                >
                  {isRunningAi ? (
                    <Spinner className="mr-2 h-4 w-4" />
                  ) : (
                    <Bot className="mr-2 h-4 w-4" />
                  )}
                  Executar análise com IA
                </Button>

                {activeAiAnalysis ? (
                  <div className="space-y-4">
                    {hasStaleAiAnalysis ? (
                      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                        <div>
                          A leitura da IA está baseada no último snapshot salvo.
                          Salve ou execute a IA novamente para atualizar o resultado.
                        </div>
                      </div>
                    ) : null}

                    <div className="rounded-2xl border border-border bg-muted/35 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-foreground">Resumo da IA</div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {activeAiAnalysis.summary}
                          </p>
                        </div>
                      </div>
                    </div>

                    {activeAiAnalysis.sections.map((section) => (
                      <div
                        key={section.id}
                        className="rounded-2xl border border-border bg-muted/35 p-4"
                      >
                        <div className="text-sm font-semibold text-foreground">{section.title}</div>
                        <p className="mt-1 text-sm text-muted-foreground">{section.summary}</p>
                        <ul className="mt-3 space-y-2 text-sm text-foreground/85">
                          {section.items.map((item) => (
                            <li key={item} className="rounded-xl bg-background px-3 py-2">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border bg-muted/25 p-5 text-sm text-muted-foreground">
                    {activeSavedAnalysis
                      ? "Execute a IA para gerar uma leitura estruturada de clareza, SEO e tom."
                      : "Salve o snapshot atual primeiro. Se quiser, o botão de IA salva e executa em seguida."}
                  </div>
                )}
              </CardContent>
            ) : (
              <CardContent className="space-y-4 px-6 py-6">
                <div className="rounded-2xl border border-dashed border-border bg-muted/25 p-5">
                  <div className="flex items-start gap-3">
                    <span className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <Lock className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        Clareza, SEO e tom sob demanda
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        O plano Pro libera leitura estruturada, histórico com IA e um
                        fluxo pensado para uso frequente.
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/api/stripe/checkout?interval=monthly"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Ver plano Pro
                </Link>
              </CardContent>
            )}
          </Card>

          <Card className="overflow-hidden rounded-[1.8rem] py-0 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 border-b px-6 py-5">
              <div>
                <CardDescription>Histórico salvo</CardDescription>
                <CardTitle className="mt-1 text-xl">Lista de análises</CardTitle>
              </div>

              <div className="flex gap-2">
                {[
                  ["all", "Todos"],
                  ["with-ai", "Com IA"],
                  ["without-ai", "Sem IA"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium transition",
                      filter === value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80",
                    )}
                    onClick={() => setFilter(value as AnalysisFilter)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="space-y-3 px-4 py-4">
              <div className="space-y-3 px-2 pb-1">
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar por título ou trecho..."
                  className="bg-background"
                />
                <div className="text-xs text-muted-foreground">
                  {visibleAnalyses.length} resultado(s)
                </div>
              </div>

              {visibleAnalyses.length > 0 ? (
                visibleAnalyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className={cn(
                      "rounded-2xl border p-4 transition",
                      activeAnalysisId === analysis.id
                        ? "border-primary/40 bg-primary/8"
                        : "border-border bg-background hover:border-primary/20 hover:bg-muted/35",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="truncate text-sm font-semibold text-foreground">
                            {analysis.title}
                          </span>
                          <Badge
                            variant={analysis.aiStatus === "ready" ? "secondary" : "outline"}
                            className={cn(
                              analysis.aiStatus === "ready"
                                ? "text-emerald-700 dark:text-emerald-300"
                                : "text-muted-foreground",
                            )}
                          >
                            {analysis.aiStatus === "ready" ? "Com IA" : "Sem IA"}
                          </Badge>
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {analysis.excerpt}
                        </p>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          className="rounded-lg bg-muted p-2 text-muted-foreground transition hover:bg-muted/80 hover:text-foreground"
                          onClick={(event) => {
                            event.stopPropagation();
                            void handleDuplicate(analysis);
                          }}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          className="rounded-lg bg-muted p-2 text-muted-foreground transition hover:bg-muted/80 hover:text-foreground"
                          onClick={(event) => {
                            event.stopPropagation();
                            void handleDelete(analysis.id);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-3 w-full rounded-xl border border-transparent bg-transparent px-0 text-left transition hover:border-primary/15 focus-visible:border-primary/30 focus-visible:outline-none"
                      onClick={() => {
                        syncEditor(analysis);
                      }}
                    >
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {analysis.excerpt}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>{analysis.summary.characters} chars</span>
                        <span>{analysis.summary.words} palavras</span>
                        <span>{new Date(analysis.updatedAt).toLocaleString("pt-BR")}</span>
                      </div>
                    </button>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
                  {searchTerm
                    ? "Nenhuma análise encontrada para esta busca."
                    : "Nenhuma análise encontrada neste filtro."}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
