import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Bot,
  Clock3,
  Crown,
  Gem,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StructuredData } from "@/components/structured-data";
import { getSessionUser } from "@/lib/auth/session";
import { buildMetadata, buildWebPageSchema } from "@/lib/seo";
import { FirestoreSavedAnalysisRepository } from "@/services/analysis-firestore.repository";
import { DashboardOverviewService } from "@/services/dashboard-overview.service";

export const metadata = buildMetadata({
  path: "/dashboard",
  title: "Dashboard",
  description:
    "Painel principal com visão geral, análises recentes e destaque do plano Pro com IA.",
});

const dashboardOverviewService = new DashboardOverviewService();
const repository = new FirestoreSavedAnalysisRepository();

const statIcons = {
  month: TrendingUp,
  saved: Sparkles,
  quality: Target,
  plan: Crown,
} as const;

const plusFeatureAccents = [
  "from-sky-500/18 to-sky-500/6",
  "from-emerald-500/18 to-emerald-500/6",
  "from-amber-500/18 to-amber-500/6",
  "from-fuchsia-500/18 to-fuchsia-500/6",
] as const;

export default async function DashboardPage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/login");
  }

  const analyses = await repository.listByUserId(sessionUser.uid);
  const overview = dashboardOverviewService.build({
    analyses,
    plan: sessionUser.plan,
  });

  return (
    <>
      <StructuredData
        data={buildWebPageSchema({
          path: "/dashboard",
          title: "Dashboard",
          description:
            "Painel principal com visão geral, análises recentes e destaque do plano Pro com IA.",
        })}
      />

      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-[1.9rem] border border-border bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--color-primary)_18%,transparent),transparent_28%),linear-gradient(135deg,color-mix(in_oklab,var(--color-card)_96%,white_4%)_0%,var(--color-card)_60%,color-mix(in_oklab,var(--color-card)_88%,black_12%)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.12)] sm:p-8">
          <div className="absolute -right-16 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Visão geral das análises
              </span>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Painel para acompanhar histórico, ritmo de uso e evolução das suas
                análises.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Aqui fica a visão rápida do que você analisou, atalhos para voltar
                ao fluxo principal e destaque do que o Pro libera com IA.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                render={<Link href="/dashboard/analyses" />}
                size="lg"
                className="rounded-2xl px-5"
              >
                Nova análise
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                render={
                  <Link
                    href={
                      sessionUser.plan === "Pro"
                        ? "/api/stripe/portal"
                        : "/api/stripe/checkout?interval=monthly"
                    }
                  />
                }
                variant="outline"
                size="lg"
                className="rounded-2xl px-5"
              >
                {sessionUser.plan === "Pro" ? "Gerenciar assinatura" : "Assinar Pro"}
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {overview.stats.map((item) => {
            const Icon = statIcons[item.icon];

            return (
              <Card
                key={item.label}
                className="rounded-[1.6rem] border border-border bg-card p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                      {item.value}
                    </p>
                  </div>
                  <div className={`rounded-2xl bg-primary/10 p-3 ${item.tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{item.delta}</p>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.5fr_0.95fr]">
          <Card className="rounded-[1.8rem] py-0 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <CardHeader className="flex-row items-center justify-between border-b px-6 py-5">
              <div>
                <CardDescription>Histórico recente</CardDescription>
                <CardTitle className="mt-1 text-xl">Últimas análises</CardTitle>
              </div>
              <Link
                href="/dashboard/analyses"
                className="text-sm font-medium text-primary transition hover:text-primary/80"
              >
                Ver todas
              </Link>
            </CardHeader>

            <CardContent className="space-y-4 px-6 py-6">
              {overview.recentAnalyses.length > 0 ? (
                overview.recentAnalyses.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-border bg-muted/30 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground">
                            {item.title}
                          </h3>
                          <Badge
                            variant={item.hasAi ? "secondary" : "outline"}
                            className={
                              item.hasAi
                                ? "text-emerald-700 dark:text-emerald-300"
                                : "text-muted-foreground"
                            }
                          >
                            {item.hasAi ? "Com IA" : "Sem IA"}
                          </Badge>
                        </div>
                        <p className="mt-1 inline-flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock3 className="h-3.5 w-3.5" />
                          {item.updatedAt}
                        </p>
                      </div>

                      <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                        {item.metrics}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
                  {overview.emptyRecentLabel}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card className="rounded-[1.8rem] py-0 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <CardHeader className="px-6 py-5">
                <CardDescription>Ações rápidas</CardDescription>
                <CardTitle className="mt-1 text-xl">Voltar ao que importa</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 px-6 pb-6">
                {overview.quickActions.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="block rounded-2xl border border-border bg-muted/25 p-4 transition hover:border-primary/20 hover:bg-muted/45"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {sessionUser.plan !== "Pro" ? (
              <Card className="overflow-hidden rounded-[1.8rem] border-primary/20 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--color-primary)_16%,transparent),transparent_34%),linear-gradient(180deg,color-mix(in_oklab,var(--color-primary)_10%,transparent),color-mix(in_oklab,var(--color-primary)_4%,transparent))] py-0 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                <CardHeader className="px-6 py-6">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                    <Gem className="h-3.5 w-3.5 text-primary" />
                    Upgrade para Pro
                  </div>
                  <CardTitle className="mt-4 max-w-xl text-2xl leading-tight text-foreground">
                    Destrave IA, profundidade e histórico mais útil sem mudar seu fluxo.
                  </CardTitle>
                  <CardDescription className="mt-2 max-w-xl text-sm leading-6">
                    Você continua escrevendo do mesmo jeito. O Pro entra depois, aprofundando clareza, SEO e tomada de decisão com IA.
                  </CardDescription>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-border bg-background/70 px-4 py-3">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        Fluxo
                      </div>
                      <div className="mt-2 text-sm font-semibold text-foreground">
                        Mesmo editor, mais contexto
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border bg-background/70 px-4 py-3">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        IA
                      </div>
                      <div className="mt-2 text-sm font-semibold text-foreground">
                        Sob demanda, no momento certo
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border bg-background/70 px-4 py-3">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        Histórico
                      </div>
                      <div className="mt-2 text-sm font-semibold text-foreground">
                        Mais rico para revisitar depois
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="grid gap-3 px-6 pb-6 sm:grid-cols-2">
                  {overview.plusHighlights.map((item, index) => (
                    <div
                      key={item}
                      className={`rounded-2xl border border-border bg-linear-to-br ${plusFeatureAccents[index]} px-4 py-4`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-background/80 text-primary shadow-sm">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">
                            {index === 0
                              ? "Clareza e estrutura"
                              : index === 1
                                ? "Leitura aprofundada"
                                : index === 2
                                  ? "Mais contexto editorial"
                                  : "Feito para recorrência"}
                          </div>
                          <p className="mt-1 text-sm leading-6 text-foreground/72">{item}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>

                <div className="flex flex-col gap-3 px-6 pb-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-muted-foreground">
                    Ideal para quem escreve com frequência e quer decidir mais rápido.
                  </div>
                  <Button
                    render={<Link href="/api/stripe/checkout?interval=monthly" />}
                    size="lg"
                    className="rounded-2xl px-4"
                  >
                    Assinar Pro
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ) : null}
          </div>
        </section>
      </div>
    </>
  );
}
