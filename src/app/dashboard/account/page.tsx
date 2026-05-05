import { redirect } from "next/navigation";
import {
  RiCheckboxCircleLine,
  RiFileChartLine,
  RiFingerprintLine,
  RiMailCheckLine,
  RiShieldCheckLine,
  RiSparklingLine,
  RiVipCrownLine,
} from "@remixicon/react";

import { AccountActionsPanel } from "@/components/account/account-actions-panel";
import { AccountProfileForm } from "@/components/account/account-profile-form";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import { StructuredData } from "@/components/structured-data";
import { getSessionUser } from "@/lib/auth/session";
import { buildMetadata, buildWebPageSchema } from "@/lib/seo";
import { FirestoreSavedAnalysisRepository } from "@/services/analysis-firestore.repository";

export const metadata = buildMetadata({
  path: "/dashboard/account",
  title: "Conta",
  description: "Dados da conta, plano atual, segurança e visão geral do uso.",
});

const repository = new FirestoreSavedAnalysisRepository();
const FREE_ANALYSIS_LIMIT = 50;

function formatDateLabel(date: Date | null) {
  if (!date) {
    return "Nenhuma atividade recente";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function DashboardAccountPage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/login");
  }

  const analyses = await repository.listByUserId(sessionUser.uid);
  const analysesWithAi = analyses.filter(
    (analysis) => analysis.aiStatus === "ready",
  ).length;
  const latestAnalysis = analyses[0] ?? null;
  const freeRemaining = Math.max(0, FREE_ANALYSIS_LIMIT - analyses.length);
  const accountName =
    sessionUser.displayName?.trim() ||
    sessionUser.email?.trim() ||
    "Minha conta";
  const planUsageRatio =
    sessionUser.plan === "Pro"
      ? 1
      : Math.min(analyses.length / FREE_ANALYSIS_LIMIT, 1);
  const planUsagePercentage = Math.round(planUsageRatio * 100);
  const planProgressTone =
    sessionUser.plan === "Pro"
      ? "from-primary/90 via-primary to-primary/70"
      : planUsageRatio >= 0.9
        ? "from-amber-500 via-amber-400 to-orange-400"
        : planUsageRatio >= 0.7
          ? "from-primary via-sky-400 to-cyan-400"
          : "from-emerald-500 via-teal-400 to-cyan-400";

  return (
    <>
      <StructuredData
        data={buildWebPageSchema({
          path: "/dashboard/account",
          title: "Conta",
          description:
            "Dados da conta, plano atual, segurança e visão geral do uso.",
        })}
      />

      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-[1.9rem] border border-border bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--color-primary)_16%,transparent),transparent_30%),linear-gradient(135deg,color-mix(in_oklab,var(--color-card)_96%,white_4%)_0%,var(--color-card)_60%,color-mix(in_oklab,var(--color-card)_88%,black_12%)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.12)] sm:p-8">
          <div className="absolute -right-12 top-0 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-success/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <UserAvatar
                name={accountName}
                src={sessionUser.photoURL}
                className="size-16 rounded-[1.6rem] border-primary/30 bg-primary/10 shadow-lg"
                imageClassName="rounded-[1.6rem]"
                fallbackClassName="rounded-[1.6rem] bg-primary text-xl font-semibold text-primary-foreground"
              />

              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                  <RiShieldCheckLine className="size-3.5 text-primary" />
                  Conta protegida
                </span>

                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {accountName}
                </h1>

                <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
                  Revise seus dados de acesso, plano atual e a forma como você
                  está usando o produto.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge
                variant={sessionUser.plan === "Pro" ? "secondary" : "outline"}
                className="h-8 rounded-full px-3 text-sm"
              >
                <RiVipCrownLine className="mr-1 size-4" />
                Plano {sessionUser.plan}
              </Badge>

              <Badge
                variant={sessionUser.emailVerified ? "secondary" : "outline"}
                className="h-8 rounded-full px-3 text-sm"
              >
                <RiMailCheckLine className="mr-1 size-4" />
                {sessionUser.emailVerified
                  ? "E-mail verificado"
                  : "Verificação pendente"}
              </Badge>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-[1.6rem] border border-border bg-card p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Plano atual</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                  {sessionUser.plan}
                </p>
              </div>
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <RiVipCrownLine className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {sessionUser.plan === "Pro"
                ? "Recursos premium e IA já liberados."
                : `${freeRemaining} espaços restantes antes do limite do Free.`}
            </p>
          </Card>

          <Card className="rounded-[1.6rem] border border-border bg-card p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Análises salvas</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                  {analyses.length}
                </p>
              </div>
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <RiFileChartLine className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Última atividade:{" "}
              {formatDateLabel(
                latestAnalysis ? new Date(latestAnalysis.updatedAt) : null,
              )}
            </p>
          </Card>

          <Card className="rounded-[1.6rem] border border-border bg-card p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Análises com IA</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                  {analysesWithAi}
                </p>
              </div>
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <RiSparklingLine className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {analysesWithAi > 0
                ? "Você já tem histórico enriquecido para revisitar."
                : "Ainda não há leituras com IA salvas na conta."}
            </p>
          </Card>

          <Card className="rounded-[1.6rem] border border-border bg-card p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Segurança</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                  {sessionUser.emailVerified ? "OK" : "Pendente"}
                </p>
              </div>
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <RiCheckboxCircleLine className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Seu acesso está ativo e sua conta está protegida.
            </p>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-6">
            <AccountProfileForm user={sessionUser} />

            <Card className="rounded-[1.8rem] py-0 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <CardHeader className="px-6 py-5">
                <CardDescription>Segurança e acesso</CardDescription>
                <CardTitle className="mt-1 text-xl">
                  Como sua conta está protegida
                </CardTitle>
              </CardHeader>

              <CardContent className="grid gap-3 px-6 pb-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-muted/25 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <RiMailCheckLine className="size-4 text-primary" />
                    Verificação de e-mail
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {sessionUser.emailVerified
                      ? "Seu endereço principal já foi validado."
                      : "Seu e-mail ainda não foi verificado."}
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-muted/25 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <RiFingerprintLine className="size-4 text-primary" />
                    Acesso ao dashboard
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Sua conta permanece conectada para que você continue de onde
                    parou com segurança.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6">
            <Card className="rounded-[1.8rem] py-0 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <CardHeader className="px-6 py-5">
                <CardDescription>Uso da conta</CardDescription>
                <CardTitle className="mt-1 text-xl">
                  Resumo do seu momento
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 px-6 pb-6">
                <div className="overflow-hidden rounded-[1.6rem] border border-border bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--color-primary)_14%,transparent),transparent_35%),linear-gradient(180deg,color-mix(in_oklab,var(--color-card)_96%,white_4%)_0%,color-mix(in_oklab,var(--color-card)_88%,black_12%)_100%)] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Uso do plano
                      </p>
                      <div className="mt-3 flex items-end gap-2">
                        <span className="text-4xl font-semibold tracking-tight text-foreground">
                          {sessionUser.plan === "Pro"
                            ? analyses.length
                            : analyses.length}
                        </span>
                        <span className="pb-1 text-sm text-muted-foreground">
                          {sessionUser.plan === "Pro"
                            ? "análises salvas"
                            : `/ ${FREE_ANALYSIS_LIMIT}`}
                        </span>
                      </div>
                    </div>

                    <Badge
                      variant={sessionUser.plan === "Pro" ? "secondary" : "outline"}
                      className="rounded-full px-3"
                    >
                      {sessionUser.plan}
                    </Badge>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {sessionUser.plan === "Pro"
                          ? "Histórico ativo"
                          : `${planUsagePercentage}% do limite usado`}
                      </span>
                      <span>
                        {sessionUser.plan === "Pro"
                          ? `${analysesWithAi} com IA`
                          : `${freeRemaining} restantes`}
                      </span>
                    </div>

                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted/60">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${planProgressTone}`}
                        style={{ width: `${Math.max(planUsagePercentage, sessionUser.plan === "Pro" ? 100 : analyses.length > 0 ? 8 : 0)}%` }}
                      />
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {sessionUser.plan === "Pro"
                      ? "Seu plano está livre para expandir o histórico, revisitar análises e usar IA sempre que fizer sentido."
                      : `Você ainda tem ${freeRemaining} espaços no Free para continuar salvando análises com tranquilidade.`}
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-muted/25 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        Próxima oportunidade
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {latestAnalysis
                          ? `Reabra “${latestAnalysis.title}” para continuar de onde parou.`
                          : "Crie sua primeira análise salva para começar a montar histórico e métricas."}
                      </p>
                    </div>

                    <div className="rounded-xl border border-border bg-background/70 px-3 py-2 text-right">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        Agora
                      </div>
                      <div className="mt-1 text-sm font-semibold text-foreground">
                        {latestAnalysis ? "Retomar análise" : "Começar histórico"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full border border-border bg-background/70 px-2.5 py-1">
                      {analyses.length} salvas
                    </span>
                    <span className="rounded-full border border-border bg-background/70 px-2.5 py-1">
                      {analysesWithAi} com IA
                    </span>
                    <span className="rounded-full border border-border bg-background/70 px-2.5 py-1">
                      {latestAnalysis ? "Última atividade disponível" : "Sem histórico ainda"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <AccountActionsPanel isPro={sessionUser.plan === "Pro"} />
          </div>
        </section>
      </div>
    </>
  );
}
