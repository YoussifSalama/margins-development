import { useTranslations } from "next-intl";
import { mediaHref, postHref, type PostCard as PostCardData, type PostCategory } from "@/lib/posts";
import FeaturedPost from "@/components/FeaturedPost";
import PostCard from "@/components/PostCard";
import CategoryTabs, { DEFAULT_LIMIT } from "@/components/CategoryTabs";
import Pagination from "@/components/Pagination";
import Reveal from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import { Newspaper } from "lucide-react";

// Filtering, the pinned main item and paging are all done server-side (getMediaPage);
// this only lays out what it is given.
export default function PostsListing({
  categories,
  category,
  featured,
  posts,
  pagination,
}: {
  // one tab per category, in this order — the list is data, so new categories just appear
  categories: PostCategory[];
  category?: string;
  featured: PostCardData | null;
  posts: PostCardData[];
  pagination: { page: number; totalPages: number; limit: number };
}) {
  const t = useTranslations("posts");
  // the category is part of the path (/media/news), not a query string, so each tab is its own indexable page
  const basePath = mediaHref(category);
  const { page: safePage, totalPages, limit } = pagination;
  const rest = posts;

  return (
    <div className="rounded-t-2xl bg-background px-6 pt-8 pb-24">
      <div className="container">
        <CategoryTabs
          active={category}
          limit={limit}
          tabs={[{ label: t("tabs.all"), href: mediaHref() }, ...categories.map((c) => ({ label: c.name, category: c.key, href: mediaHref(c.key) }))]}
        />

        {featured && (
          <Reveal className="mt-10">
            <FeaturedPost
              href={postHref(featured)}
              category={featured.categoryName}
              title={featured.title}
              excerpt={featured.excerpt}
              date={featured.date}
              image={featured.image}
            />
          </Reveal>
        )}

        {rest.length > 0 && (
          <div className="mt-16 grid grid-cols-1 gap-x-13.5 gap-y-16 lg:grid-cols-2">
            {rest.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 2) * 0.12}>
                <PostCard
                  href={postHref(post)}
                  category={post.categoryName}
                  title={post.title}
                  date={post.date}
                  image={post.image}
                />
              </Reveal>
            ))}
          </div>
        )}

        {!featured && rest.length === 0 && (
          <Reveal className="mt-16">
            <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
              <span className="relative mb-6 flex size-20 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent/20 motion-reduce:animate-none" />
                <span className="relative flex size-20 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Newspaper className="size-9" aria-hidden />
                </span>
              </span>
              <h2 className="text-2xl font-semibold">{t("empty.title")}</h2>
              <p className="mt-3 text-muted">{t("empty.description")}</p>
              {category && (
                <Link href={mediaHref()} className="mt-8 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90">
                  {t("empty.browseAll")}
                </Link>
              )}
            </div>
          </Reveal>
        )}

        <Pagination
          basePath={basePath}
          page={safePage}
          totalPages={totalPages}
          limit={limit}
          defaultLimit={DEFAULT_LIMIT}
        />
      </div>
    </div>
  );
}
