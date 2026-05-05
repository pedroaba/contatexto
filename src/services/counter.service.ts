import type {
  CounterAnalysis,
  CounterMetric,
  TextMetrics,
} from "./counter.types.ts";
import { PlatformLimitsService } from "./platform-limits.service.ts";
import { QualityAnalysisService } from "./quality-analysis.service.ts";
import { TextMetricsService } from "./text-metrics.service.ts";

export class CounterService {
  private readonly textMetricsService: TextMetricsService;

  private readonly platformLimitsService: PlatformLimitsService;

  private readonly qualityAnalysisService: QualityAnalysisService;

  constructor(
    textMetricsService = new TextMetricsService(),
    platformLimitsService = new PlatformLimitsService(),
    qualityAnalysisService = new QualityAnalysisService(),
  ) {
    this.textMetricsService = textMetricsService;
    this.platformLimitsService = platformLimitsService;
    this.qualityAnalysisService = qualityAnalysisService;
  }

  analyze(text: string): CounterAnalysis {
    const metrics = this.textMetricsService.analyze(text);

    return {
      summary: {
        characters: metrics.characters,
        words: metrics.words,
        sentences: metrics.sentences,
      },
      metrics: this.buildMetrics(metrics),
      quality: this.qualityAnalysisService.analyze(text, metrics),
      platformLimits: this.platformLimitsService.build(metrics.characters),
    };
  }

  private buildMetrics(metrics: TextMetrics): CounterMetric[] {
    const spaces = metrics.characters - metrics.charactersWithoutSpaces;
    const averageCharsPerWord =
      metrics.words === 0 ? 0 : metrics.charactersWithoutSpaces / metrics.words;
    const diversity =
      metrics.words === 0
        ? 0
        : Math.round((metrics.uniqueWords / metrics.words) * 100);
    const averageWordsPerSentence =
      metrics.sentences === 0 ? 0 : metrics.words / metrics.sentences;

    return [
      {
        id: "characters",
        label: "Caracteres",
        value: String(metrics.characters),
        hint: "com espaços",
      },
      {
        id: "charactersWithoutSpaces",
        label: "Sem espaços",
        value: String(metrics.charactersWithoutSpaces),
        hint: `${spaces} espaços`,
      },
      {
        id: "words",
        label: "Palavras",
        value: String(metrics.words),
        hint: `média ${this.formatDecimal(averageCharsPerWord)}`,
      },
      {
        id: "uniqueWords",
        label: "Únicas",
        value: String(metrics.uniqueWords),
        hint: `${diversity}% diversidade`,
      },
      {
        id: "sentences",
        label: "Frases",
        value: String(metrics.sentences),
        hint: `média ${this.formatDecimal(averageWordsPerSentence)} palavras`,
      },
      {
        id: "paragraphs",
        label: "Parágrafos",
        value: String(metrics.paragraphs),
        hint: `${metrics.paragraphs} ${metrics.paragraphs === 1 ? "bloco" : "blocos"}`,
      },
      {
        id: "lines",
        label: "Linhas",
        value: String(metrics.lines),
        hint: "quebras incl.",
      },
      {
        id: "readingTime",
        label: "Leitura",
        value: this.formatReadingTime(metrics.readingTimeSeconds),
        hint: "≈225 ppm",
      },
    ];
  }

  private formatDecimal(value: number): string {
    return value.toFixed(1).replace(".", ",");
  }

  private formatReadingTime(readingTimeSeconds: number): string {
    if (readingTimeSeconds < 60) {
      return `${readingTimeSeconds}s`;
    }

    const minutes = Math.ceil(readingTimeSeconds / 60);

    return `${minutes}min`;
  }
}
