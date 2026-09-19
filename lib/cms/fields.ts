import { z } from "zod";
import { emptyLocalized, emptyLocalizedList, localized, localizedList, localizedOptional, mediaUrl } from "@/lib/schemas/common";

// A section is declared once, as a list of fields. The zod schema, the empty value
// and the CMS form are all derived from it, so they can't drift apart.
// This is NOT a block engine: which sections a page has is fixed in lib/cms/pages.ts.

// hint = always-visible rule under the field · help = "?" tooltip (defaults to lib/cms/help.ts by field name)
type Base = { name: string; label: string; hint?: string; help?: string };

export type FieldDef =
  | (Base & { kind: "text" | "textarea"; required?: boolean; max?: number })
  // basic = bold / italic / lists / links only (descriptions); full adds headings, quotes, images (articles)
  | (Base & { kind: "rich"; basic?: boolean; required?: boolean; max?: number })
  | (Base & { kind: "plain"; max?: number })
  | (Base & { kind: "media"; accept?: string })
  | (Base & { kind: "mediaList" })
  | (Base & { kind: "list" })
  | (Base & { kind: "number"; min?: number; max?: number })
  | (Base & { kind: "date" })
  // options are either fixed here, or `dynamic`: loaded from the database when the form opens
  | (Base & { kind: "choice"; options: { value: string; label: string }[]; multiple?: boolean; dynamic?: "postCategories" })
  | (Base & { kind: "items"; itemLabel: string; fields: FieldDef[]; maxItems?: number });

const defaultMax = { text: 300, textarea: 3000, rich: 200_000 } as const;

function fieldSchema(field: FieldDef): z.ZodType {
  switch (field.kind) {
    case "text":
    case "textarea":
    case "rich": {
      const max = field.max ?? (field.kind === "rich" && field.basic ? 20_000 : defaultMax[field.kind]);
      return field.required ? localized(max) : localizedOptional(max);
    }
    case "plain":
      return z.string().trim().max(field.max ?? 500);
    case "media":
      return mediaUrl;
    case "mediaList":
      return z.array(mediaUrl);
    case "list":
      return localizedList();
    case "number":
      return z.number().min(field.min ?? 0).max(field.max ?? 1_000_000);
    case "date":
      return z.iso.date("Pick a date");
    case "choice": {
      if (field.dynamic) return z.array(z.uuid()).min(1, "Pick at least one");
      const value = z.enum(field.options.map((option) => option.value) as [string, ...string[]]);
      return field.multiple ? z.array(value).min(1, "Pick at least one") : value;
    }
    case "items":
      return z.array(buildSchema(field.fields)).max(field.maxItems ?? 50);
  }
}

export const buildSchema = (fields: FieldDef[]) => z.object(Object.fromEntries(fields.map((field) => [field.name, fieldSchema(field)])));

function emptyField(field: FieldDef): unknown {
  switch (field.kind) {
    case "text":
    case "textarea":
    case "rich":
      return emptyLocalized;
    case "plain":
    case "media":
    case "date":
      return "";
    case "mediaList":
    case "items":
      return [];
    case "list":
      return emptyLocalizedList;
    case "number":
      return field.min ?? 0;
    case "choice":
      if (field.dynamic) return [];
      return field.multiple ? field.options.map((option) => option.value) : field.options[0].value;
  }
}

export const emptyValue = (fields: FieldDef[]): Record<string, unknown> =>
  Object.fromEntries(fields.map((field) => [field.name, emptyField(field)]));

/** Stored data merged over empties, so a section that gains a field still opens cleanly. */
export function withDefaults(fields: FieldDef[], data: unknown): Record<string, unknown> {
  const stored = (data ?? {}) as Record<string, unknown>;
  return Object.fromEntries(
    fields.map((field) => {
      const value = stored[field.name];
      if (value === undefined || value === null) return [field.name, emptyField(field)];
      if (field.kind === "items" && Array.isArray(value)) return [field.name, value.map((item) => withDefaults(field.fields, item))];
      return [field.name, value];
    }),
  );
}

/** Walks a validated section and rewrites every rich-text value (also inside repeaters) — used to sanitise on save. */
export function mapRich(fields: FieldDef[], data: Record<string, unknown>, clean: (html: string, basic: boolean) => string): Record<string, unknown> {
  const out = { ...data };
  for (const field of fields) {
    const value = out[field.name];
    if (field.kind === "rich" && value) {
      const { en, ar } = value as { en: string; ar: string };
      out[field.name] = { en: clean(en, Boolean(field.basic)), ar: clean(ar, Boolean(field.basic)) };
    } else if (field.kind === "items" && Array.isArray(value)) {
      out[field.name] = value.map((item) => mapRich(field.fields, item as Record<string, unknown>, clean));
    }
  }
  return out;
}

/** Legacy plain text (blank line = new paragraph) → the HTML a rich field stores. Already-HTML values pass through. */
export const plainToHtml = (value: string) =>
  !value || value.trimStart().startsWith("<")
    ? value
    : value
        .split(/\n{2,}/)
        .map((paragraph) => `<p>${paragraph.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\n/g, "<br>")}</p>`)
        .join("");
