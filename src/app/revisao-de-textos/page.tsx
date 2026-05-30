import { EditorialGuidePage } from "@/components/marketing/editorial-guide-page";
import { buildGuideMetadata } from "@/lib/editorial-guides";

export const metadata = buildGuideMetadata("revisao-de-textos");

export default function RevisaoDeTextosPage() {
  return <EditorialGuidePage slug="revisao-de-textos" />;
}
