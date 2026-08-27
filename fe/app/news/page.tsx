import type { Metadata } from "next";
import NewsPage from "@/modules/updates/pages/news-page";

export const metadata: Metadata = {
  title: "News | Information Engineering Research Group",
  description: "Latest news and research updates from the Information Engineering Research Group.",
};

export default function Page() {
  return <NewsPage />;
}
