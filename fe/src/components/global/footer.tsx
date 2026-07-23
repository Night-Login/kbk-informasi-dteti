"use client";

import { usePathname } from "next/navigation";
import { Mail, MapPin } from "lucide-react";
import BrandMark from "@/components/global/brand-mark";

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

function LinkedinIcon({ size = 24, className }: IconProps) {
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
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
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

function GithubIcon({ size = 24, className }: IconProps) {
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
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function TiktokIcon({ size = 24, className }: IconProps) {
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
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedinIcon },
  { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  { label: "GitHub", href: "https://github.com", icon: GithubIcon },
  { label: "TikTok", href: "https://tiktok.com", icon: TiktokIcon },
];

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer id="contact" className="brand-gradient text-white">
      <div className="page-container grid gap-12 py-14 md:grid-cols-[1fr_0.9fr] md:gap-24">
        <div className="max-w-md">
          <BrandMark />
          <p className="mt-6 text-xs leading-5 text-white/90">
            About us : Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque fringilla nisl elit, sit amet fermentum nisi consequat
            et. Nam sit amet metus in sem mollis hendrerit eget nec tellus.
            Vestibulum semper fringilla libe......
          </p>
        </div>

        <div className="md:pl-8 lg:pl-16">
          <h2 className="text-2xl font-bold text-white">Social Media</h2>
          <div className="mt-5 flex flex-wrap items-center gap-6" aria-label="Media sosial">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
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
              href="mailto:KBKDTETI@mail.ugm.ac.id"
              className="flex items-center gap-3 hover:text-dteti-yellow hover:underline"
            >
              <Mail size={18} aria-hidden="true" />
              <span>KBKDTETI@mail.ugm.ac.id</span>
            </a>
            <p className="flex items-start gap-3 leading-5">
              <MapPin className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
              <span>
                Jl. Grafika no.2, Sendowo, Sinduadi, Kec. Mlati, Kab. Sleman,
                Daerah Istimewa Yogyakarta 55281
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
