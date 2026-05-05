export type PlatformLimitStatus = "good" | "warning" | "danger";

export interface TextMetrics {
  characters: number;
  charactersWithoutSpaces: number;
  words: number;
  uniqueWords: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTimeSeconds: number;
}

export interface CounterSummary {
  characters: number;
  words: number;
  sentences: number;
}

export interface CounterMetric {
  id:
    | "characters"
    | "charactersWithoutSpaces"
    | "words"
    | "uniqueWords"
    | "sentences"
    | "paragraphs"
    | "lines"
    | "readingTime";
  label: string;
  value: string;
  hint: string;
}

export interface QualityItem {
  id: "readingTime" | "speechTime" | "level" | "tone";
  label: string;
  value: string;
}

export interface QualityAnalysis {
  readabilityScore: number;
  readabilityLabel: string;
  level: string;
  tone: string;
  items: QualityItem[];
}

export interface PlatformLimit {
  id: string;
  name: string;
  current: number;
  max: number;
  percent: number;
  status: PlatformLimitStatus;
  target: string;
}

export interface CounterAnalysis {
  summary: CounterSummary;
  metrics: CounterMetric[];
  quality: QualityAnalysis;
  platformLimits: PlatformLimit[];
}
