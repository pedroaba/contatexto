import type { MetadataRoute } from "next";

import { seoSite } from "@/lib/seo";

const routes = [
  "/",
  "/docs",
  "/contador-de-caracteres",
  "/contador-de-palavras",
  "/meta-title-meta-description",
  "/tempo-de-leitura",
  "/legendas-redes-sociais",
  "/revisao-de-textos",
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
        : route === "/docs" || route.includes("-")
          ? "weekly"
          : "monthly",
    priority:
      route === "/"
        ? 1
        : route === "/docs"
          ? 0.9
          : route.includes("-")
            ? 0.8
          : 0.6,
  }));
}
