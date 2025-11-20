import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    typedEnv: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "symcloud.top",
      },
      {
        protocol: "https",
        hostname: "**", // Allow all HTTPS domains
      },
    ],
  },
  turbopack: {
    resolveAlias:
      process.env.NEXT_PUBLIC_DEV_MODE !== "development"
        ? {
            "@/lib/ai-wordpool": "./lib/ai-wordpool.cloudflare.ts",
            "@/lib/squares-wordpool": "./lib/squares-wordpool.cloudflare.ts",
          }
        : {},
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();
