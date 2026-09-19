import { permanentRedirect } from "next/navigation";
import { getPostPage } from "@/server/public/pages";
import { toMetadata } from "@/server/public/seo";
import { postHref } from "@/lib/posts";
import MediaListing, { loadMedia } from "../listing";

export async function generateMetadata({ params, searchParams }: PageProps<"/[locale]/media/[category]">) {
  const { locale, category } = await params;
  const payload = await loadMedia(locale, await searchParams, category);
  return payload ? toMetadata(payload.seo) : {};
}

export default async function MediaCategory({ params, searchParams }: PageProps<"/[locale]/media/[category]">) {
  const { locale, category } = await params;
  const query = await searchParams;

  if (!(await loadMedia(locale, query, category))) {
    // Not a category. Posts briefly lived at /media/<slug> (and /news/<slug>, /blogs/<slug>
    // redirect there), so send those to the post's one real address. Otherwise MediaListing 404s.
    const post = await getPostPage(locale, category);
    if (post) permanentRedirect(`/${locale}${postHref(post.page.post)}`);
  }

  return <MediaListing locale={locale} query={query} categoryKey={category} />;
}
