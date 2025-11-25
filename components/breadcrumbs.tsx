"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { BreadcrumbStructuredData } from "@/components/structured-data";

type BreadcrumbItem = {
  name: string;
  url: string;
};

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              <Link
                href={item.url}
                className="hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
      <BreadcrumbStructuredData
        items={[{ name: "Home", url: "/" }, ...items]}
      />
    </>
  );
}
