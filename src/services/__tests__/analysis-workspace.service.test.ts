import test from "node:test";
import assert from "node:assert/strict";

import type {
  AnalysisAiResult,
  SavedAnalysis,
  SavedAnalysisRepository,
  UserPlan,
} from "../analysis.types.ts";
import { AnalysisAiService } from "../analysis-ai.service.ts";
import { AnalysisWorkspaceService } from "../analysis-workspace.service.ts";

function createMemoryRepository(seed: SavedAnalysis[] = []): SavedAnalysisRepository {
  const records = new Map(seed.map((record) => [record.id, structuredClone(record)]));

  return {
    async countByUserId(userId) {
      return [...records.values()].filter((record) => record.userId === userId).length;
    },
    async create(input) {
      records.set(input.id, structuredClone(input));
      return structuredClone(input);
    },
    async delete(id, userId) {
      const record = records.get(id);

      if (!record || record.userId !== userId) {
        return false;
      }

      records.delete(id);

      return true;
    },
    async getById(id, userId) {
      const record = records.get(id);

      if (!record || record.userId !== userId) {
        return null;
      }

      return structuredClone(record);
    },
    async listByUserId(userId) {
      return [...records.values()]
        .filter((record) => record.userId === userId)
        .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
        .map((record) => structuredClone(record));
    },
    async update(id, userId, update) {
      const current = records.get(id);

      if (!current || current.userId !== userId) {
        return null;
      }

      const nextRecord = {
        ...current,
        ...structuredClone(update),
      };
      records.set(id, nextRecord);

      return structuredClone(nextRecord);
    },
  };
}

const user = {
  id: "user-1",
  plan: "Free" as UserPlan,
};

test("creates snapshot with computed metrics and lists newest first", async () => {
  const service = new AnalysisWorkspaceService(createMemoryRepository());

  const first = await service.createAnalysis({
    text: "Primeiro texto curto.",
    user,
  });
  const second = await service.createAnalysis({
    text: "Segundo texto com titulo melhor para abrir depois.",
    user,
  });

  const list = await service.listAnalyses(user);

  assert.equal(first.aiStatus, "idle");
  assert.equal(list.length, 2);
  assert.equal(list[0]?.id, second.id);
  assert.equal(list[1]?.id, first.id);
  assert.equal(list[0]?.summary.words > 0, true);
  assert.match(list[0]?.title ?? "", /Segundo texto/);
});

test("blocks Free users above save limit and allows Pro unlimited", async () => {
  const freeSeed = Array.from({ length: 50 }, (_, index) => {
    const iso = new Date(Date.UTC(2026, 0, 1, 0, 0, index)).toISOString();

    return {
      id: `seed-${index}`,
      userId: user.id,
      title: `Analise ${index}`,
      text: "Texto",
      summary: {
        characters: 5,
        words: 1,
        sentences: 1,
      },
      metrics: [],
      quality: {
        readabilityLabel: "Boa",
        readabilityScore: 80,
        level: "Simples",
        tone: "Neutro",
        items: [],
      },
      platformLimits: [],
      aiStatus: "idle" as const,
      aiAnalysis: null,
      createdAt: iso,
      updatedAt: iso,
    } satisfies SavedAnalysis;
  });
  const freeService = new AnalysisWorkspaceService(createMemoryRepository(freeSeed));

  await assert.rejects(
    freeService.createAnalysis({
      text: "Texto 51",
      user,
    }),
    /limite do plano free/i,
  );

  const proService = new AnalysisWorkspaceService(createMemoryRepository(freeSeed));
  const proResult = await proService.createAnalysis({
    text: "Texto Pro",
    user: {
      id: "user-1",
      plan: "Pro",
    },
  });

  assert.equal(proResult.text, "Texto Pro");
});

test("duplicates analysis with new id and timestamps", async () => {
  const service = new AnalysisWorkspaceService(createMemoryRepository());
  const saved = await service.createAnalysis({
    text: "Texto base para duplicar.",
    user,
  });

  const duplicated = await service.duplicateAnalysis(saved.id, user);

  assert.notEqual(duplicated.id, saved.id);
  assert.equal(duplicated.text, saved.text);
  assert.notEqual(duplicated.createdAt, saved.createdAt);
});

test("runs AI only for Pro users and persists result", async () => {
  const aiService = new AnalysisAiService(async () => ({
    summary: "Resumo com foco em clareza, SEO e tom.",
    sections: [
      {
        id: "clarity",
        title: "Clareza e legibilidade",
        summary: "Texto claro.",
        items: ["Ideia principal aparece cedo.", "Leitura esta objetiva."],
      },
      {
        id: "seo",
        title: "SEO e estrutura",
        summary: "Boa base para busca.",
        items: ["Palavra-chave presente.", "Abertura pode virar snippet."],
      },
      {
        id: "tone",
        title: "Tom e melhoria",
        summary: "Tom coerente.",
        items: ["CTA esta presente.", "Vale testar beneficio mais especifico."],
      },
    ],
  }));
  const service = new AnalysisWorkspaceService(createMemoryRepository(), undefined, aiService);
  const saved = await service.createAnalysis({
    text: "Texto com estrutura boa para SEO e CTA no final. Teste agora.",
    user: {
      id: "user-2",
      plan: "Pro",
    },
  });

  const analyzed = await service.runAiAnalysis(saved.id, {
    id: "user-2",
    plan: "Pro",
  });

  assert.equal(analyzed.aiStatus, "ready");
  assert.equal(analyzed.aiAnalysis?.sections.length, 3);

  await assert.rejects(
    service.runAiAnalysis(saved.id, {
      id: "user-2",
      plan: "Free",
    }),
    /plano pro/i,
  );
});

test("renames, replaces snapshot content and deletes analyses", async () => {
  const service = new AnalysisWorkspaceService(createMemoryRepository());
  const saved = await service.createAnalysis({
    text: "Texto inicial.",
    user,
  });

  const updated = await service.updateAnalysis(saved.id, user, {
    text: "Texto atualizado com mais detalhes.",
    title: "Analise final",
  });

  assert.equal(updated.title, "Analise final");
  assert.equal(updated.summary.words > saved.summary.words, true);
  assert.equal(updated.aiAnalysis, null);

  const deleted = await service.deleteAnalysis(saved.id, user);
  const list = await service.listAnalyses(user);

  assert.equal(deleted, true);
  assert.equal(list.length, 0);
});
