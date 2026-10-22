import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

import {
  OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  SITE_VERIFICATION,
  getJsonLd,
} from "@/lib/seo";
import { cn } from "@/lib/utils";

import "lenis/dist/lenis.css";
import "./globals.css";

export const dynamic = "force-static";

// Space Grotesk and Inter ship the same file whether or not weights are listed, so leaving
// `weight` out only drops the per-weight @font-face rules from the render-blocking CSS.
// JetBrains Mono keeps its list: the full variable range is a larger file than the 400-700 slice.
const display = Space_Grotesk({
  variable: "--font-root-display",
  subsets: ["latin"],
  display: "swap",
});

const body = Inter({
  variable: "--font-root-body",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-root-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#f7f9f8",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  // Google ignores this tag; Bing and some smaller engines still read it.
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  // Only rendered when the build sets a token (see README).
  verification: {
    google: SITE_VERIFICATION.google,
    other: SITE_VERIFICATION.bing
      ? { "msvalidate.01": SITE_VERIFICATION.bing }
      : undefined,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

/**
 * Decides before first paint whether the hero plays its boot intro: once per session, and never for
 * reduced motion or a deep link. It runs inline so a visitor who skips the intro never sees it flash.
 * Without storage (or without JS) the attribute stays unset, which also skips it.
 */
const introScript = `try{var d=document.documentElement,s=sessionStorage;if(matchMedia("(prefers-reduced-motion: reduce)").matches||location.hash||s.getItem("rp-intro")){d.dataset.intro="skip"}else{d.dataset.intro="play";s.setItem("rp-intro","1")}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The intro script sets data-intro on <html> before hydration.
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          display.variable,
          body.variable,
          mono.variable,
          "min-h-[100dvh] overflow-x-hidden bg-background font-sans text-foreground antialiased",
        )}
      >
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getJsonLd()).replace(/</g, "\\u003c"),
          }}
        />
        <div className="min-h-[100dvh]">{children}</div>
      </body>
    </html>
  );
}
