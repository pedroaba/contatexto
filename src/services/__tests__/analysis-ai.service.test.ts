import test from "node:test";
import assert from "node:assert/strict";

import { AnalysisAiService } from "../analysis-ai.service.ts";
import { CounterService } from "../counter.service.ts";

const counterService = new CounterService();

test("builds structured AI sections from text analysis", async () => {
  const service = new AnalysisAiService(async () => ({
    summary: "Clareza boa, SEO presente e tom direto.",
    sections: [
      {
        id: "clarity",
        title: "Clareza e legibilidade",
        summary: "Texto flui bem.",
        items: ["Frases objetivas.", "Boa distribuicao de ideias."],
      },
      {
        id: "seo",
        title: "SEO e estrutura",
        summary: "Tema principal aparece.",
        items: ["Palavra-chave presente.", "Abertura reaproveitavel para snippet."],
      },
      {
        id: "tone",
        title: "Tom e melhoria",
        summary: "Tom consistente.",
        items: ["CTA esta visivel.", "Vale testar versao mais especifica no fechamento."],
      },
    ],
  }));
  const text =
    "Conheca plataforma que melhora textos para SEO e deixa descricoes mais claras. Experimente agora mesmo para publicar melhor.";
  const counterAnalysis = counterService.analyze(text);
  const result = await service.analyze(text, counterAnalysis);

  assert.equal(result.status, "ready");
  assert.equal(result.sections.length, 3);
  assert.equal(result.sections[0]?.id, "clarity");
  assert.equal(result.sections[1]?.id, "seo");
  assert.equal(result.sections[2]?.id, "tone");
  assert.equal(result.model, "gemini-2.5-flash");
  assert.match(result.summary, /clareza|SEO|tom/i);
  assert.ok(result.sections.every((section) => section.items.length >= 2));
});

test("returns actionable empty-text guidance without crashing", async () => {
  const service = new AnalysisAiService();
  const result = await service.analyze("", counterService.analyze(""));

  assert.equal(result.status, "ready");
  assert.match(result.summary, /adicione texto/i);
  assert.equal(result.sections.length, 3);
});
