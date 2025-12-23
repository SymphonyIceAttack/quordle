import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/squares",
        "/about",
        "/contact",
        "/privacy-policy",
        "/terms-of-service",
        "/sitemap.xml",
        "/robots.txt",
      ],
      disallow: ["/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
