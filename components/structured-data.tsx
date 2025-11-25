"use client";

import { useEffect } from "react";

type StructuredDataProps = {
  type: "WebSite" | "Organization" | "Game" | "FAQPage" | "BreadcrumbList";
  data: Record<string, unknown>;
};

export function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    script.id = `structured-data-${type.toLowerCase()}`;
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById(
        `structured-data-${type.toLowerCase()}`,
      );
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [type, data]);

  return null;
}

// Predefined structured data configurations
export function WebsiteStructuredData() {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Quordle Daily",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    description:
      "Free daily word puzzle game where you solve 4 Wordles simultaneously. Brain-training challenges with Quordle and Squares games.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Quordle Daily",
      url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    },
  };

  return <StructuredData type="WebSite" data={websiteData} />;
}

export function OrganizationStructuredData() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Quordle Daily",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    logo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/icon-512.png`,
    description:
      "Quordle Daily offers free daily word puzzle games including Quordle (4 simultaneous Wordles) and Squares (5x5 word search).",
    sameAs: [
      "https://twitter.com/quordledaily",
      "https://github.com/quordle-daily",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "contact@quordle-daily.com",
    },
  };

  return <StructuredData type="Organization" data={organizationData} />;
}

export function GameStructuredData() {
  const gameData = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: "Quordle Daily",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    description:
      "Daily word puzzle game where players solve 4 five-letter words simultaneously. Features Quordle and Squares game modes.",
    gamePlatform: "Web Browser",
    applicationCategory: "Game",
    genre: "Puzzle",
    playMode: "SinglePlayer",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1000",
    },
    provider: {
      "@type": "Organization",
      name: "Quordle Daily",
      url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    },
  };

  return <StructuredData type="Game" data={gameData} />;
}

export function FAQStructuredData({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return <StructuredData type="FAQPage" data={faqData} />;
}

export function BreadcrumbStructuredData({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <StructuredData type="BreadcrumbList" data={breadcrumbData} />;
}
