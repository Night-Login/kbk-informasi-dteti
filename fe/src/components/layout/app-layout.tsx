import { Public_Sans } from "next/font/google";
import Footer from "@/components/global/footer";
import Navbar from "@/components/global/navbar";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

type AppLayoutProps = Readonly<{ children: React.ReactNode }>;

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <html lang="en" className={publicSans.variable}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
