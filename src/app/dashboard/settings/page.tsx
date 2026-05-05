import { SystemPagePlaceholder } from "@/components/system-page-placeholder";
import { StructuredData } from "@/components/structured-data";
import { buildMetadata, buildWebPageSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  path: "/dashboard/settings",
  title: "Configuracoes",
  description: "Area para visualizar as configuracoes principais do sistema.",
});

export default function DashboardSettingsPage() {
  return (
    <>
      <StructuredData
        data={buildWebPageSchema({
          path: "/dashboard/settings",
          title: "Configuracoes",
          description:
            "Area para visualizar as configuracoes principais do sistema.",
        })}
      />
      <SystemPagePlaceholder
        title="Configuracoes"
        path="/dashboard/settings"
      />
    </>
  );
}
