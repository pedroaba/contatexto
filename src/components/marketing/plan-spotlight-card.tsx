import type { LucideIcon } from "lucide-react";

interface SpotlightItem {
  label: string;
  price: string;
  cadence?: string;
  summary: string;
  bullets?: readonly string[];
  highlighted?: boolean;
  badgeLabel?: string;
}

interface PlanSpotlightCardProps {
  badgeLabel: string;
  title: string;
  description?: string;
  items: SpotlightItem[];
  detailTitle: string;
  detailBody: string;
  badgeIcon?: LucideIcon;
  detailIcon?: LucideIcon;
}

export function PlanSpotlightCard({
  badgeLabel,
  title,
  description,
  items,
  detailTitle,
  detailBody,
  badgeIcon: BadgeIcon,
  detailIcon: DetailIcon,
}: PlanSpotlightCardProps) {
  return (
    <div className="shadow-elegant relative overflow-hidden rounded-[1.8rem] border border-border bg-card">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-primary to-sky-300" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_30%)]" />

      <div className="relative p-7">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {BadgeIcon ? <BadgeIcon className="h-3.5 w-3.5" /> : null}
          {badgeLabel}
        </div>

        <div className="mt-5 max-w-2xl">
          <h2 className="text-xl font-semibold tracking-tight md:text-[1.7rem]">
            {title}
          </h2>

          {description ? (
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.label}
              className={[
                "rounded-[1.6rem] border p-6 transition-all",
                item.highlighted
                  ? "border-primary/20 bg-primary/[0.08] shadow-[inset_0_1px_0_rgba(125,211,252,0.12)]"
                  : "border-border bg-background/80",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={[
                    "text-xs font-semibold uppercase tracking-[0.26em]",
                    item.highlighted ? "text-primary" : "text-muted-foreground",
                  ].join(" ")}
                >
                  {item.label}
                </div>

                {item.badgeLabel ? (
                  <span className="rounded-full border border-primary/15 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                    {item.badgeLabel}
                  </span>
                ) : null}
              </div>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-bold tracking-tight">{item.price}</span>
                {item.cadence ? (
                  <span className="pb-1 text-sm text-muted-foreground">{item.cadence}</span>
                ) : null}
              </div>

              <p className="mt-4 text-base font-medium leading-relaxed text-foreground/90">
                {item.summary}
              </p>

              {item.bullets?.length ? (
                <ul className="mt-5 space-y-2">
                  {item.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span
                        className={[
                          "mt-1 h-1.5 w-1.5 shrink-0 rounded-full",
                          item.highlighted ? "bg-primary" : "bg-foreground/45",
                        ].join(" ")}
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>

        <div className="mt-5 rounded-[1.6rem] border border-border bg-muted/25 p-5 md:p-6">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-card text-primary">
              {DetailIcon ? <DetailIcon className="h-4.5 w-4.5" /> : null}
            </div>

            <div>
              <div className="text-base font-semibold tracking-tight">{detailTitle}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                {detailBody}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
