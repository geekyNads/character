import type { Metadata, Viewport } from "next";
import { Big_Shoulders, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

// next/font downloads at build time and self-hosts WOFF2 (Latin subset), no layout shift.
const display = Big_Shoulders({ subsets: ["latin"], adjustFontFallback: false, variable: "--font-display" });
const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} — How guns work`,
  description: "An open-source, interactive guide to how firearms work: the cycle of fire, the cartridge, actions, history and safety.",
  openGraph: { type: "website", siteName: SITE_NAME },
};

export const viewport: Viewport = { themeColor: "#121214", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
