import Link from "next/link";
import { ArrowRight, Lock, ShieldCheck, Zap } from "lucide-react";

import { DocumentationSection } from "@/components/marketing/documentation-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { Features } from "@/components/marketing/features";
import { ProductBar } from "@/components/marketing/product-bar";
import { HeroPreview } from "@/components/marketing/hero-preview";
import { TextToolSection } from "@/components/marketing/text-tool-section";
import { Footer } from "@/components/marketing/footer";
import { StructuredData } from "@/components/structured-data";
import {
  buildMetadata,
  buildFaqSchema,
  buildWebPageSchema,
  seoSite,
} from "@/lib/seo";
import { homeFaqItems } from "@/lib/home-faq";

export const metadata = buildMetadata({
  path: "/",
  title: seoSite.name,
  description:
    "Contador de caracteres online para contar palavras, frases, parágrafos e tempo de leitura. Revise meta title, meta description e textos com foco em SEO, clareza e produtividade.",
  keywords: [
    "contador de caracteres",
    "contador de palavras",
    "meta title",
    "meta description",
    "seo",
    "análise de texto",
  ],
});

export default function HomePage() {
  return (
    <>
      <StructuredData
        data={[
          buildWebPageSchema({
            path: "/",
            title: "Contador de caracteres online",
            description:
              "Conte caracteres, palavras e otimize conteúdos para SEO com o ContaTexto.",
          }),
          buildFaqSchema(homeFaqItems),
        ]}
      />
      <ProductBar />

      <section className="bg-gradient-mesh relative overflow-hidden border-b border-border">
        <div className="grid-pattern absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 md:px-8 md:pb-28 md:pt-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs backdrop-blur-sm">
                <ShieldCheck className="h-3 w-3 text-primary" />
                <span>Contador de caracteres online</span>
                <span className="text-border">·</span>
                <span className="text-muted-foreground">
                  rápido, gratuito e privado
                </span>
              </span>

              <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
                Contador de caracteres
                <br />
                <span className="bg-linear-to-r from-sky-600 to-sky-400 bg-clip-text text-transparent dark:from-sky-300 dark:to-sky-500">
                  com análise de texto.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
                Conte caracteres, palavras, frases, parágrafos e tempo de
                leitura em tempo real. Ideal para SEO, meta title, meta
                description, redes sociais, anúncios e conteúdos digitais.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/#tool"
                  className="shadow-glow group inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:translate-y-[-1px]"
                >
                  Usar contador grátis
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-accent"
                >
                  Ver guia rápido
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-primary" /> Resultado
                  imediato
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-primary" /> Privado no
                  navegador
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <HeroPreview />
            </div>
          </div>
        </div>
      </section>

      <TextToolSection />
      <Features />
      <DocumentationSection />
      <FaqSection />

      <Footer />
    </>
  );
}
