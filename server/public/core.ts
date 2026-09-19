import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { db } from "@/server/db";
import type { Localized } from "@/server/db/types";
import { pageDefs } from "@/lib/cms/pages";
import { withDefaults, type FieldDef } from "@/lib/cms/fields";
import type { Locale, Site } from "@/lib/content";
import { cleanHtml } from "@/server/html";
import { SITE_URL } from "@/lib/site";

// ─── caching ─────────────────────────────────────────────────────────────────
// Two layers: unstable_cache across requests (busted by the tags the CMS actions emit),
// React cache within one request (so generateMetadata + the page share a single load).
// Payloads must be JSON-safe — dates are ISO strings by the time they get here.
//
// Arguments come straight from URLs, and every distinct argument list is its own cache entry
// and its own database round trip. So they are normalised BEFORE they become a key: locale →
// en|ar, numbers → a small allowed set, slugs → slug-shaped or rejected. Without this, requests
// for ?page=1…10^9 or random slugs would mint unlimited entries and queries.
export const LIMITS = [4, 5, 6, 8, 9, 10, 12, 16, 20, 24];
export const validSlug = (value: unknown): value is string => typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 140;
export const validPage = (value: unknown) => (Number.isInteger(value) && (value as number) >= 1 && (value as number) <= 500 ? (value as number) : undefined);

function normalise(arg: string | number | undefined, index: number): string | number | undefined | null {
  if (index === 0) return asLocale(arg as string);
  if (arg === undefined) return undefined;
  if (typeof arg === "number") return LIMITS.includes(arg) ? arg : validPage(arg); // a limit from the list, or a sane page number
  return validSlug(arg) ? arg : null; // null = not slug-shaped → can't exist
}

export function cachedLoader<Args extends (string | number | undefined)[], R>(name: string, tags: string[], load: (...args: Args) => Promise<R>) {
  return cache((...raw: Args): Promise<R> => {
    const args = raw.map(normalise);
    // a malformed slug can't match anything: answer "not found" without a query or a cache entry
    if (args.includes(null)) return Promise.resolve(null as R);
    return unstable_cache(() => load(...(args as Args)), [name, ...args.map(String)], { tags, revalidate: 300 })();
  });
}

// ─── media ───────────────────────────────────────────────────────────────────
// next/image throws for a host it wasn't configured for, so one pasted link could take a page
// down. Only hosts the site is set up to show get through; anything else becomes "" and the
// component falls back to its default picture.
const mediaHosts = new Set(
  ["images.unsplash.com", process.env.CLOUDFLARE_PUBLIC_URL && new URL(process.env.CLOUDFLARE_PUBLIC_URL).hostname, new URL(SITE_URL).hostname]
    .filter((host): host is string => Boolean(host)),
);
const isStream = (host: string) => host.endsWith(".cloudflarestream.com"); // background videos, not next/image

export function media(value: string | null | undefined): string {
  if (!value) return "";
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (mediaHosts.has(url.hostname) || isStream(url.hostname)) ? url.href : "";
  } catch {
    return "";
  }
}

// ─── language ────────────────────────────────────────────────────────────────

export const asLocale = (value: string | null | undefined): Locale => (value === "ar" ? "ar" : "en");
export const pick = (value: Localized | null | undefined, locale: Locale) => value?.[locale] ?? "";

const intlLocale = { en: "en-GB", ar: "ar-EG" } as const;
export const formatDate = (value: Date | string | null | undefined, locale: Locale) =>
  value ? new Intl.DateTimeFormat(intlLocale[locale], { day: "numeric", month: "long", year: "numeric" }).format(new Date(value)) : "";

/** { en, ar } pairs → one language, following the section's field definitions (repeaters included). */
function localizeFields(fields: FieldDef[], data: Record<string, unknown>, locale: Locale): Record<string, unknown> {
  return Object.fromEntries(
    fields.map((field) => {
      const value = data[field.name];
      switch (field.kind) {
        case "media":
          return [field.name, media(value as string)];
        case "mediaList":
          return [field.name, ((value as string[]) ?? []).map(media).filter(Boolean)];
        case "rich":
          // sanitised on save already; cleaned again here so HTML that reached the database any
          // other way (seed, import, a direct write) still can't run in a visitor's browser
          return [field.name, cleanHtml(pick(value as Localized, locale), Boolean(field.basic))];
        case "text":
        case "textarea":
          return [field.name, pick(value as Localized, locale)];
        case "list":
          return [field.name, (value as Record<Locale, string[]> | undefined)?.[locale] ?? []];
        case "items":
          return [field.name, ((value as Record<string, unknown>[]) ?? []).map((item) => localizeFields(field.fields, item, locale))];
        default:
          return [field.name, value];
      }
    }),
  );
}

/**
 * Every section of a CMS page, in one language. Sections that were never saved come back
 * as empty values (not undefined), so a page can render before an editor has touched it.
 */
export async function loadSections(page: string, locale: Locale): Promise<Record<string, Record<string, unknown>>> {
  const def = pageDefs[page];
  const rows = await db.pageSections.find({ page }).toArray();
  return Object.fromEntries(
    Object.entries(def.sections).map(([key, section]) => {
      const stored = rows.find((row) => row.section === key)?.data;
      return [key, localizeFields(section.fields, withDefaults(section.fields, stored), locale)];
    }),
  );
}

// ─── site-wide data (nav, footer, contact, socials) ──────────────────────────

export async function loadSite(locale: Locale): Promise<Site> {
  const s = await loadSections("settings", locale);
  const contact = s.contact as Site["contact"];
  const footer = s.footer as Site["footer"];
  const organization = s.organization as { legalName: string; logo: string; shareImage: string };
  return {
    brand: organization.legalName || "Margins",
    logo: organization.logo || "/brand/logo.png",
    shareImage: organization.shareImage || "",
    contact: { phone: contact.phone, whatsapp: contact.whatsapp, email: contact.email, address: contact.address, mapUrl: contact.mapUrl },
    socials: ((s.socials.items as { platform: string; url: string }[]) ?? []).filter((social) => social.url),
    footer: { ctaHeading: footer.ctaHeading, ctaMedia: footer.ctaMedia, newsletterDisclaimer: footer.newsletterDisclaimer, copyright: footer.copyright },
  };
}

/** For the layout (nav + footer), which can't receive a page's payload. Same data, same cache tag. */
export const getSite = cachedLoader("site", ["page:settings"], (locale: string) => loadSite(asLocale(locale)));
