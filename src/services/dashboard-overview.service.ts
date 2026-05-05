import type { SavedAnalysis, UserPlan } from "./analysis.types.ts";

interface DashboardOverviewInput {
  analyses: SavedAnalysis[];
  now?: Date;
  plan: UserPlan;
}

interface DashboardStat {
  label: string;
  value: string;
  delta: string;
  icon: "month" | "saved" | "quality" | "plan";
  tone: string;
}

interface DashboardRecentAnalysis {
  id: string;
  title: string;
  updatedAt: string;
  metrics: string;
  hasAi: boolean;
}

interface DashboardQuickAction {
  title: string;
  description: string;
  href: string;
}

export interface DashboardOverview {
  stats: DashboardStat[];
  recentAnalyses: DashboardRecentAnalysis[];
  quickActions: DashboardQuickAction[];
  plusHighlights: string[];
  emptyRecentLabel: string;
}

export class DashboardOverviewService {
  build({ analyses, now = new Date(), plan }: DashboardOverviewInput): DashboardOverview {
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const lastSevenDaysStart = new Date(now);
    lastSevenDaysStart.setUTCDate(now.getUTCDate() - 6);
    lastSevenDaysStart.setUTCHours(0, 0, 0, 0);

    const analysesThisMonth = analyses.filter(
      (analysis) => new Date(analysis.createdAt) >= monthStart,
    ).length;
    const analysesLastSevenDays = analyses.filter(
      (analysis) => new Date(analysis.createdAt) >= lastSevenDaysStart,
    ).length;
    const analysesWithAi = analyses.filter(
      (analysis) => analysis.aiStatus === "ready",
    ).length;
    const averageQualityScore =
      analyses.length === 0
        ? 0
        : Math.round(
            analyses.reduce(
              (accumulator, analysis) =>
                accumulator + analysis.quality.readabilityScore,
              0,
            ) / analyses.length,
          );

    const recentAnalyses = [...analyses]
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .slice(0, 3)
      .map((analysis) => ({
        id: analysis.id,
        title: analysis.title,
        updatedAt: this.formatDateLabel(new Date(analysis.updatedAt), now),
        metrics: `${this.formatNumber(analysis.summary.characters)} caracteres · ${this.formatNumber(
          analysis.summary.words,
        )} palavras`,
        hasAi: analysis.aiStatus === "ready",
      }));

    return {
      stats: [
        {
          label: "Análises no mês",
          value: this.formatNumber(analysesThisMonth),
          delta: `${this.formatNumber(analysesLastSevenDays)} criadas nos últimos 7 dias`,
          icon: "month",
          tone: "text-emerald-300",
        },
        {
          label: "Análises salvas",
          value: this.formatNumber(analyses.length),
          delta:
            analyses.length === 0
              ? "Comece salvando sua primeira análise"
              : `${this.formatNumber(analysesWithAi)} com IA e ${this.formatNumber(
                  Math.max(0, analyses.length - analysesWithAi),
                )} sem IA`,
          icon: "saved",
          tone: "text-sky-300",
        },
        {
          label: "Média de qualidade",
          value: `${this.formatNumber(averageQualityScore)}%`,
          delta: "Baseada em clareza e legibilidade",
          icon: "quality",
          tone: "text-amber-300",
        },
        {
          label: "Plano atual",
          value: plan,
          delta:
            plan === "Pro"
              ? "IA liberada para análises salvas"
              : "Faça upgrade para liberar IA nas análises",
          icon: "plan",
          tone: "text-fuchsia-300",
        },
      ],
      recentAnalyses,
      quickActions: [
        {
          title: "Nova análise",
          description: "Abrir editor, revisar texto e salvar snapshot.",
          href: "/dashboard/analyses",
        },
        {
          title: "Ver histórico",
          description: "Acessar análises salvas, filtros e ações rápidas.",
          href: "/dashboard/analyses",
        },
        {
          title: plan === "Pro" ? "Gerenciar plano" : "Conhecer plano Pro",
          description:
            plan === "Pro"
              ? "Revisar limites, recursos premium e cobrança."
              : "Entender IA, limites e recursos premium.",
          href:
            plan === "Pro"
              ? "/api/stripe/portal"
              : "/api/stripe/checkout?interval=monthly",
        },
      ],
      plusHighlights: [
        "Sugestões com IA para clareza, tom e estrutura",
        "Leitura mais profunda para SEO e copywriting",
        "Mais contexto para melhorar título, descrição e CTA",
        "Fluxo pensado para quem analisa com frequência",
      ],
      emptyRecentLabel:
        recentAnalyses.length > 0
          ? ""
          : "Nenhuma análise salva ainda. Crie a primeira para começar seu histórico.",
    };
  }

  private formatDateLabel(date: Date, now: Date) {
    const sameDay = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (sameDay) {
      return `Hoje, ${this.formatTime(date)}`;
    }

    if (date.toDateString() === yesterday.toDateString()) {
      return `Ontem, ${this.formatTime(date)}`;
    }

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    }).format(date);
  }

  private formatNumber(value: number) {
    return new Intl.NumberFormat("pt-BR").format(value);
  }

  private formatTime(date: Date) {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    }).format(date);
  }
}
