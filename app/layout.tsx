import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { cn } from "@/lib/utils";

import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const themeScript = `(() => {
  try {
    const storedTheme = window.localStorage.getItem("rootpath-theme");
    document.documentElement.dataset.theme = storedTheme === "dark" ? "dark" : "light";
  } catch {}
})();`;

export const metadata: Metadata = {
  title: {
    default: "RootPath | Small-team digital engineering",
    template: "%s | RootPath",
  },
  description:
    "RootPath is a lean digital engineering team for web, mobile, cloud, and technical strategy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={cn(
          geist.variable,
          "min-h-[100dvh] overflow-x-hidden bg-background font-sans text-foreground antialiased",
        )}
      >
        <div className="min-h-[100dvh]">{children}</div>
      </body>
    </html>
  );
}
