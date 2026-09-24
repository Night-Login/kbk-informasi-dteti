"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const drawer = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!menu) { drawer.current?.close(); return; }
    const previousOverflow = document.body.style.overflow;
    drawer.current?.showModal();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [menu]);
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
    <header className={`discovery-header ${home ? "discovery-header-home" : ""}`}>
      <Link href="/" aria-label="UGM — Home" className="discovery-logo">
        <Image src="/images/ugm-mark-white.png" alt="Universitas Gadjah Mada" width={80} height={86} priority />
      </Link>
      <nav className="discovery-desktop-nav" aria-label="Main navigation">
        {discoveryLinks.map((link) => <Link key={link.label} href={link.href} aria-current={(home && link.href === "/") || (!home && link.href === "/events") ? "page" : undefined}>{link.label}</Link>)}
      </nav>
      <div className="discovery-header-actions">
        <button className="discovery-icon-button" onClick={() => setSearch(true)} aria-label="Search website"><Search size={22} /></button>
        <button className="discovery-icon-button discovery-menu-toggle" onClick={() => setMenu(true)} aria-label="Open menu" aria-expanded={menu} aria-controls="discovery-menu"><Menu /></button>
      </div>
    </header>
    <dialog ref={drawer} id="discovery-menu" className="discovery-nav-drawer" aria-label="Site navigation" onCancel={() => setMenu(false)} onClick={(event) => { if (event.target === event.currentTarget) setMenu(false); }}>
      <div className="discovery-nav-panel">
        <div className="discovery-nav-tools"><button className="discovery-icon-button" onClick={() => setMenu(false)} aria-label="Close menu"><X /></button></div>
        <nav aria-label="Expanded navigation">{discoveryLinks.map((link) => <Link key={link.label} href={link.href} aria-current={(home && link.href === "/") || (!home && link.href === "/events") ? "page" : undefined} onClick={() => setMenu(false)}>{link.label}</Link>)}</nav>
      </div>
    </dialog>
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
