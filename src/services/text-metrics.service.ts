import type { TextMetrics } from "./counter.types.ts";

const WORDS_PER_MINUTE = 225;

export class TextMetricsService {
  analyze(text: string): TextMetrics {
    const characters = text.length;
    const charactersWithoutSpaces = text.replace(/\s/g, "").length;
    const words = this.getWords(text);
    const sentences = this.getSentences(text);
    const paragraphs = this.getParagraphs(text);
    const lines = this.getLines(text);

    return {
      characters,
      charactersWithoutSpaces,
      words: words.length,
      uniqueWords: new Set(words.map((word) => this.normalizeWord(word))).size,
      sentences,
      paragraphs,
      lines,
      readingTimeSeconds:
        words.length === 0 ? 0 : Math.ceil((words.length / WORDS_PER_MINUTE) * 60),
    };
  }

  private getWords(text: string): string[] {
    return text.trim().match(/\S+/g) ?? [];
  }

  private getSentences(text: string): number {
    const normalizedText = text.trim();

    if (!normalizedText) {
      return 0;
    }

    return normalizedText
      .split(/[.!?]+/)
      .map((segment) => segment.trim())
      .filter(Boolean).length;
  }

  private getParagraphs(text: string): number {
    const normalizedText = text.trim();

    if (!normalizedText) {
      return 0;
    }

    return normalizedText.split(/\n\s*\n/).filter((paragraph) => paragraph.trim()).length;
  }

  private getLines(text: string): number {
    if (!text.trim()) {
      return 0;
    }

    return text.split(/\r?\n/).length;
  }

  private normalizeWord(word: string): string {
    return word
      .toLowerCase()
      .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
  }
}
