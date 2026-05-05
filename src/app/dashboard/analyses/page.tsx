import { redirect } from "next/navigation";

import { AnalysesWorkspace } from "@/components/dashboard/analyses-workspace";
import { StructuredData } from "@/components/structured-data";
import { getSessionUser } from "@/lib/auth/session";
import { buildMetadata, buildWebPageSchema } from "@/lib/seo";
import { FirestoreSavedAnalysisRepository } from "@/services/analysis-firestore.repository";
import { AnalysisWorkspaceService } from "@/services/analysis-workspace.service";

export const metadata = buildMetadata({
  path: "/dashboard/analyses",
  title: "Analises",
  description: "Editor com historico salvo, metricas em tempo real e camada PRO com AI.",
});

const workspaceService = new AnalysisWorkspaceService(
  new FirestoreSavedAnalysisRepository(),
);

export default async function DashboardAnalysesPage() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/login");
  }

  const analyses = await workspaceService.listAnalyses({
    id: sessionUser.uid,
    plan: sessionUser.plan,
  });

  return (
    <>
      <StructuredData
        data={buildWebPageSchema({
          path: "/dashboard/analyses",
          title: "Analises",
          description:
            "Editor com historico salvo, metricas em tempo real e camada PRO com AI.",
        })}
      />
      <AnalysesWorkspace initialAnalyses={analyses} userPlan={sessionUser.plan} />
    </>
  );
}
