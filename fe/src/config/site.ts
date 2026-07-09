import type { Metadata } from "next";

export const siteConfig = {
  name: "KBK NL DTETI",
  description:
    "Portal profil dosen, bidang riset, publikasi, proyek, dan kegiatan akademik Kelompok Bidang Keahlian DTETI.",
  email: "kbknl.dtetift@ugm.ac.id",
  address:
    "Jl. Grafika No. 2, Sendowo, Sinduadi, Mlati, Sleman, Yogyakarta 55281",
} as const;

export const siteMetadata: Metadata = {
  title: {
    default: "KBK NL DTETI | Riset, Akademik, dan Kolaborasi",
    template: "%s | KBK NL DTETI",
  },
  description: siteConfig.description,
  keywords: [
    "DTETI UGM",
    "kelompok keahlian",
    "riset teknologi informasi",
    "dosen UGM",
    "publikasi akademik",
  ],
  openGraph: {
    title: "KBK NL DTETI",
    description: siteConfig.description,
    type: "website",
    locale: "id_ID",
  },
};
