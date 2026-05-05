import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "../../..");

const readSource = (relativePath: string) =>
  readFileSync(resolve(projectRoot, relativePath), "utf8");

test("editorial and commercial pages include ad slots", () => {
  const pagesWithAds = {
    "src/app/about/page.tsx": 3,
    "src/app/docs/page.tsx": 3,
  };

  Object.entries(pagesWithAds).forEach(([pagePath, minimumSlots]) => {
    const source = readSource(pagePath);
    const slotCount = [...source.matchAll(/<AdSlot\b/g)].length;

    assert.match(source, /import\s+\{\s*AdSlot\s*\}\s+from ["']@\/components\/marketing\/ad-slot["'];/);
    assert.ok(
      slotCount >= minimumSlots,
      `${pagePath} should contain at least ${minimumSlots} ad slots, found ${slotCount}`,
    );
  });
});

test("home composition includes expanded ad inventory", () => {
  const toolSectionSource = readSource("src/components/marketing/text-tool-section.tsx");
  const staticSectionsSource = readSource("src/app/page.tsx");
  const homeSlotCount =
    [...toolSectionSource.matchAll(/<AdSlot\b/g)].length +
    [...staticSectionsSource.matchAll(/<AdSlot\b/g)].length;

  assert.ok(
    homeSlotCount >= 4,
    `home should contain at least 4 ad inventory markers across its sections, found ${homeSlotCount}`,
  );
});

test("legal pages remain without ad slots", () => {
  const legalPages = ["src/app/privacy/page.tsx", "src/app/terms/page.tsx"];

  legalPages.forEach((pagePath) => {
    const source = readSource(pagePath);

    assert.doesNotMatch(source, /import\s+\{\s*AdSlot/);
    assert.doesNotMatch(source, /<AdSlot /);
  });
});
