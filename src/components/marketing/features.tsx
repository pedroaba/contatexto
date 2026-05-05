import Link from "next/link";
import {
  ArrowRight,
  Gauge,
  LayoutGrid,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Gauge,
    title: "Contagem em tempo real",
    body: "Caracteres, palavras, frases, linhas e tempo de leitura atualizados enquanto voce escreve.",
  },
  {
    icon: LayoutGrid,
    title: "Metricas que ajudam a revisar",
    body: "Veja diversidade de palavras, media por frase e outros sinais uteis para lapidar o texto.",
  },
  {
    icon: ScanSearch,
    title: "Limites por plataforma",
    body: "Compare seu texto com meta title, meta description, X, Instagram e LinkedIn sem fazer conta manual.",
  },
  {
    icon: ShieldCheck,
    title: "Privacidade no navegador",
    body: "A analise principal roda localmente, ideal para rascunhos, copys e textos profissionais.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="border-t border-border bg-gradient-to-b from-background via-sky-50/40 to-background dark:via-sky-950/10"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Recursos
            </span>
            <h2 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
              Tudo o que voce precisa para ajustar textos com mais rapidez.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              O TextoTools combina contagem precisa, contexto de plataforma e sinais
              de qualidade em uma interface simples. A ideia e reduzir revisao
              manual e deixar o texto pronto mais cedo.
            </p>
          </div>

          <div className="lg:col-span-5 lg:justify-self-end">
            <Link
              href="/#tool"
              className="group inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold transition-all hover:border-primary/30 hover:bg-accent hover:shadow-soft"
            >
              Testar na ferramenta
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
