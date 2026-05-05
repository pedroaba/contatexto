import test from "node:test";
import assert from "node:assert/strict";

import type { SavedAnalysis, UserPlan } from "../analysis.types.ts";
import { DashboardOverviewService } from "../dashboard-overview.service.ts";

function buildAnalysis(
  id: string,
  overrides: Partial<SavedAnalysis> = {},
): SavedAnalysis {
  return {
    id,
    userId: "user-1",
    title: `Análise ${id}`,
    text: "Texto de exemplo para análise.",
    summary: {
      characters: 120,
      words: 20,
      sentences: 2,
    },
    metrics: [],
    quality: {
      readabilityScore: 80,
      readabilityLabel: "Boa",
      level: "Médio",
      tone: "Neutro",
      items: [],
    },
    platformLimits: [],
    aiStatus: "idle",
    aiAnalysis: null,
    createdAt: "2026-05-01T10:00:00.000Z",
    updatedAt: "2026-05-01T10:00:00.000Z",
    ...overrides,
  };
}

test("returns starter dashboard for users without analyses", () => {
  const service = new DashboardOverviewService();

  const result = service.build({
    analyses: [],
    plan: "Free",
    now: new Date("2026-05-03T12:00:00.000Z"),
  });

  assert.equal(result.stats[0]?.value, "0");
  assert.equal(result.stats[1]?.value, "0");
  assert.equal(result.stats[2]?.value, "0%");
  assert.equal(result.stats[3]?.value, "Free");
  assert.equal(result.recentAnalyses.length, 0);
  assert.equal(result.quickActions[0]?.href, "/dashboard/analyses");
  assert.match(result.emptyRecentLabel, /Nenhuma análise salva/i);
});

test("builds stats and recent analyses from saved records", () => {
  const service = new DashboardOverviewService();
  const analyses = [
    buildAnalysis("1", {
      summary: { characters: 156, words: 24, sentences: 2 },
      quality: {
        readabilityScore: 90,
        readabilityLabel: "Excelente",
        level: "Médio",
        tone: "Neutro",
        items: [],
      },
      createdAt: "2026-05-03T10:00:00.000Z",
      updatedAt: "2026-05-03T10:30:00.000Z",
      aiStatus: "ready",
      aiAnalysis: {
        status: "ready",
        summary: "Resumo",
        sections: [],
        createdAt: "2026-05-03T10:31:00.000Z",
        model: "rules-v1",
        version: "1",
      },
      title: "Meta description campanha maio",
    }),
    buildAnalysis("2", {
      summary: { characters: 1248, words: 214, sentences: 11 },
      quality: {
        readabilityScore: 70,
        readabilityLabel: "Boa",
        level: "Médio",
        tone: "Neutro",
        items: [],
      },
      createdAt: "2026-05-02T09:00:00.000Z",
      updatedAt: "2026-05-02T09:40:00.000Z",
      title: "Landing page de produto",
    }),
    buildAnalysis("3", {
      summary: { characters: 58, words: 9, sentences: 1 },
      quality: {
        readabilityScore: 60,
        readabilityLabel: "Regular",
        level: "Simples",
        tone: "Neutro",
        items: [],
      },
      createdAt: "2026-04-20T12:00:00.000Z",
      updatedAt: "2026-04-20T12:05:00.000Z",
      title: "Título para post comparativo",
    }),
  ];

  const result = service.build({
    analyses,
    plan: "Pro" as UserPlan,
    now: new Date("2026-05-03T12:00:00.000Z"),
  });

  assert.equal(result.stats[0]?.value, "2");
  assert.match(result.stats[0]?.delta ?? "", /2 criadas nos últimos 7 dias/i);
  assert.equal(result.stats[1]?.value, "3");
  assert.match(result.stats[1]?.delta ?? "", /1 com IA/i);
  assert.equal(result.stats[2]?.value, "73%");
  assert.equal(result.stats[3]?.value, "Pro");
  assert.equal(result.recentAnalyses.length, 3);
  assert.equal(result.recentAnalyses[0]?.title, "Meta description campanha maio");
  assert.equal(result.recentAnalyses[0]?.metrics, "156 caracteres · 24 palavras");
  assert.equal(result.recentAnalyses[0]?.hasAi, true);
  assert.equal(result.quickActions[2]?.href, "/api/stripe/portal");
  assert.match(result.plusHighlights[0] ?? "", /IA/i);
});
