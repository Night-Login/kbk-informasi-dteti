import ResearchPage from "@/modules/research";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ cluster?: string | string[]; view?: string | string[] }>;
}) {
  const { cluster, view } = await searchParams;
  const initialCluster = typeof cluster === "string" ? cluster : "";
  return <ResearchPage key={JSON.stringify([initialCluster, view])} initialCluster={initialCluster} />;
}
