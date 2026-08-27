import type { Metadata } from "next";
import ScholarshipsPage from "@/modules/academic/pages/scholarships-page";

export const metadata: Metadata = {
  title: "Scholarships | Information Engineering Research Group",
  description: "Scholarship and funding opportunities for master’s and doctoral students at DTETI UGM.",
};

export default function Page() {
  return <ScholarshipsPage />;
}
