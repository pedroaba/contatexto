import { json } from "@/utils/http";

import {
  getAnalysisWorkspaceService,
  handleAnalysisError,
  requireAnalysisActor,
} from "../../_lib";

export const runtime = "nodejs";

export async function POST(
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
    const analysis = await getAnalysisWorkspaceService().runAiAnalysis(
      analysisId,
      actor,
    );

    return json({ analysis }, { status: 200 });
  } catch (error) {
    return handleAnalysisError(error);
  }
}
