import type { Metadata, Viewport } from "next";
import type React from "react";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "Squares - Daily Word Game",
    template: "%s | Squares Daily",
  },
  description:
    "Play Squares, a daily word puzzle game where you find words in a 4x4 grid. Challenge yourself with AI-generated daily puzzles.",
  keywords: [
    "squares",
    "word puzzle",
    "word search",
    "daily puzzle",
    "word game",
    "puzzle game",
    "4x4 grid",
    "word grid",
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
    url: "/squares",
    title: "Squares - Daily Word Game",
    description:
      "Challenge yourself with Squares, a daily 4x4 word search puzzle game. Find as many words as you can!",
    siteName: "Squares Daily",
  },
  twitter: {
    card: "summary_large_image",
    title: "Squares - Daily Word Game",
    description:
      "Find words in a 4x4 grid! Play the daily Squares challenge now.",
    creator: "@quordle",
  },
  icons: {
    icon: [
      { url: "/squares-favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/squares-icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/squares-icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/squares-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/squares-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/squares-apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  applicationName: "Squares Daily",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Squares Daily",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function SquaresLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
