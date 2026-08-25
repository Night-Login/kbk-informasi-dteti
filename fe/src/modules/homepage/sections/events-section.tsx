import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/global/button";
import type { WebsiteEvent } from "@/lib/api";

function formatEventDate(value: string) {
  const date = new Date(value);
  return {
    day: new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      timeZone: "Asia/Jakarta",
    }).format(date),
    month: new Intl.DateTimeFormat("en-GB", {
      month: "short",
      timeZone: "Asia/Jakarta",
    }).format(date),
    time: `${new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    }).format(date)} WIB`,
  };
}

export default function EventsSection({
  items,
  archiveUrl,
}: {
  items: WebsiteEvent[];
  archiveUrl?: string;
}) {
  return (
    <section id="events" className="bg-white pb-[clamp(4rem,7vw,6rem)]">
      <div className="page-container">
        <h2 className="text-center text-2xl font-extrabold text-dteti-blue">
          Events
        </h2>

        {items.length > 0 ? (
          <div className="mx-auto mt-7 grid max-w-5xl gap-8 md:grid-cols-2">
            {items.map((event) => {
              const date = formatEventDate(event.starts_at);

              return (
                <article
                  key={event.id}
                  className="brand-gradient grid grid-cols-[70px_1fr] items-center gap-5 px-5 py-4 text-white"
                >
                  <time dateTime={event.starts_at} className="grid h-16 place-items-center bg-dteti-yellow text-center text-base font-extrabold leading-5 text-dteti-ink">
                    <span>
                      {date.day}
                      <br />
                      {date.month}
                    </span>
                  </time>
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      {event.link_url ? (
                        <Link href={event.link_url} className="hover:underline">
                          {event.title}
                        </Link>
                      ) : event.title}
                    </h3>
                    <p className="mt-4 text-xs text-white/90">
                      {date.time} <span aria-hidden="true">|</span>{" "}
                      {event.location}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="mx-auto mt-7 max-w-xl border border-line bg-surface px-6 py-8 text-center text-sm text-muted">
            Upcoming seminars, discussions, and academic events will appear here.
          </p>
        )}

        {archiveUrl ? (
          <div className="mt-7 flex justify-center">
            <ButtonLink href={archiveUrl} variant="outline" size="sm">
              More Events <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}
