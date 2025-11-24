import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";
import "./globals.css";
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
    "Play Quordle Daily, the popular word puzzle game where you solve 4 words simultaneously. Powered by AI for endless challenges and daily fun.",
  keywords: [
    "quordle",
    "wordle",
    "word game",
    "puzzle",
    "daily challenge",
    "ai word game",
    "brain training",
    "word puzzle",
  ],
  authors: [{ name: "Quordle Team" }],
  creator: "Quordle Team",
  publisher: "Quordle Team",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Quordle Daily - Solve 4 Wordles at Once",
    description:
      "Challenge your brain with Quordle Daily. Solve 4 five-letter words simultaneously in 9 tries. Powered by AI for unique daily puzzles.",
    siteName: "Quordle Daily",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quordle Daily - Solve 4 Wordles at Once",
    description:
      "Can you solve 4 Wordles at once? Play the daily Quordle challenge now!",
    creator: "@quordle",
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Quordle Daily",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
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
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
