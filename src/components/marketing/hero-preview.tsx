import {
  Activity,
  AlignLeft,
  Clock,
  Hash,
  Layers,
  Type,
} from "lucide-react";

const metrics = [
  { icon: Type, label: "Caracteres", value: "263" },
  { icon: Hash, label: "Sem espacos", value: "224" },
  { icon: AlignLeft, label: "Palavras", value: "42" },
  { icon: Layers, label: "Unicas", value: "37" },
  { icon: Activity, label: "Frases", value: "5" },
  { icon: Clock, label: "Leitura", value: "13s" },
];

export function HeroPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-sky-200/40 to-transparent blur-2xl dark:from-sky-700/30" />
      <div className="shadow-elegant relative overflow-hidden rounded-[1.75rem] border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          </div>
          <span className="font-mono text-xs text-muted-foreground">contatexto.com</span>
          <span />
        </div>

        <div className="grid grid-cols-3 gap-px bg-border">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="bg-card p-5 md:p-6">
                <Icon className="h-4 w-4 text-primary md:h-[1.125rem] md:w-[1.125rem]" />
                <div className="mt-4 text-[2rem] font-bold leading-none tracking-tight md:text-[2.35rem]">
                  {metric.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {metric.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-border p-5 md:p-6">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-medium">Meta title para SEO</span>
            <span className="font-mono text-lg text-warning">58 / 60</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[97%] rounded-full bg-warning" />
          </div>
        </div>
      </div>
    </div>
  );
}
