import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";

import type { CounterAnalysis } from "./counter.types.ts";
import type { AnalysisAiResult, AnalysisAiSection } from "./analysis.types.ts";

const ANALYSIS_SECTION_IDS = ["clarity", "seo", "tone"] as const;

const analysisOutputSchema = z.object({
  summary: z.string().trim().min(1),
  sections: z.array(
    z.object({
      id: z.enum(ANALYSIS_SECTION_IDS),
      title: z.string().trim().min(1),
      summary: z.string().trim().min(1),
      items: z.array(z.string().trim().min(1)).min(2),
    }),
  ).length(3),
});

type AnalysisOutput = z.infer<typeof analysisOutputSchema>;

interface GenerateStructuredAnalysisInput {
  counterAnalysis: CounterAnalysis;
  text: string;
}

type GenerateStructuredAnalysis = (
  input: GenerateStructuredAnalysisInput,
) => Promise<AnalysisOutput>;

async function generateStructuredAnalysis({
  text,
  counterAnalysis,
}: GenerateStructuredAnalysisInput): Promise<AnalysisOutput> {
  const result = await generateText({
    model: google("gemini-2.5-flash"),
    system: [
      "Voce e um editor especialista em clareza, SEO e copywriting.",
      "Responda sempre em portugues do Brasil.",
      "Seja objetivo, acionavel e especifico.",
      "Nao invente metricas. Use apenas dados fornecidos no prompt.",
      "Retorne exatamente tres secoes com ids clarity, seo e tone.",
    ].join(" "),
    output: Output.object({
      schema: analysisOutputSchema,
    }),
    prompt: buildAnalysisPrompt(text, counterAnalysis),
  });

  return result.output;
}

export class AnalysisAiService {
  private readonly generateStructuredAnalysis: GenerateStructuredAnalysis;

  constructor(generateStructuredAnalysisFn = generateStructuredAnalysis) {
    this.generateStructuredAnalysis = generateStructuredAnalysisFn;
  }

  async analyze(
    text: string,
    counterAnalysis: CounterAnalysis,
  ): Promise<AnalysisAiResult> {
    const createdAt = new Date().toISOString();

    if (!text.trim()) {
      return this.buildFallbackResult(text, counterAnalysis, createdAt, "empty-v1");
    }

    try {
      const output = await this.generateStructuredAnalysis({
        text,
        counterAnalysis,
      });

      return {
        status: "ready",
        summary: output.summary,
        sections: this.normalizeSections(output.sections),
        createdAt,
        model: "gemini-2.5-flash",
        version: "2",
      };
    } catch (error) {
      console.error("Analysis AI generation failed", error);

      return this.buildFallbackResult(
        text,
        counterAnalysis,
        createdAt,
        "fallback-v1",
      );
    }
  }

  private normalizeSections(sections: AnalysisOutput["sections"]): AnalysisAiSection[] {
    const sectionMap = new Map(sections.map((section) => [section.id, section]));

    return ANALYSIS_SECTION_IDS.map((id) => {
      const section = sectionMap.get(id);

      if (!section) {
        return {
          id,
          title: this.getFallbackTitle(id),
          summary: "Secao indisponivel no momento.",
          items: ["Tente rodar a analise novamente em instantes."],
        };
      }

      return {
        id: section.id,
        title: section.title,
        summary: section.summary,
        items: section.items,
      };
    });
  }

  private buildFallbackResult(
    text: string,
    counterAnalysis: CounterAnalysis,
    createdAt: string,
    version: string,
  ): AnalysisAiResult {
    const sections = [
      this.buildClaritySection(text, counterAnalysis),
      this.buildSeoSection(text, counterAnalysis),
      this.buildToneSection(text, counterAnalysis),
    ];

    return {
      status: "ready",
      summary: this.buildSummary(text, counterAnalysis),
      sections,
      createdAt,
      model: "rules-v1",
      version,
    };
  }

  private buildSummary(text: string, counterAnalysis: CounterAnalysis) {
    if (!text.trim()) {
      return "Adicione texto para receber leitura de clareza, SEO e tom.";
    }

    const readability = counterAnalysis.quality.readabilityLabel.toLowerCase();
    const hasSeoTerms = this.hasSeoTerms(text);
    const tone = counterAnalysis.quality.tone.toLowerCase();

    return `Leitura ${readability}, sinais de SEO ${
      hasSeoTerms ? "presentes" : "fracos"
    } e tom ${tone}.`;
  }

  private buildClaritySection(
    text: string,
    counterAnalysis: CounterAnalysis,
  ): AnalysisAiSection {
    const { quality, summary } = counterAnalysis;
    const items = [];

    if (!text.trim()) {
      items.push("Escreva primeiro rascunho para medir legibilidade real.");
      items.push("Quebre ideia principal em frases curtas antes de revisar.");
    } else {
      items.push(`Legibilidade atual: ${quality.readabilityLabel}.`);
      items.push(`Volume atual: ${summary.words} palavras e ${summary.sentences} frases.`);

      if (quality.readabilityScore < 70) {
        items.push("Reduza tamanho medio das frases para ganhar fluidez.");
      } else {
        items.push("Mantenha estrutura curta; texto ja parece facil de percorrer.");
      }
    }

    return {
      id: "clarity",
      title: "Clareza e legibilidade",
      summary:
        quality.readabilityScore < 70
          ? "Texto pede cortes e simplificacao."
          : "Texto tem leitura amigavel.",
      items,
    };
  }

  private buildSeoSection(
    text: string,
    counterAnalysis: CounterAnalysis,
  ): AnalysisAiSection {
    const items = [];
    const characters = counterAnalysis.summary.characters;
    const hasSeoTerms = this.hasSeoTerms(text);

    items.push(
      hasSeoTerms
        ? "Texto traz termos que ajudam contexto de busca."
        : "Inclua termo principal e variacoes para reforcar contexto de busca.",
    );
    items.push(
      characters > 160
        ? "Revise primeiras linhas para extrair meta description mais curta."
        : "Tamanho atual facilita reaproveitar trechos para snippets curtos.",
    );

    if (!/[.!?]/.test(text.trim())) {
      items.push("Adicione estrutura minima para separar promessa, beneficio e CTA.");
    } else {
      items.push("Valide se primeira frase entrega promessa principal logo no inicio.");
    }

    return {
      id: "seo",
      title: "SEO e estrutura",
      summary: hasSeoTerms
        ? "Base de SEO existe, mas ainda vale lapidar abertura e snippet."
        : "SEO precisa de palavras-chave e promessa mais explicita.",
      items,
    };
  }

  private buildToneSection(
    text: string,
    counterAnalysis: CounterAnalysis,
  ): AnalysisAiSection {
    const items = [];
    const tone = counterAnalysis.quality.tone;

    items.push(`Tom percebido: ${tone}.`);

    if (tone === "Enérgico") {
      items.push("Segure excesso de enfase para manter credibilidade.");
    } else if (tone === "Curioso") {
      items.push("Converta perguntas fortes em respostas ou provas concretas.");
    } else {
      items.push("Adicione verbos de acao e beneficio claro para ganhar impacto.");
    }

    items.push(
      text.trim()
        ? "Revise CTA final para combinar com publico e objetivo da pagina."
        : "Defina objetivo do texto antes de ajustar tom.",
    );

    return {
      id: "tone",
      title: "Tom e melhoria",
      summary:
        tone === "Neutro"
          ? "Tom seguro, mas pode ganhar energia."
          : "Tom ja aparece; proximo passo e calibrar intensidade.",
      items,
    };
  }

  private getFallbackTitle(id: AnalysisAiSection["id"]) {
    switch (id) {
      case "clarity":
        return "Clareza e legibilidade";
      case "seo":
        return "SEO e estrutura";
      case "tone":
        return "Tom e melhoria";
    }
  }

  private hasSeoTerms(text: string) {
    const normalizedText = text.toLowerCase();

    return [
      "seo",
      "titulo",
      "title",
      "descricao",
      "description",
      "cta",
      "meta",
      "busca",
      "google",
    ].some((term) => normalizedText.includes(term));
  }
}

function buildAnalysisPrompt(text: string, counterAnalysis: CounterAnalysis) {
  return [
    "Analise texto abaixo e produza leitura editorial acionavel.",
    "",
    "Objetivo:",
    "- explicar clareza",
    "- apontar oportunidades de SEO",
    "- revisar tom e proxima melhoria",
    "",
    "Regras:",
    "- nao repita texto de forma generica",
    "- escreva itens curtos, especificos e uteis",
    "- cite numeros quando eles forem relevantes",
    "- mantenha linguagem profissional e direta",
    "",
    "Dados do texto:",
    JSON.stringify(
      {
        text,
        summary: counterAnalysis.summary,
        quality: counterAnalysis.quality,
        platformLimits: counterAnalysis.platformLimits,
      },
      null,
      2,
    ),
  ].join("\n");
}
