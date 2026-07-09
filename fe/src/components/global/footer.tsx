import { Mail, MapPin } from "lucide-react";
import BrandMark from "@/components/global/brand-mark";

const socialLinks = ["IG", "in", "f", "GH", "TT"];

export default function Footer() {
  return (
    <footer id="contact" className="bg-surface-strong">
      <div className="page-container grid gap-12 py-14 md:grid-cols-[1fr_0.9fr] md:gap-24">
        <div className="max-w-sm">
          <BrandMark />
          <p className="mt-6 text-xs leading-5 text-ink">
            About us: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque fringilla nisl elit, sit amet fermentum nisi consequat
            et. Nam sit amet metus in sem mollis hendrerit eget nec tellus.
            Vestibulum semper fringilla libero.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-ink">Social Media</h2>
          <div className="mt-5 flex flex-wrap gap-4" aria-label="Media sosial">
            {socialLinks.map((label) => (
              <a
                key={label}
                href="#contact"
                aria-label={label}
                className="grid size-9 place-items-center rounded-full bg-ink text-[0.65rem] font-bold text-white hover:bg-muted"
              >
                {label}
              </a>
            ))}
          </div>

          <h2 className="mt-8 text-2xl font-bold text-ink">Contact Us</h2>
          <div className="mt-4 space-y-4 text-sm text-ink">
            <a
              href="mailto:KBKDTETI@mail.ugm.ac.id"
              className="flex items-center gap-3 hover:underline"
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
