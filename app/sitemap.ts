import type { MetadataRoute } from "next";
import { db } from "@/server/db";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

// Built from the CMS on request: every static page, every published project, every Media Center
// category and live post, every open job — in both languages, each entry pointing at its
// translation (hreflang). Nothing is listed by hand, so a new project or post is picked up by itself.
// ponytail: one file is fine up to 50,000 URLs; switch to generateSitemaps() long before that.
export const revalidate = 3600;

const staticPaths = ["/", "/about", "/projects", "/media", "/careers", "/calculator", "/contact", "/privacy"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [projects, categories, posts, jobs] = await Promise.all([
    db.projects.find({ status: "published" }, { projection: { slug: 1, updatedAt: 1 } }).toArray(),
    db.postCategories.find({}, { projection: { key: 1 } }).toArray(),
    db.posts.find({ status: "published", publishedAt: { $lte: now } }, { projection: { slug: 1, categoryId: 1, updatedAt: 1 } }).toArray(),
    db.jobs.find({ status: "open" }, { projection: { slug: 1, updatedAt: 1 } }).toArray(),
  ]);
  const categoryKey = new Map(categories.map((c) => [c._id, c.key]));

  const paths: { path: string; lastModified?: Date; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
    ...staticPaths.map((path) => ({ path, priority: path === "/" ? 1 : 0.8, changeFrequency: "weekly" as const })),
    ...projects.map((p) => ({ path: `/projects/${p.slug}`, lastModified: p.updatedAt, priority: 0.9, changeFrequency: "weekly" as const })),
    // only categories that actually have a live post — an empty tab isn't worth indexing
    ...categories.filter((c) => posts.some((p) => p.categoryId === c._id)).map((c) => ({ path: `/media/${c.key}`, priority: 0.6, changeFrequency: "daily" as const })),
    ...posts.flatMap((p) => {
      const key = categoryKey.get(p.categoryId);
      return key ? [{ path: `/media/${key}/${p.slug}`, lastModified: p.updatedAt, priority: 0.7, changeFrequency: "monthly" as const }] : [];
    }),
    ...jobs.map((j) => ({ path: `/careers/${j.slug}`, lastModified: j.updatedAt, priority: 0.5, changeFrequency: "weekly" as const })),
  ];

  const url = (locale: string, path: string) => `${SITE_URL}/${locale}${path === "/" ? "" : path}`;
  return paths.flatMap(({ path, ...entry }) =>
    routing.locales.map((locale) => ({
      url: url(locale, path),
      ...entry,
      alternates: { languages: { ...Object.fromEntries(routing.locales.map((l) => [l, url(l, path)])), "x-default": url(routing.defaultLocale, path) } },
    })),
  );
}
