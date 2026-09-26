"use client";

import DiscoveryPageHero from "@/components/global/discovery-page-hero";
import { siteConfig } from "@/config/site";
import { useSiteSettings } from "@/hooks/use-site-settings";
import SupervisorGuide from "@/modules/about/components/supervisor-guide";
import type { FormEvent } from "react";

function FormField({
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
    <label htmlFor={id} className="grid gap-2 text-sm">
      {label}
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required
        className="min-h-10 bg-white/65 px-3 text-[#151729] outline-none placeholder:text-[#595959] focus-visible:ring-2 focus-visible:ring-[#595959]"
      />
    </label>
  );
}

export default function AboutPage() {
  const settings = useSiteSettings();
  const email = settings.contact_email || siteConfig.email;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const senderEmail = String(form.get("email") || "").trim();
    const subject = String(form.get("subject") || "Message from the website").trim();
    const message = String(form.get("message") || "").trim();
    const body = [`Name: ${name}`, `Email: ${senderEmail}`, "", message].join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <main id="main-content" className="min-h-screen bg-white text-[#151729]">
      <DiscoveryPageHero title="About" imageSrc="/images/about-hero.png" />

      <div className="mx-auto grid w-[90%] max-w-[1296px] gap-12 py-12 sm:py-14">
        <SupervisorGuide headingId="supervisor-guide-primary" />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,669px)] lg:items-start">
          <SupervisorGuide headingId="supervisor-guide-contact" />

          <form
            onSubmit={handleSubmit}
            className="rounded-lg bg-[#d9d9d9] p-5"
            aria-labelledby="about-message-heading"
          >
            <h2 id="about-message-heading" className="text-2xl font-semibold">Send us a message</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <FormField id="name" label="Full name" placeholder="Name" />
              <FormField id="email" label="Email" placeholder="Email" type="email" />
            </div>
            <div className="mt-5">
              <FormField id="subject" label="Subject" placeholder="Subject" />
            </div>
            <label htmlFor="message" className="mt-5 grid gap-2 text-sm">
              Message
              <textarea
                id="message"
                name="message"
                placeholder="Message"
                rows={5}
                required
                className="resize-y bg-white/65 px-3 py-3 text-[#151729] outline-none placeholder:text-[#595959] focus-visible:ring-2 focus-visible:ring-[#595959]"
              />
            </label>
            <div className="mt-5 flex justify-center">
              <button
                type="submit"
                className="min-h-10 rounded-lg bg-[#595959] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#151729] focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
