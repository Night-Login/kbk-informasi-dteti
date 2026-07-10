import ResearchDirectory from "@/modules/research/components/research-directory";
import { researchAreas } from "@/modules/research/data/research.data";

export default function ResearchAreasPage() {
  return (
    <ResearchDirectory
      title="Research Areas"
      breadcrumbCurrent="Research Areas"
      searchPlaceholder="Search research area / tag"
      items={researchAreas}
    />
  );
}
