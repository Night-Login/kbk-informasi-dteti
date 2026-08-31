"use client";

import { usePathname } from "next/navigation";
import { Mail, MapPin } from "lucide-react";
import BrandMark from "@/components/global/brand-mark";
import { useSiteSettings } from "@/hooks/use-site-settings";

type IconProps = { size?: number; className?: string };

function InstagramIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" />
    </svg>
  );
}

const socialLinks = [
  {
    label: "Instagram",
    setting: "social_instagram_url",
    href: "https://www.instagram.com/dtetiugm/",
    icon: InstagramIcon,
  },
  {
    label: "YouTube",
    setting: "social_youtube_url",
    href: "https://youtube.com",
    icon: YoutubeIcon,
  },
  {
    label: "Facebook",
    setting: "social_facebook_url",
    href: "https://web.facebook.com/DTETIFTUGM",
    icon: FacebookIcon,
  },
];

export default function Footer() {
  const pathname = usePathname();
  const settings = useSiteSettings(!pathname?.startsWith("/admin"));

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const about =
    settings.footer_about ||
    "Kelompok Keahlian Teknik Informasi DTETI UGM mengembangkan penelitian, pendidikan, dan kolaborasi di bidang sistem cerdas, data, jaringan, serta teknologi informasi.";
  const email = settings.contact_email || "teti@ugm.ac.id";
  const address =
    settings.contact_address ||
    "Jl. Grafika No. 2, Kampus UGM, Yogyakarta 55281";

  return (
    <footer id="contact" className="brand-gradient text-white">
      <div className="page-container grid gap-12 py-14 md:grid-cols-[1fr_0.9fr] md:gap-24">
        <div className="max-w-md">
          <BrandMark />
          <p className="mt-6 text-xs leading-5 text-white/90">{about}</p>
        </div>

        <div className="md:pl-8 lg:pl-16">
          <h2 className="text-2xl font-bold text-white">Social Media</h2>
          <div
            className="mt-5 flex flex-wrap items-center gap-6"
            aria-label="Media sosial"
          >
            {socialLinks.map(({ label, setting, href, icon: Icon }) => (
              <a
                key={label}
                href={settings[setting] ?? href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-white transition-all duration-200 hover:scale-110 hover:text-dteti-yellow"
              >
                <Icon size={34} />
              </a>
            ))}
          </div>

          <h2 className="mt-8 text-2xl font-bold text-white">Contact Us</h2>
          <div className="mt-4 space-y-3 text-sm text-white/90">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 hover:text-dteti-yellow hover:underline"
            >
              <Mail size={18} aria-hidden="true" />
              <span>{email}</span>
            </a>
            <a
              href="https://www.google.com/maps/place/Jl.+Grafika+Jl.+Kesehatan+Sendowo+No.2,+Sendowo,+Sinduadi,+Kec.+Mlati,+Kabupaten+Sleman,+Daerah+Istimewa+Yogyakarta+55281/@-7.7653291,110.3718646,17z/data=!3m1!4b1!4m6!3m5!1s0x2e7a584d8de1e7d5:0x1b7fcb6deb0c34d7!8m2!3d-7.7653344!4d110.3744449!16s%2Fg%2F11rcwlymw5?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 leading-5 hover:text-dteti-yellow transition-colors group"
            >
              <MapPin
                className="mt-0.5 shrink-0 group-hover:text-dteti-yellow transition-colors"
                size={18}
                aria-hidden="true"
              />
              <span>{address}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
