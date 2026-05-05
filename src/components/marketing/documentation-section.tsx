import Link from "next/link";
import { ArrowRight } from "lucide-react";

const docHighlights = [
  {
    href: "/docs#getting-started",
    eyebrow: "01",
    title: "Como usar",
    body: "Veja o fluxo ideal para colar seu texto, revisar metricas e ajustar clareza antes de publicar.",
  },
  {
    href: "/docs#use-cases",
    eyebrow: "02",
    title: "Para que serve",
    body: "Entenda como aplicar o TextoTools em SEO, social media, copy, blogs, landing pages e videos.",
  },
  {
    href: "/docs#seo-guide",
    eyebrow: "03",
    title: "Guia de SEO",
    body: "Acesse boas praticas para titulos, descricoes, palavras-chave, bios e textos para redes sociais.",
  },
  {
    href: "/docs#faq",
    eyebrow: "04",
    title: "Perguntas frequentes",
    body: "Encontre respostas rapidas sobre processamento local, uso sem conta e boas praticas de escrita.",
  },
];

export function DocumentationSection() {
  return (
    <section className="border-t border-border bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Documentacao
            </span>
            <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Um guia rapido na home, a documentacao completa quando voce quiser ir fundo.
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Esta secao funciona como atalho para os pontos mais uteis da
              documentacao: primeiros passos, casos de uso, SEO e duvidas comuns.
            </p>
          </div>

          <Link
            href="/docs"
            className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold transition hover:border-primary/40 hover:text-primary"
          >
            Ver documentacao completa
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {docHighlights.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
            >
              <div className="font-mono text-xs text-muted-foreground">
                {section.eyebrow}
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                {section.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {section.body}
              </p>
              <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                Ler mais
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
