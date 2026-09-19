import { z } from "zod";
import { emptyLocalized, emptySeo, id, localized, localizedOptional, mediaUrl, safeUrl, seo, slug } from "./common";

export const PUBLISH_STATUSES = ["draft", "published", "archived"] as const;

const isoOrEmpty = z.union([z.literal(""), z.iso.datetime()]);
const both = (value: { en: string; ar: string }) => Boolean(value.en && value.ar);

// Whether a post needs event details depends on its category, and categories are data —
// so the schema is built for a given set of event-category ids. The form builds it from
// the categories it was given; the server builds it again from the database.
export const makePostInput = (eventCategoryIds: string[]) => z
  .object({
    slug,
    categoryId: id,
    status: z.enum(PUBLISH_STATUSES),
    // empty + published = publish now; future = scheduled
    publishedAt: isoOrEmpty,
    title: localized(200),
    excerpt: localizedOptional(600),
    body: localizedOptional(200_000),
    authorLabel: localizedOptional(120),
    coverImage: mediaUrl,
    gallery: z.array(mediaUrl).max(40),
    startsAt: isoOrEmpty,
    endsAt: isoOrEmpty,
    venue: localizedOptional(200),
    registrationUrl: safeUrl,
    seo,
  })
  .superRefine((post, ctx) => {
    const need = (ok: boolean, path: string, message: string) => {
      if (!ok) ctx.addIssue({ code: "custom", path: path.split("."), message });
    };
    // Drafts may be half-finished; going live needs both languages.
    if (post.status === "published") {
      need(both(post.excerpt), post.excerpt.en ? "excerpt.ar" : "excerpt.en", "Required in both languages to publish");
      need(both(post.body), post.body.en ? "body.ar" : "body.en", "Required in both languages to publish");
      need(Boolean(post.coverImage), "coverImage", "A cover image is required to publish");
    }
    if (eventCategoryIds.includes(post.categoryId)) {
      need(Boolean(post.startsAt), "startsAt", "Events need a start date");
      need(both(post.venue), post.venue.en ? "venue.ar" : "venue.en", "Events need a venue in both languages");
      need(!post.endsAt || !post.startsAt || post.endsAt >= post.startsAt, "endsAt", "Must be after the start");
    }
  });

/** Shape only — no event rules. Used where the category list isn't known yet. */
export const postInput = makePostInput([]);
export type PostInput = z.infer<typeof postInput>;

export const emptyPost: PostInput = {
  slug: "",
  categoryId: "",
  status: "draft",
  publishedAt: "",
  title: emptyLocalized,
  excerpt: emptyLocalized,
  body: emptyLocalized,
  authorLabel: emptyLocalized,
  coverImage: "",
  gallery: [],
  startsAt: "",
  endsAt: "",
  venue: emptyLocalized,
  registrationUrl: "",
  seo: emptySeo,
};
