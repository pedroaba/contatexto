import type { MetadataRoute } from "next";

import { seoSite } from "@/lib/seo";

const routes = [
  "/",
  "/docs",
  "/about",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${seoSite.url}${route === "/" ? "/" : route}`,
    changeFrequency:
      route === "/"
        ? "daily"
        : route === "/docs"
          ? "weekly"
          : "monthly",
    priority:
      route === "/"
        ? 1
        : route === "/docs"
          ? 0.9
          : 0.6,
  }));
}
