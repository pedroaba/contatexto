"use client";

import { useEffect } from "react";

import { cn } from "@/lib/utils";

interface AdSlotProps {
  className?: string;
  label?: string;
  slot?: string;
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
  slot,
  size = "leaderboard",
}: AdSlotProps) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const shouldRenderAd = Boolean(adsenseClient && slot);

  useEffect(() => {
    if (!shouldRenderAd) return;
    try {
      ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle ??= []).push(
        {},
      );
    } catch {
      // noop
    }
  }, [shouldRenderAd, slot]);

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
      {shouldRenderAd ? (
        <ins
          className="adsbygoogle block h-full w-full"
          data-ad-client={adsenseClient}
          data-ad-format="auto"
          data-ad-slot={slot}
          data-full-width-responsive="true"
        />
      ) : (
        <span className="text-xs text-muted-foreground/60">
          Defina NEXT_PUBLIC_ADSENSE_CLIENT_ID e slot para exibir anuncio
        </span>
      )}
    </div>
  );
}
