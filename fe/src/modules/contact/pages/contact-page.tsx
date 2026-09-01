"use client";

import Breadcrumbs from "@/components/global/breadcrumbs";
import { siteConfig } from "@/config/site";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import type { FormEvent } from "react";

function Field({
  id,
  label,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label
      className="grid gap-2 text-sm font-medium text-white/90"
      htmlFor={id}
    >
      {label}
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        className="min-h-10 border border-white/40 bg-dteti-blue px-3 text-white outline-none placeholder:text-white focus:border-dteti-yellow"
      />
    </label>
  );
}

export default function ContactPage() {
  const settings = useSiteSettings();
  const email = settings.contact_email || siteConfig.email;
  const address = settings.contact_address || siteConfig.address;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const senderEmail = String(form.get("email") || "").trim();
    const subject = String(
      form.get("subject") || "Message from the website",
    ).trim();
    const message = String(form.get("message") || "").trim();
    const body = [`Name: ${name}`, `Email: ${senderEmail}`, "", message].join(
      "\n",
    );
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <main id="main-content" className="bg-white pt-16 text-ink sm:pt-20">
      <section className="page-container pb-10 pt-12">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        />
        <h1 className="text-center text-[clamp(2rem,5vw,3rem)] font-extrabold tracking-[-0.03em] text-dteti-blue">
          Contact Us
        </h1>

        <div className="mx-auto mt-10 grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <form
            onSubmit={handleSubmit}
            className="brand-gradient rounded-xl px-6 py-8 text-white sm:px-12"
          >
            <h2 className="text-2xl font-bold">Send us a message</h2>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <Field id="name" label="Full name" placeholder="Name" />
              <Field
                id="email"
                label="Email"
                placeholder="Email"
                type="email"
              />
            </div>

            <div className="mt-6">
              <Field id="subject" label="Subject" placeholder="Subject" />
            </div>

            <label
              className="mt-6 grid gap-2 text-sm font-medium text-white/90"
              htmlFor="message"
            >
              Message
              <textarea
                id="message"
                name="message"
                placeholder="Message"
                rows={6}
                className="resize-y border border-white/40 bg-dteti-blue px-3 py-3 text-white outline-none placeholder:text-white focus:border-dteti-yellow"
              />
            </label>

            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                className="min-h-10 rounded-md bg-dteti-yellow px-7 text-sm font-extrabold text-dteti-ink transition-colors hover:bg-dteti-yellow/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dteti-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-dteti-blue cursor-pointer"
              >
                Submit
              </button>
            </div>
          </form>

          <aside className="flex flex-col justify-between rounded-xl border border-line bg-surface p-7 sm:p-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-dteti-blue/70">
                Direct contact
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-0.02em] text-dteti-blue">
                Visit or write to us
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted">
                Contact details on this page follow the values maintained in the
                admin dashboard.
              </p>

              <div className="mt-8 space-y-5">
                {/* Email Card */}
                <a
                  href={`mailto:${email}`}
                  className="flex gap-4 rounded-xl border border-line bg-white p-5 hover:border-dteti-blue transition-colors"
                >
                  <span className="grid size-11 flex-none place-items-center bg-dteti-yellow text-dteti-ink">
                    <Mail size={20} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-bold uppercase tracking-wider text-muted">
                      Email
                    </span>
                    <span className="mt-1 block break-words text-sm font-bold text-dteti-blue">
                      {email}
                    </span>
                  </span>
                </a>

                {/* Address Card (Exact Same UI as Email Card) */}
                <a
                  href="https://www.google.com/maps/place/Jl.+Grafika+Jl.+Kesehatan+Sendowo+No.2,+Sendowo,+Sinduadi,+Kec.+Mlati,+Kabupaten+Sleman,+Daerah+Istimewa+Yogyakarta+55281/@-7.7653291,110.3718646,17z/data=!3m1!4b1!4m6!3m5!1s0x2e7a584d8de1e7d5:0x1b7fcb6deb0c34d7!8m2!3d-7.7653344!4d110.3744449!16s%2Fg%2F11rcwlymw5?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-4 rounded-xl border border-line bg-white p-5 hover:border-dteti-blue transition-colors"
                >
                  <span className="grid size-11 flex-none place-items-center bg-dteti-yellow text-dteti-ink">
                    <MapPin size={20} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-bold uppercase tracking-wider text-muted">
                      Address
                    </span>
                    <span className="mt-1 block break-words text-sm font-bold text-dteti-blue">
                      {address}
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
