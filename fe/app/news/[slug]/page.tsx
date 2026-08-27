import type { Metadata } from "next";
import NewsDetailPage from "@/modules/updates/pages/news-detail-page";

export const metadata: Metadata = {
  title: "News | Information Engineering Research Group",
  description: "News from the Information Engineering Research Group at DTETI UGM.",
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <NewsDetailPage slug={slug} />;
}
