import { getTranslations, getLocale } from "next-intl/server";
import { getPosts, type Category } from "@/lib/posts";
import PageHero from "@/components/PageHero";
import PostsListing from "@/components/PostsListing";

export const metadata = { title: "Blogs — Margins" };

// ponytail: Unsplash stand-in until Margins' own photo lands
const heroImage =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80&auto=format&fit=crop";

export default async function Blogs({
  searchParams,
}: PageProps<"/[locale]/blogs">) {
  const sp = await searchParams;
  const t = await getTranslations("posts");
  const locale = await getLocale();
  const posts = getPosts(locale);

  const category: Category | undefined =
    sp.category === "Events" || sp.category === "Blogs" ? (sp.category as Category) : undefined;
  const page = Number(sp.page) || 1;
  const limit = Number(sp.limit) || 5;

  return (
    <div>
      <PageHero
        title={t("heroTitleBlogs")}
        description={t("heroDescription")}
        current={t("heroTitleBlogs")}
        image={heroImage}
        overlayClassName="bg-hero-overlay-dark/70"
      />
      <PostsListing posts={posts} base="blogs" category={category} page={page} limit={limit} />
    </div>
  );
}
