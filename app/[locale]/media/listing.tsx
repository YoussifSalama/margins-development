import { notFound } from "next/navigation";
import { getMediaPage } from "@/server/public/pages";
import { mediaHref } from "@/lib/posts";
import PageHero from "@/components/PageHero";
import PostsListing from "@/components/PostsListing";
import PageSeoScripts from "@/components/PageSeoScripts";

// Shared by /media (all posts) and /media/[category]. Both are real paths — no
// ?category= query — so each tab is one indexable page with one canonical URL.
// One payload carries it all (GET /api/pages/media[/<category>] returns the same).

export type MediaQuery = { page?: string | string[]; limit?: string | string[] };
const number = (value: string | string[] | undefined) => Number(Array.isArray(value) ? value[0] : value) || undefined;

export const loadMedia = (locale: string, query: MediaQuery, categoryKey?: string) =>
  getMediaPage(locale, categoryKey, number(query.page), number(query.limit));

// ponytail: Unsplash stand-in, used only until a hero image is uploaded in the CMS
const fallbackHero = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80&auto=format&fit=crop";

export default async function MediaListing({ locale, query, categoryKey }: { locale: string; query: MediaQuery; categoryKey?: string }) {
  const payload = await loadMedia(locale, query, categoryKey);
  if (!payload) notFound();
  const { hero, categories, category, featured, posts, pagination } = payload.page;

  return (
    <div className="bg-dark">
      <PageSeoScripts seo={payload.seo} />
      <PageHero
        title={category?.name ?? hero.title}
        description={hero.description}
        current={hero.title}
        crumbs={category ? [{ label: hero.title, href: mediaHref() }, { label: category.name }] : undefined}
        image={hero.image || fallbackHero}
      />
      <PostsListing categories={categories} category={category?.key} featured={featured} posts={posts} pagination={pagination} />
    </div>
  );
}
