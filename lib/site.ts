import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

// Absolute URLs (canonical, hreflang, Open Graph, JSON-LD) need the real origin.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/**
 * canonical + hreflang for a locale-less path ("/media/news"). Every language version
 * points at all the others and at itself, and x-default goes to the default locale.
 */
export function alternatesFor(locale: string, path: string, query = ""): Metadata["alternates"] {
  const url = (l: string) => `/${l}${path === "/" ? "" : path}${query}`;
  return {
    canonical: url(locale),
    languages: { ...Object.fromEntries(routing.locales.map((l) => [l, url(l)])), "x-default": url(routing.defaultLocale) },
  };
}

export type Crumb = { name: string; path: string };

/** schema.org BreadcrumbList — the same trail the visible breadcrumb shows. */
export const breadcrumbJsonLd = (locale: string, crumbs: Crumb[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: `${SITE_URL}/${locale}${crumb.path === "/" ? "" : crumb.path}`,
  })),
});
