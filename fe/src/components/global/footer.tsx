"use client";

import { Mail, MapPin } from "lucide-react";
import { usePathname } from "next/navigation";
import BrandMark from "@/components/global/brand-mark";

const socialLinks = ["IG", "in", "f", "GH", "TT"];

export default function Footer() {
  const pathname = usePathname();
  const isWireframeRoute = [
    "/academic",
    "/research",
    "/research-areas",
    "/tag-research-areas",
  ].some((route) => pathname === route || pathname.startsWith(`${route}/`));

  return (
    <footer
      id="contact"
      className={isWireframeRoute ? "bg-[oklch(0.86_0_0)] text-ink" : "bg-ugm-blue text-white"}
    >
      <div className="page-container grid gap-12 py-14 md:grid-cols-[1fr_0.9fr] md:gap-24">
        <div className="max-w-sm">
          <div
            className={`inline-flex bg-white px-5 py-4 ${
              isWireframeRoute ? "grayscale" : ""
            }`}
          >
            <BrandMark />
          </div>
          <p className={`mt-6 text-xs leading-5 ${isWireframeRoute ? "text-ink" : "text-white"}`}>
            About us: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque fringilla nisl elit, sit amet fermentum nisi consequat
            et. Nam sit amet metus in sem mollis hendrerit eget nec tellus.
            Vestibulum semper fringilla libero.
          </p>
        </div>

        <div>
          <h2 className={`text-2xl font-bold ${isWireframeRoute ? "text-ink" : "text-white"}`}>
            Social Media
          </h2>
          <div className="mt-5 flex flex-wrap gap-4" aria-label="Media sosial">
            {socialLinks.map((label) => (
              <a
                key={label}
                href="#contact"
                aria-label={label}
                className={`grid size-9 place-items-center rounded-full text-[0.65rem] font-bold ${
                  isWireframeRoute
                    ? "bg-ink text-white hover:bg-muted"
                    : "bg-white text-ugm-blue hover:bg-ugm-yellow hover:text-ugm-black"
                }`}
              >
                {label}
              </a>
            ))}
          </div>

          <h2 className={`mt-8 text-2xl font-bold ${isWireframeRoute ? "text-ink" : "text-white"}`}>
            Contact Us
          </h2>
          <div className={`mt-4 space-y-4 text-sm ${isWireframeRoute ? "text-ink" : "text-white"}`}>
            <a
              href="mailto:KBKDTETI@mail.ugm.ac.id"
              className={`flex items-center gap-3 hover:underline ${
                isWireframeRoute ? "hover:text-ink" : "hover:text-ugm-yellow"
              }`}
            >
              <Mail size={18} aria-hidden="true" />
              KBKDTETI@mail.ugm.ac.id
            </a>
            <p className="flex items-start gap-3 leading-5">
              <MapPin className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
              <span>
                Jl. Grafika No. 2, Sendowo, Sinduadi, Kec. Mlati, Kab. Sleman,
                Daerah Istimewa Yogyakarta 55281
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
