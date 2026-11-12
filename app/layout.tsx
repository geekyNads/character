import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Michroma } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const display = Michroma({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} — How guns work`,
  description: "An open-source visual guide to how firearms work: the cycle of fire, cartridges, actions, history and safety.",
  openGraph: { type: "website", siteName: SITE_NAME },
};

export const viewport: Viewport = { themeColor: "#e1e1de", colorScheme: "light" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Before first paint: opt into motion unless the user prefers reduced motion (components/Motion.tsx). */}
        <script dangerouslySetInnerHTML={{ __html: "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('anim')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
