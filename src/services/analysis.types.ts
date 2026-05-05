import type {
  CounterAnalysis,
  CounterMetric,
  CounterSummary,
  PlatformLimit,
  QualityAnalysis,
} from "./counter.types.ts";

export type UserPlan = "Free" | "Pro";

export type AnalysisAiStatus = "idle" | "pending" | "ready" | "error";
export type AnalysisFilter = "all" | "with-ai" | "without-ai";

export interface AnalysisAiSection {
  id: "clarity" | "seo" | "tone";
  title: string;
  summary: string;
  items: string[];
}

export interface AnalysisAiResult {
  status: "ready";
  summary: string;
  sections: AnalysisAiSection[];
  createdAt: string;
  model: string;
  version: string;
}

export interface SavedAnalysis {
  id: string;
  userId: string;
  title: string;
  text: string;
  summary: CounterSummary;
  metrics: CounterMetric[];
  quality: QualityAnalysis;
  platformLimits: PlatformLimit[];
  aiStatus: AnalysisAiStatus;
  aiAnalysis: AnalysisAiResult | null;
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisListItem extends SavedAnalysis {
  excerpt: string;
}

export interface SavedAnalysisRepository {
  countByUserId(userId: string): Promise<number>;
  create(input: SavedAnalysis): Promise<SavedAnalysis>;
  delete(id: string, userId: string): Promise<boolean>;
  getById(id: string, userId: string): Promise<SavedAnalysis | null>;
  listByUserId(userId: string): Promise<SavedAnalysis[]>;
  update(
    id: string,
    userId: string,
    update: Partial<SavedAnalysis>,
  ): Promise<SavedAnalysis | null>;
}

export interface AnalysisActor {
  id: string;
  plan: UserPlan;
}

export type SnapshotAnalysis = Pick<
  CounterAnalysis,
  "summary" | "metrics" | "quality" | "platformLimits"
>;
