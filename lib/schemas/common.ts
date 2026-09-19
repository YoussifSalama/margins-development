import { z } from "zod";

// Shared by client forms and server functions — one schema, validated twice.

export const LOCALES = ["en", "ar"] as const;
export type Locale = (typeof LOCALES)[number];
export type Localized = Record<Locale, string>;

const text = (max: number) => z.string().trim().max(max, "Too long");

/** Both languages required. */
export const localized = (max = 255) =>
  z.object({ en: text(max).min(1, "English is required"), ar: text(max).min(1, "Arabic is required") });

/** Both languages optional (drafts, secondary fields). */
export const localizedOptional = (max = 2000) => z.object({ en: text(max), ar: text(max) });

export const localizedList = (max = 500) => z.object({ en: z.array(text(max)), ar: z.array(text(max)) });

export const emptyLocalized = { en: "", ar: "" };
export const emptyLocalizedList = { en: [] as string[], ar: [] as string[] };

export const slug = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and dashes only");

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const mediaUrl = z.string().trim().max(1000);

export const seo = z.object({
  title: localizedOptional(70),
  description: localizedOptional(200),
  keywords: localizedList(60),
  ogImage: mediaUrl.nullable(),
});
export const emptySeo: z.infer<typeof seo> = {
  title: emptyLocalized,
  description: emptyLocalized,
  keywords: emptyLocalizedList,
  ogImage: null,
};

export const id = z.uuid();
export const orderedIds = z.array(id);

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };
