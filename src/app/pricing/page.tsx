import Link from "next/link";
import {
  BadgeCheck,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileText,
  Gem,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import { AdSlot } from "@/components/marketing/ad-slot";
import { Footer } from "@/components/marketing/footer";
import { PlanSpotlightCard } from "@/components/marketing/plan-spotlight-card";
import { ProductBar } from "@/components/marketing/product-bar";
import { StructuredData } from "@/components/structured-data";
import { buildFaqSchema, buildMetadata, buildWebPageSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  path: "/pricing",
  title: "Precos",
  description:
    "Compare os planos do TextoTools para contador de caracteres, analise de texto, revisao com IA e otimizacao de conteudo para SEO.",
  keywords: [
    "precos textotools",
    "contador de caracteres",
    "analise de texto",
    "seo",
    "copywriting",
  ],
});

const spotlightPlans = [
  {
    label: "Free",
    price: "R$ 0",
    cadence: "/mês",
    summary: "Essencial para tarefas rápidas e uso recorrente leve.",
    bullets: ["Contagem e revisão básica", "Até 50 análises salvas"],
  },
  {
    label: "Pro",
    price: "R$ 20",
    cadence: "/mês",
    summary:
      "Mais profundidade para quem publica, revisa e otimiza com frequência.",
    bullets: ["Análises ilimitadas", "IA, SEO e refinamento avançado"],
    badgeLabel: "Recomendado",
    highlighted: true,
  },
] as const;

const plans = [
  {
    name: "Free",
    eyebrow: "Para uso diário",
    price: "R$ 0",
    cadence: "/mês",
    description:
      "Ideal para contar caracteres, revisar textos rapidamente e salvar até 50 análises na sua conta.",
    ctaLabel: "Usar grátis",
    ctaHref: "/#tool",
    secondaryLabel: "Sem cartão de crédito",
    features: [
      "Contagem de caracteres, palavras, frases e parágrafos",
      "Tempo estimado de leitura e sinais básicos de qualidade",
      "Comparação com limites de SEO e redes sociais",
      "Até 50 análises salvas na conta",
      "Privacidade local no navegador",
    ],
  },
  {
    name: "Pro",
    eyebrow: "Para criadores e equipes",
    price: "R$ 20",
    cadence: "/mês",
    description:
      "Para quem quer análises ilimitadas, sugestões com IA e mais profundidade para melhorar textos profissionais.",
    ctaLabel: "Assinar mensal",
    ctaHref: "/api/stripe/checkout?interval=monthly",
    secondaryLabel: "Assinar anual por R$ 200",
    secondaryHref: "/api/stripe/checkout?interval=yearly",
    highlighted: true,
    features: [
      "Tudo do plano Free",
      "Análises salvas ilimitadas",
      "Análise avançada de clareza, tom e estrutura",
      "Sugestões mais profundas para SEO e copywriting",
      "Fluxo otimizado para volumes maiores de conteúdo",
      "Plano anual por R$ 200 (equivale a R$ 16,67/mês)",
      "Novos recursos premium conforme a evolução do produto",
    ],
  },
];

const comparisonRows = [
  { label: "Contagem de caracteres em tempo real", free: true, pro: true },
  { label: "Contador de palavras, frases e parágrafos", free: true, pro: true },
  { label: "Limites para SEO e redes sociais", free: true, pro: true },
  { label: "Indicadores básicos de qualidade", free: true, pro: true },
  { label: "Análises salvas na conta", free: "Até 50", pro: "Ilimitadas" },
  { label: "Análise avançada com IA", free: false, pro: true },
  { label: "Sugestões aprofundadas de melhoria", free: false, pro: true },
  { label: "Fluxo para uso profissional intensivo", free: false, pro: true },
];

const pricingFaqs = [
  {
    question: "Posso usar o TextoTools grátis sem cartão?",
    answer:
      "Sim. O plano Free permite usar as principais ferramentas de texto sem cartão de crédito, incluindo contador de caracteres, contador de palavras, tempo de leitura e comparação com limites de SEO.",
  },
  {
    question: "Quantas análises posso salvar no plano Free?",
    answer:
      "No plano Free, você pode salvar até 50 análises na sua conta. Esse limite é ideal para uso pessoal, testes rápidos, rascunhos e revisões ocasionais.",
  },
  {
    question: "O plano Pro permite salvar análises ilimitadas?",
    answer:
      "Sim. No plano Pro, você pode salvar análises ilimitadas, além de acessar recursos avançados para revisar textos com mais profundidade, melhorar clareza, ajustar tom e otimizar conteúdos para SEO.",
  },
  {
    question: "O que muda no Pro na prática?",
    answer:
      "O Pro aprofunda a leitura do texto com análise avançada, sugestões com IA, mais contexto e refinamentos voltados para quem escreve com objetivo de performance, conversão e qualidade profissional.",
  },
  {
    question: "Existe desconto no plano anual?",
    answer:
      "Sim. O Pro pode ser contratado por R$ 20/mês no plano mensal ou por R$ 200/ano no plano anual, equivalente a R$ 16,67 por mês e com 2 meses grátis em relação ao valor mensal acumulado.",
  },
  {
    question: "Meus textos continuam privados?",
    answer:
      "Sim. A proposta do produto continua priorizando privacidade, processamento local sempre que possível e uma experiência leve para trabalhar com rascunhos, conteúdos profissionais e materiais sensíveis.",
  },
];

export default async function PricingPage() {
  return (
    <>
      <StructuredData
        data={[
          buildWebPageSchema({
            path: "/pricing",
            title: "Precos do TextoTools",
            description:
              "Compare os planos do TextoTools para contador de caracteres e analise de texto.",
          }),
          buildFaqSchema(pricingFaqs),
        ]}
      />

      <ProductBar />

      <section className="bg-gradient-mesh relative overflow-hidden border-b border-border">
        <div className="grid-pattern absolute inset-0 opacity-35" />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 md:px-8 md:pb-24 md:pt-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 xl:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs backdrop-blur-sm">
                <Gem className="h-3.5 w-3.5 text-primary" />
                Planos do TextoTools
              </span>

              <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl">
                Planos para contar caracteres,{" "}
                <span className="font-display italic text-primary">
                  salvar análises
                </span>{" "}
                e melhorar seus textos.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Comece grátis com contador de caracteres, contador de palavras e
                até 50 análises salvas. Quando precisar de análises ilimitadas,
                sugestões com IA e mais profundidade para SEO e copywriting,
                evolua para o Pro por R$ 20/mês ou R$ 200/ano.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#plans"
                  className="shadow-glow inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:translate-y-[-1px]"
                >
                  Ver planos
                  <ChevronRight className="h-4 w-4" />
                </a>

                <Link
                  href="/#tool"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-accent"
                >
                  Testar ferramenta grátis
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" />
                  Privacidade em primeiro lugar
                </div>
                <div className="flex items-center gap-2">
                  <Clock3 className="h-3.5 w-3.5 text-primary" />
                  Resultado imediato
                </div>
                <div className="flex items-center gap-2">
                  <WandSparkles className="h-3.5 w-3.5 text-primary" />
                  Análises ilimitadas no Pro
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 xl:col-span-5">
              <div className="w-full lg:ml-auto lg:max-w-[36rem]">
                <PlanSpotlightCard
                  badgeLabel="Melhor para uso profissional"
                  title="Free para começar. Pro para ganhar profundidade e escala."
                  description="Compare os dois planos num relance."
                  items={[...spotlightPlans]}
                  detailTitle="Para quem vale o Pro"
                  detailBody="Criadores, redatores, designers, equipes de marketing e profissionais que precisam revisar títulos, descrições, landing pages, posts e textos com frequência."
                  badgeIcon={BadgeCheck}
                  detailIcon={FileText}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <AdSlot size="leaderboard" />
      </div>

      <section id="plans" className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Planos
            </span>
            <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Escolha entre o plano Free e o Pro.
            </h2>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              O Free cobre o essencial e permite salvar até 50 análises. O Pro
              remove esse limite e adiciona recursos avançados para quem escreve
              com mais volume, frequência e exigência, com opção mensal de
              R$ 20 ou anual de R$ 200.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`relative flex h-full flex-col overflow-hidden rounded-[1.8rem] border p-7 md:p-8 ${
                  plan.highlighted
                    ? "shadow-elegant border-primary/20 bg-card"
                    : "border-border bg-card"
                }`}
              >
                {plan.highlighted ? (
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-primary to-sky-300" />
                ) : null}

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div
                      className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                        plan.highlighted
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {plan.eyebrow}
                    </div>
                    <h3 className="mt-3 text-3xl font-bold tracking-tight">
                      {plan.name}
                    </h3>
                  </div>
                  {plan.highlighted ? (
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      Recomendado
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 flex items-end gap-2">
                  <span className="text-5xl font-bold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="pb-1 text-muted-foreground">
                    {plan.cadence}
                  </span>
                </div>

                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {plan.description}
                </p>

                <a
                  href={plan.ctaHref}
                  className={`mt-7 inline-flex w-fit items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                    plan.highlighted
                      ? "shadow-glow bg-primary text-primary-foreground hover:translate-y-[-1px]"
                      : "border border-border bg-background hover:bg-accent"
                  }`}
                >
                  {plan.ctaLabel}
                  <ChevronRight className="h-4 w-4" />
                </a>

                {plan.secondaryHref ? (
                  <a
                    href={plan.secondaryHref}
                    className="mt-3 inline-flex w-fit text-xs font-medium text-primary transition hover:text-primary/80"
                  >
                    {plan.secondaryLabel}
                  </a>
                ) : (
                  <div className="mt-3 text-xs text-muted-foreground">
                    {plan.secondaryLabel}
                  </div>
                )}

                <ul className="mt-8 flex-1 space-y-3 border-t border-border pt-6">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          plan.highlighted
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="leading-relaxed text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <AdSlot size="inline" className="mx-auto max-w-3xl" />
      </div>

      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Comparativo
              </span>
              <h2 className="mt-3 text-4xl font-bold tracking-tight">
                Compare os recursos de cada plano.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                O plano Free destrava o uso essencial, com limite de 50 análises
                salvas. O plano Pro oferece análises ilimitadas e recursos
                avançados para quem trabalha com conteúdo de forma recorrente.
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="overflow-hidden rounded-[1.6rem] border border-border bg-card">
                <div className="grid grid-cols-[1.5fr_0.75fr_0.75fr] border-b border-border bg-muted/35 px-5 py-4 text-sm font-semibold">
                  <div>Recurso</div>
                  <div className="text-center">Free</div>
                  <div className="text-center">Pro</div>
                </div>

                {comparisonRows.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[1.5fr_0.75fr_0.75fr] items-center border-b border-border px-5 py-4 text-sm last:border-b-0"
                  >
                    <div className="pr-4 text-muted-foreground">
                      {row.label}
                    </div>

                    <div className="flex justify-center text-center">
                      {typeof row.free === "string" ? (
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                          {row.free}
                        </span>
                      ) : row.free ? (
                        <span className="rounded-full bg-success/10 p-1 text-success">
                          <Check className="h-4 w-4" />
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50">-</span>
                      )}
                    </div>

                    <div className="flex justify-center text-center">
                      {typeof row.pro === "string" ? (
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                          {row.pro}
                        </span>
                      ) : row.pro ? (
                        <span className="rounded-full bg-primary/10 p-1 text-primary">
                          <Check className="h-4 w-4" />
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50">-</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <AdSlot size="leaderboard" />
      </div>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-stretch">
            <div className="rounded-[1.8rem] border border-border bg-card p-8">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Perguntas comuns
              </span>
              <h2 className="mt-3 text-4xl font-bold tracking-tight">
                Dúvidas sobre os planos do TextoTools.
              </h2>

              <div className="mt-8 space-y-4">
                {pricingFaqs.map((faq) => (
                  <article
                    key={faq.question}
                    className="rounded-2xl border border-border bg-background/70 p-5"
                  >
                    <div className="flex items-start gap-3">
                      <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div>
                        <h3 className="text-sm font-semibold">
                          {faq.question}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="bg-gradient-mesh flex flex-col justify-between rounded-[1.8rem] border border-border p-8">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Pronto para testar
                </span>
                <h2 className="mt-6 text-4xl font-bold tracking-tight">
                  Comece grátis e evolua para o Pro quando precisar de mais.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  Use o TextoTools gratuitamente para contar caracteres, revisar
                  textos e salvar até 50 análises. Quando o volume crescer, o
                  Pro libera análises ilimitadas e recursos mais avançados para
                  escrita, SEO e copywriting.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/#tool"
                  className="shadow-glow inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:translate-y-[-1px]"
                >
                  Usar grátis agora
                  <ChevronRight className="h-4 w-4" />
                </Link>

                <a
                  href="#plans"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-accent"
                >
                  Revisar planos
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
