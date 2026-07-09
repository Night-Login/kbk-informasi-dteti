import type { Metadata } from "next";
import AppLayout from "@/components/layout/app-layout";
import { siteMetadata } from "@/config/site";
import "@/styles/globals.css";

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppLayout>{children}</AppLayout>;
}
