import test from "node:test";
import assert from "node:assert/strict";

import {
  buildCanonicalUrl,
  buildFaqSchema,
  buildSeo,
  getOgImagePath,
} from "../../lib/seo.ts";

interface FaqSchema {
  "@type": string;
  mainEntity: Array<{
    name: string;
    acceptedAnswer: {
      text: string;
    };
  }>;
}

test("buildCanonicalUrl keeps the homepage at the root URL", () => {
  assert.equal(buildCanonicalUrl("/"), "https://textotools.app/");
});

test("buildCanonicalUrl normalizes nested paths", () => {
  assert.equal(buildCanonicalUrl("docs"), "https://textotools.app/docs");
  assert.equal(buildCanonicalUrl("/about/"), "https://textotools.app/about");
});

test("getOgImagePath maps the homepage and internal pages to stable assets", () => {
  assert.equal(getOgImagePath("/"), "/logo.png");
  assert.equal(getOgImagePath("/docs"), "/logo.png");
  assert.equal(getOgImagePath("/about"), "/logo.png");
});

test("buildSeo creates canonical, robots and social image metadata", () => {
  const seo = buildSeo({
    path: "/docs",
    title: "Documentacao",
    description: "Guia completo para revisar e otimizar textos.",
  });

  assert.equal(seo.canonical, "https://textotools.app/docs");
  assert.equal(seo.robotsExtras, "max-snippet:-1, max-image-preview:large, max-video-preview:-1");
  assert.equal(seo.openGraph.basic.image, "https://textotools.app/logo.png");
  assert.equal(seo.twitter.image, "https://textotools.app/logo.png");
});

test("buildFaqSchema converts visible FAQs into JSON-LD", () => {
  const schema = buildFaqSchema([
    {
      question: "Como contar caracteres?",
      answer: "Cole o texto e acompanhe a contagem em tempo real.",
    },
  ]) as unknown as FaqSchema;

  assert.equal(schema["@type"], "FAQPage");
  assert.equal(schema.mainEntity.length, 1);
  assert.equal(schema.mainEntity[0].name, "Como contar caracteres?");
  assert.equal(
    schema.mainEntity[0].acceptedAnswer.text,
    "Cole o texto e acompanhe a contagem em tempo real.",
  );
});
