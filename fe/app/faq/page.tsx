import type { Metadata } from "next";
import FaqPage from "@/modules/academic/pages/faq-page";

export const metadata: Metadata = {
  title: "FAQ | Information Engineering Research Group",
  description: "Frequently asked questions about academic study and contacting DTETI supervisors.",
};

export default function Page() {
  return <FaqPage />;
}
