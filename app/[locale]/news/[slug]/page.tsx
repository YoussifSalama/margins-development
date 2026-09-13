import { notFound } from "next/navigation";
import { getPostBySlug, getPosts } from "@/lib/posts";
import { routing } from "@/i18n/routing";
import PostDetailBody from "@/components/PostDetailBody";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getPosts(locale).map((p) => ({ locale, slug: p.slug }))
  );
}

export default async function NewsDetail({
  params,
}: PageProps<"/[locale]/news/[slug]">) {
  const { locale, slug } = await params;
  const post = getPostBySlug(locale, slug);
  if (!post) notFound();

  const related = getPosts(locale).filter((p) => p.slug !== post.slug).slice(0, 2);

  return <PostDetailBody post={post} related={related} base="news" />;
}
