import { ChevronDown } from "lucide-react";

import { homeFaqItems } from "@/lib/home-faq";

export function FaqSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-3xl px-4 py-20 md:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            FAQ
          </span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            Perguntas frequentes sobre contador de caracteres
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {homeFaqItems.map((faq, index) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-border bg-card px-5 transition-colors hover:border-primary/30"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4">
                <span className="text-sm font-semibold">{faq.question}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>

              <p className="pb-5 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
