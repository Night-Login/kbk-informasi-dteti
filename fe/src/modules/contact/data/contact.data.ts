import {
  Building2,
  Globe2,
  Mail,
  MapPin,
} from "lucide-react";

export const contactCards = [
  {
    title: "Email",
    value: "KBKDTETI@mail.ugm.ac.id",
    icon: Mail,
  },
  {
    title: "Address",
    value:
      "Jl. Grafika No. 2, Sendowo, Sinduadi, Kec. Mlati, Kab. Sleman, Daerah Istimewa Yogyakarta 55281",
    icon: Building2,
  },
  {
    title: "Social",
    value: "kbkdteti.xyz",
    icon: Globe2,
  },
] as const;

export const contactSocialLinks = [
  { label: "Instagram", value: "kbkdteti.xyz", short: "IG" },
  { label: "LinkedIn", value: "kbkdteti", short: "in" },
  { label: "Facebook", value: "kbkdteti12345", short: "f" },
  { label: "GitHub", value: "kbkdteti", short: "GH" },
  { label: "TikTok", value: "kbkdteti_", short: "TT" },
] as const;

export const contactAddress = {
  title:
    "Departemen Teknik Elektro dan Teknologi Informasi, Fakultas Teknik Universitas Gadjah Mada",
  lines: [
    "Jl. Grafika No. 2, Sendowo, Sinduadi, Kec. Mlati, Kab. Sleman, Daerah Istimewa Yogyakarta 55281",
  ],
  icon: MapPin,
} as const;
