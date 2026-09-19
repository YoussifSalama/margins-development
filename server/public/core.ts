import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { db } from "@/server/db";
import type { Localized } from "@/server/db/types";
import { pageDefs } from "@/lib/cms/pages";
import { withDefaults, type FieldDef } from "@/lib/cms/fields";
import type { Locale, Site } from "@/lib/content";

// ─── caching ─────────────────────────────────────────────────────────────────
// Two layers: unstable_cache across requests (busted by the tags the CMS actions emit),
// React cache within one request (so generateMetadata + the page share a single load).
// Payloads must be JSON-safe — dates are ISO strings by the time they get here.
export function cachedLoader<Args extends (string | number | undefined)[], R>(name: string, tags: string[], load: (...args: Args) => Promise<R>) {
  return cache((...args: Args): Promise<R> =>
    unstable_cache(() => load(...args), [name, ...args.map(String)], { tags, revalidate: 300 })(),
  );
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
        case "text":
        case "textarea":
        case "rich":
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
