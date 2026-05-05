import type { Metadata } from "next";

const SITE_URL = "https://contatexto.com";
const SITE_NAME = "ContaTexto";
const DEFAULT_LOCALE = "pt_BR";
const DEFAULT_LANGUAGE = "pt-BR";
const DEFAULT_ROBOTS_EXTRAS =
  "max-snippet:-1, max-image-preview:large, max-video-preview:-1";

export type SeoPath = `/${string}` | "/";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SeoInput {
  path: SeoPath;
  title?: string;
  description: string;
  imageAlt?: string;
  keywords?: string[];
}

export interface JsonLdNode {
  [key: string]: unknown;
}

export interface SeoConfig {
  title?: string;
  titleDefault: string;
  titleTemplate: string;
  description: string;
  canonical: string;
  robotsExtras: string;
  languageAlternates: Array<{ href: string; hrefLang: string }>;
  openGraph: {
    basic: {
      title: string;
      type: string;
      image: string;
      url: string;
    };
    optional: {
      description: string;
      locale: string;
      siteName: string;
    };
    image: {
      alt: string;
      width: number;
      height: number;
      type: string;
    };
  };
  twitter: {
    card: "summary_large_image";
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
  extend: {
    link: Array<Record<string, string>>;
    meta: Array<Record<string, string>>;
  };
}

const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;

function trimSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, "");
}

export function buildCanonicalUrl(path: string) {
  if (path === "/") {
    return `${SITE_URL}/`;
  }

  return `${SITE_URL}/${trimSlashes(path)}`;
}

export function getOgImagePath(path: string) {
  return "/logo.png";
}

export function getAbsoluteUrl(path: string) {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

export function buildSeo(input: SeoInput): SeoConfig {
  const canonical = buildCanonicalUrl(input.path);
  const imagePath = getOgImagePath(input.path);
  const imageUrl = getAbsoluteUrl(imagePath);
  const title = input.title;
  const resolvedTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const imageAlt =
    input.imageAlt ??
    `${SITE_NAME}: contador de caracteres, palavras e analise de texto`;

  return {
    title,
    titleDefault: SITE_NAME,
    titleTemplate: `%s | ${SITE_NAME}`,
    description: input.description,
    canonical,
    robotsExtras: DEFAULT_ROBOTS_EXTRAS,
    languageAlternates: [
      { href: canonical, hrefLang: DEFAULT_LANGUAGE },
      { href: canonical, hrefLang: "x-default" },
    ],
    openGraph: {
      basic: {
        title: resolvedTitle,
        type: "website",
        image: imageUrl,
        url: canonical,
      },
      optional: {
        description: input.description,
        locale: DEFAULT_LOCALE,
        siteName: SITE_NAME,
      },
      image: {
        alt: imageAlt,
        width: OG_IMAGE_SIZE.width,
        height: OG_IMAGE_SIZE.height,
        type: "image/png",
      },
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: input.description,
      image: imageUrl,
      imageAlt,
    },
    extend: {
      link: [{ rel: "sitemap", href: "/sitemap-index.xml" }],
      meta: [
        { name: "application-name", content: SITE_NAME },
        { name: "author", content: "Pedro Augusto" },
        { name: "publisher", content: SITE_NAME },
        { name: "theme-color", content: "#0ea5e9" },
        { name: "format-detection", content: "telephone=no" },
        ...(input.keywords?.length
          ? [{ name: "keywords", content: input.keywords.join(", ") }]
          : []),
      ],
    },
  };
}

export function buildMetadata(input: SeoInput): Metadata {
  const seo = buildSeo(input);

  return {
    title: `${input.title ?? seo.titleTemplate}`,
    description: seo.description,
    keywords: input.keywords,
    alternates: {
      canonical: seo.canonical,
      languages: {
        [DEFAULT_LANGUAGE]: seo.canonical,
        "x-default": seo.canonical,
      },
    },
    applicationName: SITE_NAME,
    authors: [{ name: "Pedro Augusto" }],
    creator: "Pedro Augusto",
    publisher: SITE_NAME,
    formatDetection: {
      telephone: false,
    },
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title: seo.openGraph.basic.title,
      description: seo.description,
      type: "website",
      locale: DEFAULT_LOCALE,
      siteName: SITE_NAME,
      url: seo.canonical,
      images: [
        {
          url: seo.openGraph.basic.image,
          alt: seo.openGraph.image.alt,
          width: seo.openGraph.image.width,
          height: seo.openGraph.image.height,
          type: seo.openGraph.image.type,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: seo.robotsExtras,
    },
    twitter: {
      card: seo.twitter.card,
      title: seo.twitter.title,
      description: seo.twitter.description,
      images: [seo.twitter.image],
    },
    other: {
      "theme-color": "#0ea5e9",
      keywords: input.keywords?.join(", "),
    },
  };
}

export function buildFaqSchema(items: FaqItem[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildOrganizationSchema(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: getAbsoluteUrl("/logo.png"),
    foundingDate: "2026",
    founder: {
      "@type": "Person",
      name: "Pedro Augusto",
    },
  };
}

export function buildWebsiteSchema(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    inLanguage: DEFAULT_LANGUAGE,
  };
}

export function buildWebPageSchema(input: {
  path: SeoPath;
  title: string;
  description: string;
}): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.title,
    description: input.description,
    url: buildCanonicalUrl(input.path),
    inLanguage: DEFAULT_LANGUAGE,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
  };
}

export function buildSoftwareApplicationSchema(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${SITE_URL}/`,
    inLanguage: DEFAULT_LANGUAGE,
    description:
      "Ferramenta online para contar caracteres, palavras, frases, paragrafos e revisar textos com foco em clareza, SEO e produtividade.",
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "BRL",
        category: "Free",
      },
    ],
  };
}

export const seoSite = {
  url: SITE_URL,
  name: SITE_NAME,
  locale: DEFAULT_LOCALE,
  language: DEFAULT_LANGUAGE,
};
