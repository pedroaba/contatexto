import type { MetadataRoute } from "next";

import { seoSite } from "@/lib/seo";

const routes = [
  "/",
  "/docs",
  "/pricing",
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
        : route === "/docs" || route === "/pricing"
          ? "weekly"
          : "monthly",
    priority:
      route === "/"
        ? 1
        : route === "/docs"
          ? 0.9
          : route === "/pricing"
            ? 0.8
            : 0.6,
  }));
}
