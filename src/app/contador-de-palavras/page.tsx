import { EditorialGuidePage } from "@/components/marketing/editorial-guide-page";
import { buildGuideMetadata } from "@/lib/editorial-guides";

export const metadata = buildGuideMetadata("contador-de-palavras");

export default function ContadorDePalavrasPage() {
  return <EditorialGuidePage slug="contador-de-palavras" />;
}
