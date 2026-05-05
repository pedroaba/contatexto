import { CounterService } from "./counter.service.ts";
import { AnalysisAiService } from "./analysis-ai.service.ts";
import type {
  AnalysisActor,
  AnalysisFilter,
  AnalysisListItem,
  SavedAnalysis,
  SavedAnalysisRepository,
} from "./analysis.types.ts";

const FREE_ANALYSIS_LIMIT = 50;

export class AnalysisWorkspaceError extends Error {
  readonly code:
    | "FORBIDDEN"
    | "LIMIT_REACHED"
    | "NOT_FOUND"
    | "INVALID_INPUT";

  constructor(
    message: string,
    code: "FORBIDDEN" | "LIMIT_REACHED" | "NOT_FOUND" | "INVALID_INPUT",
  ) {
    super(message);
    this.name = "AnalysisWorkspaceError";
    this.code = code;
  }
}

export class AnalysisWorkspaceService {
  private readonly repository: SavedAnalysisRepository;

  private readonly counterService: CounterService;

  private readonly aiService: AnalysisAiService;

  constructor(
    repository: SavedAnalysisRepository,
    counterService = new CounterService(),
    aiService = new AnalysisAiService(),
  ) {
    this.repository = repository;
    this.counterService = counterService;
    this.aiService = aiService;
  }

  async listAnalyses(
    user: AnalysisActor,
    filter: AnalysisFilter = "all",
  ): Promise<AnalysisListItem[]> {
    const analyses = await this.repository.listByUserId(user.id);

    return analyses
      .filter((analysis) => {
        if (filter === "with-ai") {
          return analysis.aiStatus === "ready";
        }

        if (filter === "without-ai") {
          return analysis.aiStatus !== "ready";
        }

        return true;
      })
      .map((analysis) => this.toListItem(analysis));
  }

  async createAnalysis({
    text,
    user,
    title,
  }: {
    text: string;
    user: AnalysisActor;
    title?: string;
  }) {
    await this.assertCanSave(user);

    const timestamp = new Date().toISOString();
    const counterAnalysis = this.counterService.analyze(text);
    const savedAnalysis: SavedAnalysis = {
      id: crypto.randomUUID(),
      userId: user.id,
      title: this.resolveTitle(title, text),
      text,
      summary: counterAnalysis.summary,
      metrics: counterAnalysis.metrics,
      quality: counterAnalysis.quality,
      platformLimits: counterAnalysis.platformLimits,
      aiStatus: "idle",
      aiAnalysis: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return this.repository.create(savedAnalysis);
  }

  async getAnalysis(id: string, user: AnalysisActor) {
    const analysis = await this.repository.getById(id, user.id);

    if (!analysis) {
      throw new AnalysisWorkspaceError("Análise não encontrada.", "NOT_FOUND");
    }

    return analysis;
  }

  async updateAnalysis(
    id: string,
    user: AnalysisActor,
    update: {
      text?: string;
      title?: string;
    },
  ) {
    const current = await this.getAnalysis(id, user);
    const nextText = update.text ?? current.text;
    const nextTitle = this.resolveTitle(update.title ?? current.title, nextText);
    const nextCounterAnalysis = this.counterService.analyze(nextText);
    const updated = await this.repository.update(id, user.id, {
      title: nextTitle,
      text: nextText,
      summary: nextCounterAnalysis.summary,
      metrics: nextCounterAnalysis.metrics,
      quality: nextCounterAnalysis.quality,
      platformLimits: nextCounterAnalysis.platformLimits,
      aiStatus: "idle",
      aiAnalysis: null,
      updatedAt: new Date().toISOString(),
    });

    if (!updated) {
      throw new AnalysisWorkspaceError("Análise não encontrada.", "NOT_FOUND");
    }

    return updated;
  }

  async deleteAnalysis(id: string, user: AnalysisActor) {
    return this.repository.delete(id, user.id);
  }

  async duplicateAnalysis(id: string, user: AnalysisActor) {
    await this.assertCanSave(user);
    const current = await this.getAnalysis(id, user);
    const timestamp = new Date(Date.now() + 1).toISOString();

    return this.repository.create({
      ...current,
      id: crypto.randomUUID(),
      title: `${current.title} (cópia)`,
      aiStatus: current.aiAnalysis ? "ready" : "idle",
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }

  async runAiAnalysis(id: string, user: AnalysisActor) {
    if (user.plan !== "Pro") {
      throw new AnalysisWorkspaceError(
        "Análise com AI disponível apenas no plano Pro.",
        "FORBIDDEN",
      );
    }

    const current = await this.getAnalysis(id, user);
    await this.repository.update(id, user.id, {
      aiStatus: "pending",
      updatedAt: new Date().toISOString(),
    });

    const aiAnalysis = await this.aiService.analyze(
      current.text,
      this.counterService.analyze(current.text),
    );
    const updated = await this.repository.update(id, user.id, {
      aiAnalysis,
      aiStatus: "ready",
      updatedAt: new Date().toISOString(),
    });

    if (!updated) {
      throw new AnalysisWorkspaceError("Análise não encontrada.", "NOT_FOUND");
    }

    return updated;
  }

  private async assertCanSave(user: AnalysisActor) {
    if (user.plan === "Pro") {
      return;
    }

    const analysisCount = await this.repository.countByUserId(user.id);

    if (analysisCount >= FREE_ANALYSIS_LIMIT) {
      throw new AnalysisWorkspaceError(
        "Você atingiu o limite do plano Free. Faça upgrade para salvar mais análises.",
        "LIMIT_REACHED",
      );
    }
  }

  private resolveTitle(title: string | undefined, text: string) {
    const normalizedTitle = title?.trim();

    if (normalizedTitle) {
      return normalizedTitle;
    }

    const normalizedText = text.trim().replace(/\s+/g, " ");

    if (!normalizedText) {
      return "Análise sem título";
    }

    const excerpt = normalizedText.slice(0, 48);

    return normalizedText.length > 48 ? `${excerpt}...` : excerpt;
  }

  private toListItem(analysis: SavedAnalysis): AnalysisListItem {
    const normalizedText = analysis.text.trim().replace(/\s+/g, " ");

    return {
      ...analysis,
      excerpt: normalizedText.slice(0, 120) || "Sem conteúdo salvo.",
    };
  }
}
