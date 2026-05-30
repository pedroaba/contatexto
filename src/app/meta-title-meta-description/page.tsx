import { EditorialGuidePage } from "@/components/marketing/editorial-guide-page";
import { buildGuideMetadata } from "@/lib/editorial-guides";

export const metadata = buildGuideMetadata("meta-title-meta-description");

export default function MetaTitleMetaDescriptionPage() {
  return <EditorialGuidePage slug="meta-title-meta-description" />;
}
