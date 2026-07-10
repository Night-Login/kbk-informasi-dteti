import ResearchDirectory from "@/modules/research/components/research-directory";
import { tagResearchAreas } from "@/modules/research/data/research.data";

export default function TagResearchAreasPage() {
  return (
    <ResearchDirectory
      title="Tag Research Areas"
      breadcrumbCurrent="Tag Research Areas"
      searchPlaceholder="Search tag / research area"
      items={tagResearchAreas}
    />
  );
}
