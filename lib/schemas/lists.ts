import { z } from "zod";
import { localized, mediaUrl, slug } from "./common";

export const faqInput = z.object({
  question: localized(300),
  answer: localized(3000),
  published: z.boolean(),
});

export const partnerInput = z.object({
  name: localized(120),
  logo: mediaUrl,
  url: z.union([z.literal(""), z.url("Must be a full URL (https://…)")]),
});

const key = z.string().trim().min(1, "Key is required").max(60).regex(/^[a-z][a-zA-Z0-9]*$/, "camelCase, letters and numbers only");

export const unitTypeInput = z.object({ key, name: localized(80) });
export const amenityInput = z.object({ key, label: localized(80) });

export const POST_KINDS = ["news", "article", "event"] as const;
// key is the ?category= value in the Media Center URL, so it is slug-shaped
export const postCategoryInput = z.object({ key: slug, name: localized(80), kind: z.enum(POST_KINDS) });
export type PostCategoryInput = z.infer<typeof postCategoryInput>;

export type FaqInput = z.infer<typeof faqInput>;
export type PartnerInput = z.infer<typeof partnerInput>;
export type UnitTypeInput = z.infer<typeof unitTypeInput>;
export type AmenityInput = z.infer<typeof amenityInput>;
