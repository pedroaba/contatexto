import { EditorialGuidePage } from "@/components/marketing/editorial-guide-page";
import { buildGuideMetadata } from "@/lib/editorial-guides";

export const metadata = buildGuideMetadata("contador-de-caracteres");

export default function ContadorDeCaracteresPage() {
  return <EditorialGuidePage slug="contador-de-caracteres" />;
}
