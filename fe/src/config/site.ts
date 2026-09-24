import type { Metadata } from "next";

export const englishGroupDescription = "The Information Engineering Research Group at DTETI UGM advances research, education, and collaboration in intelligent systems, data, networks, and information technology.";

// Translate the legacy seeded default while preserving custom editorial copy.
export function siteAboutInEnglish(settings: Record<string, string>) {
  const legacyDefault = "Kelompok Keahlian Teknik Informasi DTETI UGM mengembangkan penelitian, pendidikan, dan kolaborasi di bidang sistem cerdas, data, jaringan, serta teknologi informasi.";
  return settings.footer_about_en || (settings.footer_about && settings.footer_about !== legacyDefault ? settings.footer_about : englishGroupDescription);
}

export const siteConfig = {
  name: "KBK Informasi",
  description:
    "KBK Informasi — Information Engineering Research Group UGM. Explore researchers, research areas, publications, projects, news, and events from the Information Engineering Research Group at DTETI, Universitas Gadjah Mada.",
  email: "kbknl.dtetift@ugm.ac.id",
  address:
    "Jl. Grafika No. 2, Sendowo, Sinduadi, Mlati, Sleman, Yogyakarta 55281",
} as const;

export const siteMetadata: Metadata = {
  title: {
    default: "KBK Informasi - Information Engineering Research Group UGM",
    template: "%s | KBK Informasi UGM",
  },
  description: siteConfig.description,
  keywords: [
    "KBK Informasi",
    "Information Engineering Research Group UGM",
    "Universitas Gadjah Mada",
    "DTETI UGM",
    "research group",
    "information engineering research",
    "UGM researchers",
    "academic publications",
  ],
  openGraph: {
    title: "KBK Informasi - Information Engineering Research Group UGM",
    siteName: "KBK Informasi",
    description: siteConfig.description,
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary",
    title: "KBK Informasi - Information Engineering Research Group UGM",
    description: siteConfig.description,
  },
};
