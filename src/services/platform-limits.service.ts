import type { PlatformLimit, PlatformLimitStatus } from "./counter.types.ts";

const PLATFORM_LIMITS = [
  { id: "meta-title", name: "Meta title", max: 60, target: "SEO" },
  { id: "meta-description", name: "Meta description", max: 160, target: "SEO" },
  { id: "post-x", name: "Post no X", max: 280, target: "Social" },
  {
    id: "instagram-caption",
    name: "Legenda Instagram",
    max: 2200,
    target: "Social",
  },
  { id: "linkedin-post", name: "Post LinkedIn", max: 3000, target: "Social" },
] as const;

export class PlatformLimitsService {
  build(characters: number): PlatformLimit[] {
    return PLATFORM_LIMITS.map((limit) => ({
      ...limit,
      current: characters,
      percent: Math.min(100, Number(((characters / limit.max) * 100).toFixed(2))),
      status: this.getStatus(characters, limit.max),
    }));
  }

  private getStatus(current: number, max: number): PlatformLimitStatus {
    if (current > max) {
      return "danger";
    }

    if (current / max >= 0.9) {
      return "warning";
    }

    return "good";
  }
}
