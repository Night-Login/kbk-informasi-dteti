import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/global/button";
import { events } from "@/modules/homepage/data/home.data";

export default function EventsSection() {
  return (
    <section id="events" className="bg-white pb-[clamp(4rem,7vw,6rem)]">
      <div className="page-container">
        <h2 className="text-center text-2xl font-extrabold text-ugm-blue">
          Events
        </h2>

        <div className="mx-auto mt-7 grid max-w-5xl gap-8 md:grid-cols-2">
          {events.map((event, index) => (
            <article
              key={`${event.title}-${index}`}
              className="grid grid-cols-[70px_1fr] items-center gap-5 border border-line bg-surface px-5 py-4"
            >
              <time className="grid h-16 place-items-center bg-ugm-blue text-center text-base font-extrabold leading-5 text-white">
                <span>
                  {event.day}
                  <br />
                  <span className="text-ugm-yellow">{event.month}</span>
                </span>
              </time>
              <div>
                <h3 className="text-base font-extrabold text-ink">
                  {event.title}
                </h3>
                <p className="mt-4 text-xs text-ink">
                  {event.time} <span aria-hidden="true">|</span>{" "}
                  {event.location}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-7 flex justify-center">
          <ButtonLink href="#events" variant="outline" size="sm">
            More Events <ArrowRight size={16} aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
