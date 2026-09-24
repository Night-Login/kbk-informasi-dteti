"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { InstagramIcon, FacebookIcon, YoutubeIcon } from '@/components/global/social-icons';
import SearchModal from "@/components/global/search-modal";
import { siteAboutInEnglish } from "@/config/site";

export const discoveryLinks = [
  { label: "Home", href: "/" },
  { label: "Research", href: "/research" },
  { label: "People", href: "/people" },
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "About", href: "/#about" },
];

export function DiscoveryHeader({ home }: { home: boolean }) {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 80);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); setSearch((open) => !open);
      }
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); };
  }, []);
  return <>
    {!home && <div className="discovery-header-spacer" aria-hidden="true" />}
    <header className={`discovery-header ${home ? "discovery-header-home" : ""} ${scrolled ? "discovery-header-scrolled" : ""}`}>
      <Link href="/" aria-label="UGM — Home" className="discovery-logo">
        <Image src="/images/ugm-mark-white.png" alt="Universitas Gadjah Mada" width={80} height={86} priority />
      </Link>
      <nav className="discovery-desktop-nav" aria-label="Main navigation">
        {discoveryLinks.map((link) => <Link key={link.label} href={link.href} aria-current={(home && link.href === "/") || (!home && link.href === "/events") ? "page" : undefined}>{link.label}</Link>)}
      </nav>
      <div className="discovery-header-actions">
        <button className="discovery-icon-button" onClick={() => setSearch(true)} aria-label="Search website"><Search size={22} /></button>
        <button className="discovery-icon-button discovery-menu-toggle" onClick={() => setMenu(!menu)} aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu} aria-controls="discovery-menu">{menu ? <X /> : <Menu />}</button>
      </div>
      {menu && <nav id="discovery-menu" className="discovery-mobile-nav" aria-label="Mobile navigation">{discoveryLinks.map((link) => <Link key={link.label} href={link.href} onClick={() => setMenu(false)}>{link.label}</Link>)}</nav>}
    </header>
    <SearchModal isOpen={search} onClose={() => setSearch(false)} />
  </>;
}

export function DiscoveryFooter({ settings }: { settings: Record<string, string> }) {
  const email = settings.contact_email || "teti@ugm.ac.id";
  const social = [
    { name: "Instagram", href: settings.social_instagram_url || "https://www.instagram.com/dtetiugm/", Icon: InstagramIcon },
    { name: "Facebook", href: settings.social_facebook_url || "https://web.facebook.com/DTETIFTUGM", Icon: FacebookIcon },
    { name: "YouTube", href: settings.social_youtube_url, Icon: YoutubeIcon },
  ].filter((item) => item.href);
  return <footer className="discovery-footer" id="about">
    <div className="discovery-container discovery-footer-grid">
      <div><h2>{settings.site_name || "Information Engineering Research Group UGM"}</h2><p>{siteAboutInEnglish(settings)}</p></div>
      <nav aria-label="Footer pages"><h2>Pages</h2>{discoveryLinks.map((link) => <Link key={link.label} href={link.href}>{link.label}</Link>)}</nav>
      <div><h2>Social Media</h2><div className="discovery-social">{social.map(({ name, href, Icon }) => <a key={name} href={href} aria-label={name} title={name} target="_blank" rel="noopener noreferrer"><Icon size={22} aria-hidden="true" /></a>)}</div><h2 className="discovery-contact-title">Contact Us</h2><a className="discovery-contact" href={`mailto:${email}`}><Mail size={18} aria-hidden="true" />{email}</a><p className="discovery-contact"><MapPin size={20} aria-hidden="true" />{settings.contact_address || "Jl. Grafika No. 2, Kampus UGM, Yogyakarta 55281"}</p></div>
    </div>
  </footer>;
}
