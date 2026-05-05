import { json } from "@/utils/http";

import { updateAnalysisSchema } from "@/services/analysis.schema";

import {
  getAnalysisWorkspaceService,
  handleAnalysisError,
  requireAnalysisActor,
} from "../_lib";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: {
    params: Promise<{
      analysisId: string;
    }>;
  },
) {
  const actor = await requireAnalysisActor();

  if (!actor) {
    return json({ error: "Sessão inválida." }, { status: 401 });
  }

  try {
    const { analysisId } = await context.params;
    const analysis = await getAnalysisWorkspaceService().getAnalysis(
      analysisId,
      actor,
    );

    return json({ analysis }, { status: 200 });
  } catch (error) {
    return handleAnalysisError(error);
  }
}

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      analysisId: string;
    }>;
  },
) {
  const actor = await requireAnalysisActor();

  if (!actor) {
    return json({ error: "Sessão inválida." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsedBody = updateAnalysisSchema.safeParse(body);

    if (!parsedBody.success) {
      return json(
        { error: "Dados inválidos para atualizar análise." },
        { status: 400 },
      );
    }

    const { analysisId } = await context.params;
    const analysis = await getAnalysisWorkspaceService().updateAnalysis(
      analysisId,
      actor,
      parsedBody.data,
    );

    return json({ analysis }, { status: 200 });
  } catch (error) {
    return handleAnalysisError(error);
  }
}

export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{
      analysisId: string;
    }>;
  },
) {
  const actor = await requireAnalysisActor();

  if (!actor) {
    return json({ error: "Sessão inválida." }, { status: 401 });
  }

  try {
    const { analysisId } = await context.params;
    const deleted = await getAnalysisWorkspaceService().deleteAnalysis(
      analysisId,
      actor,
    );

    return deleted
      ? new Response(null, { status: 204 })
      : json({ error: "Análise não encontrada." }, { status: 404 });
  } catch (error) {
    return handleAnalysisError(error);
  }
}
