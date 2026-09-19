import { notFound, permanentRedirect } from "next/navigation";
import { getPostPage } from "@/server/public/pages";
import { toMetadata } from "@/server/public/seo";
import { postHref } from "@/lib/posts";
import PostDetailBody from "@/components/PostDetailBody";
import PageSeoScripts from "@/components/PageSeoScripts";

export async function generateMetadata({ params }: PageProps<"/[locale]/media/[category]/[slug]">) {
  const { locale, slug } = await params;
  const payload = await getPostPage(locale, slug);
  return payload ? toMetadata(payload.seo) : {};
}

// One payload: SEO (incl. NewsArticle / BlogPosting / Event schema), site data, the post and
// its related posts — the same response GET /api/pages/media/<category>/<slug> returns.
export default async function MediaPost({ params }: PageProps<"/[locale]/media/[category]/[slug]">) {
  const { locale, category, slug } = await params;
  const payload = await getPostPage(locale, slug);
  if (!payload) notFound();
  const { post, related } = payload.page;

  // A post has exactly one address. If it's reached under the wrong category (it was moved,
  // or someone edited the URL), go to the right one instead of serving a duplicate.
  if (post.category !== category) permanentRedirect(`/${locale}${postHref(post)}`);

  return (
    <>
      <PageSeoScripts seo={payload.seo} />
      <PostDetailBody post={post} related={related} />
    </>
  );
}
