import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "../../..");

const readSource = (relativePath: string) =>
  readFileSync(resolve(projectRoot, relativePath), "utf8");

test("public pages render without AdSlot inventory while awaiting review", () => {
  const publicSources = [
    "src/app/page.tsx",
    "src/app/about/page.tsx",
    "src/app/docs/page.tsx",
    "src/app/privacy/page.tsx",
    "src/app/terms/page.tsx",
    "src/app/contador-de-caracteres/page.tsx",
    "src/app/contador-de-palavras/page.tsx",
    "src/app/meta-title-meta-description/page.tsx",
    "src/app/tempo-de-leitura/page.tsx",
    "src/app/legendas-redes-sociais/page.tsx",
    "src/app/revisao-de-textos/page.tsx",
    "src/components/marketing/text-tool-section.tsx",
    "src/components/marketing/editorial-guide-page.tsx",
  ];

  publicSources.forEach((pagePath) => {
    const source = readSource(pagePath);

    assert.doesNotMatch(source, /import\s+\{\s*AdSlot/);
    assert.doesNotMatch(source, /<AdSlot\b/);
  });
});
