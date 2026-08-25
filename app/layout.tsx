import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { cn } from "@/lib/utils";

import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RootPath | Digital systems, built with intent",
    template: "%s | RootPath",
  },
  description:
    "RootPath builds high-end websites, mobile apps, and enterprise web platforms for teams worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
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
