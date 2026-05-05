import { getSessionUser } from "@/lib/auth/session";
import { json } from "@/utils/http";

import { FirestoreSavedAnalysisRepository } from "@/services/analysis-firestore.repository";
import {
  AnalysisWorkspaceError,
  AnalysisWorkspaceService,
} from "@/services/analysis-workspace.service";

const repository = new FirestoreSavedAnalysisRepository();
const workspaceService = new AnalysisWorkspaceService(repository);

export async function requireAnalysisActor() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return null;
  }

  return {
    id: sessionUser.uid,
    plan: sessionUser.plan,
  } as const;
}

export function getAnalysisWorkspaceService() {
  return workspaceService;
}

export function handleAnalysisError(error: unknown) {
  if (error instanceof SyntaxError) {
    return json({ error: "JSON inválido." }, { status: 400 });
  }

  if (error instanceof AnalysisWorkspaceError) {
    const status =
      error.code === "NOT_FOUND"
        ? 404
        : error.code === "FORBIDDEN"
          ? 403
          : error.code === "LIMIT_REACHED"
            ? 403
            : 400;

    return json({ error: error.message }, { status });
  }

  return json(
    { error: "Não foi possível concluir a operação da análise." },
    { status: 500 },
  );
}
