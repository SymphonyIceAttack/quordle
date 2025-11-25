import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Quordle Daily - Solve 4 Wordles at Once",
    template: "%s | Quordle Daily",
  },
  description:
    "Play Quordle Daily, the popular word puzzle game where you solve 4 words simultaneously. Free daily puzzles with brain-training challenges.",
  keywords: [
    "quordle",
    "wordle",
    "word game",
    "word puzzle",
    "puzzle",
    "daily challenge",
    "brain training",
    "free word game",
    "online puzzle",
    "vocabulary game",
    "word search",
    "squares game",
  ],
  authors: [{ name: "Quordle Daily Team", url: "https://quordle-daily.com" }],
  creator: "Quordle Daily Team",
  publisher: "Quordle Daily",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/sitemap.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Quordle Daily - Solve 4 Wordles at Once",
    description:
      "Challenge your brain with Quordle Daily. Solve 4 five-letter words simultaneously in 9 tries. Free daily puzzles!",
    siteName: "Quordle Daily",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Quordle Daily - Word Puzzle Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@quordledaily",
    creator: "@quordledaily",
    title: "Quordle Daily - Solve 4 Wordles at Once",
    description:
      "Can you solve 4 Wordles at once? Play the daily Quordle challenge now!",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  applicationName: "Quordle Daily",
  category: "games",
  classification: "Word Puzzle Game",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Quordle Daily",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "twitter:domain": "quordle-daily.com",
    "og:site_name": "Quordle Daily",
    "og:type": "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f59e0b",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
