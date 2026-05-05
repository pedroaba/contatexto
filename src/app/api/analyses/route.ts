import { json } from "@/utils/http";

import {
  analysisFilterSchema,
  createAnalysisSchema,
} from "@/services/analysis.schema";

import {
  getAnalysisWorkspaceService,
  handleAnalysisError,
  requireAnalysisActor,
} from "./_lib";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const actor = await requireAnalysisActor();

  if (!actor) {
    return json({ error: "Sessão inválida." }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const parsedFilter = analysisFilterSchema.safeParse(
      url.searchParams.get("filter") ?? "all",
    );

    if (!parsedFilter.success) {
      return json({ error: "Filtro inválido." }, { status: 400 });
    }

    const analyses = await getAnalysisWorkspaceService().listAnalyses(
      actor,
      parsedFilter.data,
    );

    return json({ analyses }, { status: 200 });
  } catch (error) {
    return handleAnalysisError(error);
  }
}

export async function POST(request: Request) {
  const actor = await requireAnalysisActor();

  if (!actor) {
    return json({ error: "Sessão inválida." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsedBody = createAnalysisSchema.safeParse(body);

    if (!parsedBody.success) {
      return json({ error: "Dados inválidos para salvar análise." }, { status: 400 });
    }

    const analysis = await getAnalysisWorkspaceService().createAnalysis({
      text: parsedBody.data.text,
      title: parsedBody.data.title,
      user: actor,
    });

    return json({ analysis }, { status: 201 });
  } catch (error) {
    return handleAnalysisError(error);
  }
}
