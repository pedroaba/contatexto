import Link from "next/link";
import { redirect } from "next/navigation";
import {
  RiAlertLine,
  RiArrowRightLine,
  RiBankCardLine,
  RiBillLine,
  RiCheckLine,
  RiExternalLinkLine,
  RiInformationLine,
  RiPriceTag3Line,
  RiRepeatLine,
  RiShieldCheckLine,
  RiSparklingLine,
  RiVipCrownLine,
} from "@remixicon/react";

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

export const metadata = buildMetadata({
  path: "/dashboard/billing",
  title: "Cobranca",
  description: "Hub de cobranca para acompanhar plano, assinatura e proximos passos com Stripe.",
});

const repository = new FirestoreSavedAnalysisRepository();
const FREE_ANALYSIS_LIMIT = 50;

const freePlanReasons = [
  "Análises salvas ilimitadas para trabalhar sem cortar histórico.",
  "Sugestões com IA para refinar clareza, SEO e copywriting.",
  "Fluxo mais forte para quem publica com frequência.",
] as const;

export default async function DashboardBillingPage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/login");
  }

  const analyses = await repository.listByUserId(sessionUser.uid);
  const freeRemaining = Math.max(0, FREE_ANALYSIS_LIMIT - analyses.length);
  const isPro = sessionUser.plan === "Pro";
  const billingReady = Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_WEBHOOK_SECRET &&
      process.env.STRIPE_PRICE_PRO_MONTHLY_ID &&
      process.env.STRIPE_PRICE_PRO_YEARLY_ID,
  );

  const currentPeriodEndLabel = sessionUser.currentPeriodEnd
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(sessionUser.currentPeriodEnd))
    : null;

  const planValueLabel =
    sessionUser.billingInterval === "year"
      ? "Pro anual"
      : sessionUser.billingInterval === "month"
        ? "Pro mensal"
        : "Pro";
  const billingIntervalLabel =
    sessionUser.billingInterval === "year"
      ? "Anual"
      : sessionUser.billingInterval === "month"
        ? "Mensal"
        : "Ainda não definido";
  const subscriptionStatusLabel =
    sessionUser.subscriptionStatus === "active"
      ? "Ativa"
      : sessionUser.subscriptionStatus === "trialing"
        ? "Em teste"
        : sessionUser.subscriptionStatus === "past_due"
          ? "Pagamento pendente"
          : sessionUser.subscriptionStatus === "canceled"
            ? "Cancelada"
            : sessionUser.subscriptionStatus === "unpaid"
              ? "Não paga"
              : isPro
                ? "Em sincronização"
                : "Sem assinatura";
  const syncedBillingFields = [
    {
      label: "Plano",
      value: isPro ? planValueLabel : "Free",
      helper: isPro ? "Definido pelos eventos da assinatura." : "Uso gratuito sem cobrança.",
    },
    {
      label: "Periodicidade",
      value: isPro ? billingIntervalLabel : "Sem recorrência",
      helper: isPro ? "Mensal ou anual conforme o preço contratado." : "Nenhum ciclo ativo.",
    },
    {
      label: "Status",
      value: subscriptionStatusLabel,
      helper: isPro
        ? "Atualizado pelos webhooks do Stripe."
        : "Só muda quando uma assinatura for criada.",
    },
    {
      label: "Próximo ciclo",
      value: currentPeriodEndLabel ?? "Ainda não disponível",
      helper:
        currentPeriodEndLabel && sessionUser.cancelAtPeriodEnd
          ? "Assinatura encerra ao final deste período."
          : "Data recebida do Stripe quando disponível.",
    },
  ] as const;

  const primaryCta = isPro
    ? {
        label: "Gerenciar assinatura",
        href: "/api/stripe/portal",
        disabled: false,
      }
    : {
        label: "Assinar Pro mensal",
        href: "/api/stripe/checkout?interval=monthly",
        disabled: false,
      };

  const secondaryCta = isPro
    ? {
        label: "Ver preços",
        href: "/pricing",
      }
    : {
        label: "Assinar Pro anual",
        href: "/api/stripe/checkout?interval=yearly",
      };

  const statusTone = isPro
    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
    : "border-border bg-background/70 text-muted-foreground";

  const summaryCards = isPro
    ? [
        {
          label: "Plano atual",
          value: planValueLabel,
          note: "Camada premium já liberada para sua conta.",
          icon: RiVipCrownLine,
        },
        {
          label: "Status da assinatura",
          value: billingReady ? "Ativa" : "Em preparo",
          note: billingReady
            ? "Cobrança recorrente gerenciada pelo Stripe."
            : "Integração com portal Stripe entra na próxima etapa.",
          icon: RiRepeatLine,
        },
        {
          label: "Próxima cobrança",
          value: currentPeriodEndLabel ?? "Disponível no portal",
          note:
            currentPeriodEndLabel
              ? sessionUser.cancelAtPeriodEnd
                ? "Assinatura encerra no fim do ciclo atual."
                : "Data sincronizada pela assinatura Stripe."
              : "Quando Stripe entrar, data e valor aparecem aqui.",
          icon: RiBillLine,
        },
        {
          label: "Método de pagamento",
          value: billingReady ? "Disponível no portal" : "Aguardando Stripe",
          note: "Cartão e invoices ficam centralizados no portal.",
          icon: RiBankCardLine,
        },
      ]
    : [
        {
          label: "Plano atual",
          value: "Free",
          note: "Comece sem cobrança recorrente nem cartão.",
          icon: RiPriceTag3Line,
        },
        {
          label: "Análises restantes",
          value: `${freeRemaining}`,
          note: `Limite atual do Free: ${FREE_ANALYSIS_LIMIT} análises salvas.`,
          icon: RiSparklingLine,
        },
        {
          label: "Status da assinatura",
          value: "Sem cobrança",
          note: "Você só entra em checkout quando decidir migrar.",
          icon: RiBillLine,
        },
        {
          label: "Próximo passo",
          value: "Upgrade opcional",
          note: "Checkout Stripe será conectado nesta área.",
          icon: RiArrowRightLine,
        },
      ];

  return (
    <>
      <StructuredData
        data={buildWebPageSchema({
          path: "/dashboard/billing",
          title: "Cobranca",
          description:
            "Hub de cobranca para acompanhar plano, assinatura e proximos passos com Stripe.",
        })}
      />

      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-[1.9rem] border border-border bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--color-primary)_16%,transparent),transparent_30%),linear-gradient(135deg,color-mix(in_oklab,var(--color-card)_96%,white_4%)_0%,var(--color-card)_60%,color-mix(in_oklab,var(--color-card)_88%,black_12%)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.12)] sm:p-8">
          <div className="absolute -right-12 top-0 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                <RiShieldCheckLine className="size-3.5 text-primary" />
                Stripe-hosted first
              </span>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Cobranca centralizada para ver plano atual e seguir para fluxo certo.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Esta área cuida do contexto da sua assinatura. Checkout, cartão,
                invoices e gestão recorrente entram pelo Stripe para manter experiência
                mais segura e enxuta.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 sm:items-end">
              <Badge
                variant={isPro ? "secondary" : "outline"}
                className="h-8 rounded-full px-3 text-sm"
              >
                <RiVipCrownLine className="mr-1 size-4" />
                Plano {sessionUser.plan}
              </Badge>

              <div className="flex flex-wrap gap-3">
                {primaryCta.href ? (
                  <Button
                    render={<Link href={primaryCta.href} />}
                    size="lg"
                    className="rounded-2xl px-5"
                  >
                    {primaryCta.label}
                    <RiExternalLinkLine className="size-4" />
                  </Button>
                ) : (
                  <Button disabled size="lg" className="rounded-2xl px-5">
                    {primaryCta.label}
                    <RiExternalLinkLine className="size-4" />
                  </Button>
                )}

                <Button
                  render={<Link href={secondaryCta.href} />}
                  variant="outline"
                  size="lg"
                  className="rounded-2xl px-5"
                >
                  {secondaryCta.label}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((item) => {
            const Icon = item.icon;

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
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Icon className="size-5" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{item.note}</p>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.85fr]">
          <div className="grid gap-6">
            <Card className="rounded-[1.8rem] py-0 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <CardHeader className="px-6 py-5">
                <CardDescription>
                  {isPro ? "Resumo da assinatura" : "Resumo do plano"}
                </CardDescription>
                <CardTitle className="mt-1 text-xl">
                  {isPro
                    ? "Seu acesso premium já está ligado ao dashboard."
                    : "Plano Free pronto para uso e upgrade quando fizer sentido."}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 px-6 pb-6">
                <div className={`rounded-2xl border px-4 py-4 ${statusTone}`}>
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-background/70 p-2 text-current">
                      {isPro ? (
                        <RiInformationLine className="size-4" />
                      ) : (
                        <RiCheckLine className="size-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {isPro
                          ? "Assinatura já pode ser gerenciada no portal Stripe"
                          : "Sem cobrança recorrente até você decidir mudar"}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-current/80">
                        {isPro
                          ? "Plano, renovação e status agora podem ser sincronizados por webhook. Cartão, invoices e cancelamento continuam no portal hospedado do Stripe."
                          : "Seu plano atual continua leve e sem cartão. Quando decidir migrar, assinatura começa por botão principal desta página."}
                      </p>
                    </div>
                  </div>
                </div>

                {isPro ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border bg-muted/25 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <RiVipCrownLine className="size-4 text-primary" />
                        Plano Pro ativo no produto
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Recursos premium e camada de IA já podem orientar fluxo do
                        usuário dentro dashboard.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-muted/25 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <RiBankCardLine className="size-4 text-primary" />
                        Gestão financeira fora do app
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Cartão, invoices, cancelamento e reativação ficam no portal
                        Stripe para evitar duplicação de interface.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border bg-muted/20 p-5">
                    <h3 className="text-sm font-semibold text-foreground">
                      Por que migrar para Pro
                    </h3>
                    <div className="mt-4 grid gap-3">
                      {freePlanReasons.map((reason) => (
                        <div
                          key={reason}
                          className="flex items-start gap-3 rounded-2xl border border-border bg-background/80 px-4 py-3"
                        >
                          <span className="mt-0.5 rounded-full bg-primary/10 p-1 text-primary">
                            <RiSparklingLine className="size-3.5" />
                          </span>
                          <p className="text-sm leading-6 text-muted-foreground">
                            {reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-[1.8rem] py-0 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <CardHeader className="px-6 py-5">
                <CardDescription>{isPro ? "Detalhes da assinatura" : "Como a assinatura entra no app"}</CardDescription>
                <CardTitle className="mt-1 text-xl">
                  {isPro
                    ? "Informações reais que já vieram do Stripe"
                    : "Quando você assinar, estes dados passam a aparecer aqui"}
                </CardTitle>
              </CardHeader>

              <CardContent className="grid gap-3 px-6 pb-6">
                {syncedBillingFields.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-border bg-muted/25 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="mt-1 text-sm font-semibold text-foreground">
                          {item.value}
                        </p>
                      </div>
                      <span className="rounded-xl bg-primary/10 p-2 text-primary">
                        <RiShieldCheckLine className="size-4" />
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {item.helper}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6">
            <Card className="overflow-hidden rounded-[1.8rem] border-primary/20 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--color-primary)_16%,transparent),transparent_34%),linear-gradient(180deg,color-mix(in_oklab,var(--color-primary)_10%,transparent),color-mix(in_oklab,var(--color-primary)_4%,transparent))] py-0 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <CardHeader className="px-6 py-6">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                  <RiPriceTag3Line className="size-3.5 text-primary" />
                  Ações Stripe
                </div>
                <CardTitle className="mt-4 text-2xl leading-tight text-foreground">
                  {isPro
                    ? "Gerenciamento financeiro entra por portal hospedado."
                    : "Upgrade começa aqui e termina em checkout hospedado."}
                </CardTitle>
                <CardDescription className="mt-2 text-sm leading-6">
                  {isPro
                    ? "Esta página prepara contexto. Portal Stripe assume invoices, cartão, troca de plano e cancelamento."
                    : "Você escolhe plano mensal ou anual daqui. Stripe recebe compra e cobrança para manter fluxo mais confiável."}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 px-6 pb-6">
                {primaryCta.href ? (
                  <Button
                    render={<Link href={primaryCta.href} />}
                    size="lg"
                    className="w-full rounded-2xl px-5"
                  >
                    {primaryCta.label}
                    <RiExternalLinkLine className="size-4" />
                  </Button>
                ) : (
                  <Button disabled size="lg" className="w-full rounded-2xl px-5">
                    {primaryCta.label}
                    <RiExternalLinkLine className="size-4" />
                  </Button>
                )}

                <Button
                  render={<Link href={secondaryCta.href} />}
                  variant="outline"
                  size="lg"
                  className="w-full rounded-2xl px-5"
                >
                  {secondaryCta.label}
                </Button>

                {!billingReady ? (
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-700 dark:text-amber-300">
                    <div className="flex items-start gap-3">
                      <span className="rounded-xl bg-background/70 p-2">
                        <RiAlertLine className="size-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">
                          Falta finalizar camada completa de billing
                        </p>
                        <p className="mt-1 text-sm leading-6 text-current/80">
                          Checkout e portal já podem existir, mas esta caixa só some
                          quando todas variáveis Stripe estiverem configuradas.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

          </div>
        </section>
      </div>
    </>
  );
}
