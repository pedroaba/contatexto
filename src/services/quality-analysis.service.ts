import type {
  QualityAnalysis,
  QualityItem,
  TextMetrics,
} from "./counter.types.ts";

const SPEECH_WORDS_PER_MINUTE = 130;

export class QualityAnalysisService {
  analyze(text: string, metrics: TextMetrics): QualityAnalysis {
    const readabilityScore = this.getReadabilityScore(metrics);
    const readabilityLabel = this.getReadabilityLabel(readabilityScore, metrics.words);
    const level = this.getLevel(metrics);
    const tone = this.getTone(text);

    return {
      readabilityScore,
      readabilityLabel,
      level,
      tone,
      items: this.buildItems(metrics, level, tone),
    };
  }

  private buildItems(
    metrics: TextMetrics,
    level: string,
    tone: string,
  ): QualityItem[] {
    const speechTimeSeconds =
      metrics.words === 0
        ? 0
        : Math.ceil((metrics.words / SPEECH_WORDS_PER_MINUTE) * 60);

    return [
      {
        id: "readingTime",
        label: "Leitura",
        value: this.formatDuration(metrics.readingTimeSeconds),
      },
      {
        id: "speechTime",
        label: "Fala",
        value: this.formatDuration(speechTimeSeconds),
      },
      {
        id: "level",
        label: "Nível",
        value: level,
      },
      {
        id: "tone",
        label: "Tom",
        value: tone,
      },
    ];
  }

  private getReadabilityScore(metrics: TextMetrics): number {
    if (metrics.words === 0) {
      return 0;
    }

    const averageCharsPerWord = metrics.charactersWithoutSpaces / metrics.words;
    const averageWordsPerSentence =
      metrics.sentences === 0 ? metrics.words : metrics.words / metrics.sentences;
    const averageSentencesPerParagraph =
      metrics.paragraphs === 0
        ? metrics.sentences
        : metrics.sentences / metrics.paragraphs;

    const sentencePenalty = Math.max(0, averageWordsPerSentence - 12) * 2.4;
    const wordPenalty = Math.max(0, averageCharsPerWord - 5) * 12;
    const paragraphPenalty = Math.max(0, averageSentencesPerParagraph - 3) * 8;

    return Math.max(
      0,
      Math.min(100, Math.round(100 - sentencePenalty - wordPenalty - paragraphPenalty)),
    );
  }

  private getReadabilityLabel(score: number, words: number): string {
    if (words === 0) {
      return "Sem texto";
    }

    if (score >= 85) {
      return "Excelente";
    }

    if (score >= 70) {
      return "Boa";
    }

    if (score >= 50) {
      return "Regular";
    }

    return "Difícil";
  }

  private getLevel(metrics: TextMetrics): string {
    if (metrics.words === 0) {
      return "Simples";
    }

    const averageCharsPerWord = metrics.charactersWithoutSpaces / metrics.words;
    const averageWordsPerSentence =
      metrics.sentences === 0 ? metrics.words : metrics.words / metrics.sentences;

    if (averageCharsPerWord > 6.2 || averageWordsPerSentence > 20) {
      return "Avançado";
    }

    if (averageCharsPerWord > 5 || averageWordsPerSentence > 12) {
      return "Médio";
    }

    return "Simples";
  }

  private getTone(text: string): string {
    const normalizedText = text.trim();

    if (!normalizedText) {
      return "Neutro";
    }

    const exclamations = (normalizedText.match(/!/g) ?? []).length;
    const questions = (normalizedText.match(/\?/g) ?? []).length;
    const uppercaseWords = (
      normalizedText.match(/\b[\p{Lu}]{2,}\b/gu) ?? []
    ).length;

    if (exclamations >= 2 || uppercaseWords >= 1) {
      return "Enérgico";
    }

    if (questions >= 2) {
      return "Curioso";
    }

    return "Neutro";
  }

  private formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}s`;
    }

    return `${Math.ceil(seconds / 60)}min`;
  }
}
