import test from "node:test";
import assert from "node:assert/strict";

import { QualityAnalysisService } from "../quality-analysis.service.ts";
import { TextMetricsService } from "../text-metrics.service.ts";

const textMetricsService = new TextMetricsService();
const service = new QualityAnalysisService();

test("returns empty-state quality metrics for empty text", () => {
  const result = service.analyze("", textMetricsService.analyze(""));

  assert.equal(result.readabilityScore, 0);
  assert.equal(result.readabilityLabel, "Sem texto");
  assert.equal(result.level, "Simples");
  assert.equal(result.tone, "Neutro");
  assert.equal(result.items[0]?.value, "0s");
  assert.equal(result.items[1]?.value, "0s");
});

test("classifies short and clear text as readable", () => {
  const text = "Texto curto. Frase clara. Leitura simples.";
  const result = service.analyze(text, textMetricsService.analyze(text));

  assert.ok(result.readabilityScore >= 70);
  assert.equal(result.readabilityLabel, "Excelente");
  assert.equal(result.level, "Médio");
  assert.equal(result.tone, "Neutro");
});

test("classifies dense text as more difficult and advanced", () => {
  const text =
    "A complexidade argumentativa desta proposicao exige interpretacoes complementares, articuladas em um encadeamento extenso, preciso e semanticamente denso, reduzindo a fluidez imediata da leitura.";
  const result = service.analyze(text, textMetricsService.analyze(text));

  assert.ok(result.readabilityScore < 70);
  assert.equal(result.level, "Avançado");
});

test("detects emphatic tone from repeated exclamations", () => {
  const text = "AGORA sim! Que resultado incrível! Faça isso hoje!";
  const result = service.analyze(text, textMetricsService.analyze(text));

  assert.equal(result.tone, "Enérgico");
});
