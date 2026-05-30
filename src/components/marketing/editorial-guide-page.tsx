import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Footer } from "@/components/marketing/footer";
import { ProductBar } from "@/components/marketing/product-bar";
import { StructuredData } from "@/components/structured-data";
import {
  editorialGuides,
  getEditorialGuide,
  type GuideSlug,
} from "@/lib/editorial-guides";
import { buildWebPageSchema } from "@/lib/seo";

interface EditorialGuidePageProps {
  slug: GuideSlug;
}

export function EditorialGuidePage({ slug }: EditorialGuidePageProps) {
  const guide = getEditorialGuide(slug);

  return (
    <>
      <StructuredData
        data={buildWebPageSchema({
          path: guide.path,
          title: guide.title,
          description: guide.description,
        })}
      />
      <ProductBar />

      <main>
        <section className="border-b border-border bg-gradient-mesh">
          <div className="mx-auto max-w-5xl px-4 py-14 md:px-8 md:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {guide.eyebrow}
              </span>
              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                {guide.title}
              </h1>
              <p className="mt-5 text-base leading-8 text-muted-foreground md:text-lg">
                {guide.intro}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/#tool"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Abrir ferramenta
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold transition hover:bg-accent"
                >
                  Ver documentação
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl gap-6 px-4 py-12 md:px-8 lg:grid-cols-[1fr_18rem]">
          <article className="space-y-6">
            {guide.sections.map((section) => (
              <section
                key={section.title}
                className="rounded-2xl border border-border bg-background p-6"
              >
                <h2 className="text-2xl font-semibold tracking-tight">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground md:text-base">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-2xl font-semibold tracking-tight">
                Exemplos práticos
              </h2>
              <div className="mt-5 grid gap-4">
                {guide.examples.map((example) => (
                  <div
                    key={example.label}
                    className="rounded-xl border border-border bg-background p-4"
                  >
                    <h3 className="text-sm font-semibold">{example.label}</h3>
                    {example.bad ? (
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        <span className="font-semibold text-destructive">Evite: </span>
                        {example.bad}
                      </p>
                    ) : null}
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      <span className="font-semibold text-success">Prefira: </span>
                      {example.good}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {example.note}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold">Checklist rápido</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                {guide.checklist.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-background p-5">
              <h2 className="text-sm font-semibold">Guias relacionados</h2>
              <div className="mt-4 space-y-3">
                {guide.related.map((relatedSlug) => {
                  const related = editorialGuides[relatedSlug];

                  return (
                    <Link
                      key={related.slug}
                      href={related.path}
                      className="block rounded-lg border border-border bg-card p-3 text-sm transition hover:border-primary/40 hover:text-primary"
                    >
                      {related.title}
                    </Link>
                  );
                })}
              </div>
            </section>
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}
