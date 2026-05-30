import { EditorialGuidePage } from "@/components/marketing/editorial-guide-page";
import { buildGuideMetadata } from "@/lib/editorial-guides";

export const metadata = buildGuideMetadata("legendas-redes-sociais");

export default function LegendasRedesSociaisPage() {
  return <EditorialGuidePage slug="legendas-redes-sociais" />;
}
