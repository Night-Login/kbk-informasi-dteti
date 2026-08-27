import type { Metadata } from "next";
import EventsPage from "@/modules/updates/pages/events-page";

export const metadata: Metadata = {
  title: "Events | Information Engineering Research Group",
  description: "Academic events from the Information Engineering Research Group.",
};

export default function Page() {
  return <EventsPage />;
}
