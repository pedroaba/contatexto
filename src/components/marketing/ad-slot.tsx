import { cn } from "@/lib/utils";

interface AdSlotProps {
  className?: string;
  label?: string;
  size?: "inline" | "leaderboard" | "rectangle" | "sidebar";
}

const sizes = {
  leaderboard: "h-24 md:h-28",
  rectangle: "h-64",
  inline: "h-32",
  sidebar: "h-96",
} as const;

export function AdSlot({
  className,
  label = "Publicidade",
  size = "leaderboard",
}: AdSlotProps) {
  return (
    <div
      className={cn(
        "dot-pattern relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/40",
        sizes[size],
        className,
      )}
    >
      <span className="absolute left-3 top-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
        {label}
      </span>
      <span className="text-xs text-muted-foreground/60">
        Espaco reservado para anuncio
      </span>
    </div>
  );
}
