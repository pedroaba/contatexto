import type { MetadataRoute } from "next";

import { seoSite } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: ["Googlebot", "Bingbot", "PerplexityBot", "OAI-SearchBot", "GPTBot"],
        allow: "/",
      },
    ],
    sitemap: `${seoSite.url}/sitemap.xml`,
  };
}
