import { PublicationPage } from "@/modules/publication";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ lecturer?: string | string[] }>;
}) {
    const params = await searchParams;
    const lecturer = Array.isArray(params.lecturer) ? params.lecturer[0] : params.lecturer;

    return <PublicationPage initialLecturer={lecturer || ""} />;
}
