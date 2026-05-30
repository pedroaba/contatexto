import { EditorialGuidePage } from "@/components/marketing/editorial-guide-page";
import { buildGuideMetadata } from "@/lib/editorial-guides";

export const metadata = buildGuideMetadata("tempo-de-leitura");

export default function TempoDeLeituraPage() {
  return <EditorialGuidePage slug="tempo-de-leitura" />;
}
