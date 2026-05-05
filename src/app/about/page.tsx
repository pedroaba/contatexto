import Link from "next/link";
import {
  BadgeCheck,
  Code2,
  FileText,
  Lock,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import { AdSlot } from "@/components/marketing/ad-slot";
import { Footer } from "@/components/marketing/footer";
import { ProductBar } from "@/components/marketing/product-bar";
import { StructuredData } from "@/components/structured-data";
import { buildMetadata, buildWebPageSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  path: "/about",
  title: "Sobre",
  description:
    "Conheca o TextoTools, plataforma para contar caracteres, revisar textos e otimizar conteudos com foco em privacidade, clareza e SEO.",
  keywords: [
    "sobre textotools",
    "contador de caracteres online",
    "ferramentas de texto",
    "seo",
    "revisao de texto",
  ],
});

const values = [
  {
    icon: ShieldCheck,
    title: "Privacidade em primeiro lugar",
    description:
      "Criamos ferramentas que priorizam o processamento local no navegador sempre que possível, reduzindo a coleta desnecessária de dados.",
  },
  {
    icon: Rocket,
    title: "Ferramentas rápidas e simples",
    description:
      "O objetivo é entregar uma experiência direta, leve e eficiente para quem precisa revisar, contar e melhorar textos no dia a dia.",
  },
  {
    icon: Target,
    title: "Foco em utilidade real",
    description:
      "Cada recurso do TextoTools é pensado para resolver problemas práticos de escrita, SEO, revisão, produtividade e criação de conteúdo.",
  },
];

const features = [
  "Contador de caracteres online",
  "Contador de palavras, frases e parágrafos",
  "Tempo estimado de leitura",
  "Comparação com limites de SEO e redes sociais",
  "Análise de texto com foco em clareza e qualidade",
  "Recursos premium para otimização com IA",
];

export default function AboutPage() {
  return (
    <>
      <StructuredData
        data={buildWebPageSchema({
          path: "/about",
          title: "Sobre o TextoTools",
          description:
            "Conheca o TextoTools, plataforma para contar caracteres, revisar textos e otimizar conteudos com foco em privacidade, clareza e SEO.",
        })}
      />
      <ProductBar />

      <main>
        <section className="bg-gradient-mesh relative overflow-hidden border-b border-border">
          <div className="grid-pattern absolute inset-0 opacity-35" />

          <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                  <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                  Sobre o TextoTools
                </span>

                <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-[1.03] tracking-tight md:text-6xl">
                  Ferramentas de texto criadas para quem escreve,
                  <span className="font-display italic text-primary"> revisa </span>
                  e publica melhor.
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  O TextoTools nasceu para ajudar pessoas e profissionais a contar
                  caracteres, revisar textos, otimizar conteúdos para SEO e ganhar
                  mais clareza na escrita. A proposta é simples: criar ferramentas
                  rápidas, privadas e fáceis de usar para transformar textos em
                  conteúdos mais objetivos, organizados e eficientes.
                </p>
              </div>

              <div className="lg:col-span-5">
                <div className="shadow-elegant relative overflow-hidden rounded-[1.8rem] border border-border bg-card p-7">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-primary to-sky-300" />

                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>

                  <h2 className="mt-6 text-2xl font-bold tracking-tight">O que fazemos</h2>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Desenvolvemos uma suíte de ferramentas de texto para apoiar
                    escritores, estudantes, redatores, designers, profissionais de
                    marketing, criadores de conteúdo e equipes que precisam escrever
                    com mais precisão.
                  </p>

                  <div className="mt-6 grid gap-3">
                    <div className="rounded-2xl border border-border bg-background/80 p-4">
                      <div className="text-sm font-semibold">Texto mais claro</div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Métricas, leitura e análise para melhorar a estrutura do conteúdo.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-background/80 p-4">
                      <div className="text-sm font-semibold">SEO mais previsível</div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Ajuda para manter títulos, descrições e textos dentro de limites recomendados.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-background/80 p-4">
                      <div className="text-sm font-semibold">Fluxo mais produtivo</div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Ferramentas rápidas para revisar, ajustar e salvar análises com menos fricção.
                      </p>
                    </div>
                  </div>
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
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Quem está por trás
                </span>

                <h2 className="mt-3 text-4xl font-bold tracking-tight">
                  Criado por um desenvolvedor que também entende o valor de uma boa experiência digital.
                </h2>
              </div>

              <div className="lg:col-span-7">
                <div className="space-y-5 text-base leading-8 text-muted-foreground">
                  <p>
                    O TextoTools é desenvolvido por Pedro Augusto, desenvolvedor de
                    software com experiência em aplicações web modernas, interfaces
                    digitais, produtos SaaS e soluções voltadas para produtividade.
                  </p>

                  <p>
                    A ideia surgiu da necessidade de ter uma ferramenta de texto
                    simples, bonita e funcional para tarefas comuns do dia a dia:
                    contar caracteres, validar limites de SEO, revisar descrições,
                    melhorar títulos, organizar rascunhos e analisar conteúdos antes
                    da publicação.
                  </p>

                  <p>
                    Em vez de criar apenas mais um contador de caracteres online, o
                    objetivo do TextoTools é construir uma plataforma mais completa:
                    uma suíte de ferramentas para escrita, revisão, análise de texto,
                    SEO e produtividade, com foco em privacidade, velocidade e usabilidade.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Nossa visão
              </span>

              <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
                Tornar a análise de texto mais acessível, rápida e útil.
              </h2>

              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                Queremos que qualquer pessoa consiga entender melhor seus textos,
                melhorar a comunicação e publicar conteúdos com mais confiança, sem
                depender de ferramentas complexas ou fluxos pesados.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {values.map((value) => {
                const Icon = value.icon;

                return (
                  <article key={value.title} className="rounded-3xl border border-border bg-card p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold tracking-tight">
                      {value.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {value.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <AdSlot size="leaderboard" />
        </div>

        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-5">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Ferramentas
                </span>

                <h2 className="mt-3 text-4xl font-bold tracking-tight">
                  Uma plataforma para escrever, revisar e otimizar textos.
                </h2>

                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  O TextoTools combina métricas objetivas com recursos de análise
                  para ajudar você a tomar melhores decisões antes de publicar um conteúdo.
                </p>
              </div>

              <div className="lg:col-span-7">
                <div className="grid gap-3 sm:grid-cols-2">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-sm">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Sparkles className="h-3.5 w-3.5" />
                      </span>

                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <AdSlot size="inline" className="mx-auto max-w-3xl" />
        </div>

        <section className="bg-background">
          <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
            <div className="bg-gradient-mesh rounded-[2rem] border border-border p-8 md:p-10">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-8">
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                    <Lock className="h-3.5 w-3.5 text-primary" />
                    TextoTools
                  </span>

                  <h2 className="mt-5 text-4xl font-bold tracking-tight">
                    Nossa missão é simplificar a forma como você trabalha com texto.
                  </h2>

                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                    Seja para SEO, redes sociais, anúncios, estudos, landing pages
                    ou textos profissionais, o TextoTools existe para ajudar você a
                    escrever com mais clareza, revisar com mais rapidez e publicar
                    com mais segurança.
                  </p>
                </div>

                <div className="lg:col-span-4">
                  <Link
                    href="/#tool"
                    className="shadow-glow inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:translate-y-[-1px] sm:w-auto lg:w-full"
                  >
                    Testar ferramenta grátis
                    <Code2 className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
