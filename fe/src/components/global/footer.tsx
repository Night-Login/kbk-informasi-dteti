"use client";

import { usePathname } from "next/navigation";
import { Mail, MapPin } from "lucide-react";
import BrandMark from "@/components/global/brand-mark";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { siteAboutInEnglish } from "@/config/site";
import { DiscoveryFooter } from "@/modules/homepage/components/discovery-shell";

import { InstagramIcon, FacebookIcon, YoutubeIcon } from './social-icons';

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

  if (pathname === "/" || pathname === "/events") return <DiscoveryFooter settings={settings} />;

  const about = siteAboutInEnglish(settings);
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
            aria-label="Social media"
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
