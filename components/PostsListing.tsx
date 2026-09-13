import { useTranslations } from "next-intl";
import type { Post, Category } from "@/lib/posts";
import FeaturedPost from "@/components/FeaturedPost";
import PostCard from "@/components/PostCard";
import CategoryTabs from "@/components/CategoryTabs";
import Pagination from "@/components/Pagination";

export default function PostsListing({
  posts,
  base,
  category,
  page,
  limit,
}: {
  posts: Post[];
  base: "news" | "blogs";
  category?: Category;
  page: number;
  limit: number;
}) {
  const t = useTranslations("posts");
  const basePath = `/${base}` as const;

  const filtered = category ? posts.filter((p) => p.category === category) : posts;
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const pageItems = filtered.slice((safePage - 1) * limit, safePage * limit);

  const featured = safePage === 1 ? pageItems[0] : undefined;
  const rest = safePage === 1 ? pageItems.slice(1) : pageItems;

  return (
    <div className="rounded-t-2xl bg-background px-6 pt-8 pb-24">
      <div className="container">
        <CategoryTabs
          basePath={basePath}
          active={category}
          limit={limit}
          tabs={[
            { label: t("tabs.all") },
            { label: t("tabs.events"), category: "Events" },
            { label: t("tabs.blogs"), category: "Blogs" },
          ]}
        />

        {featured && (
          <div className="mt-10">
            <FeaturedPost
              slug={featured.slug}
              category={featured.category}
              title={featured.title}
              excerpt={featured.excerpt}
              date={featured.date}
              image={featured.image}
              base={base}
            />
          </div>
        )}

        {rest.length > 0 && (
          <div className="mt-16 grid grid-cols-1 gap-x-13.5 gap-y-16 lg:grid-cols-2">
            {rest.map((post) => (
              <PostCard
                key={post.slug}
                slug={post.slug}
                category={post.category}
                title={post.title}
                date={post.date}
                image={post.image}
                base={base}
              />
            ))}
          </div>
        )}

        <Pagination basePath={basePath} page={safePage} totalPages={totalPages} category={category} limit={limit} />
      </div>
    </div>
  );
}
