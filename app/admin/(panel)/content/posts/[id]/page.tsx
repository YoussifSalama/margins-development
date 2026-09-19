import { notFound } from "next/navigation";
import PageShell from "@/components/cms/page-shell";
import StatusBadge from "@/components/cms/status-badge";
import { getPost, listPostCategories } from "@/server/posts/queries";
import { emptyLocalized, emptySeo } from "@/lib/schemas/common";
import PostForm from "../post-form";

export const metadata = { title: "Edit post" };

export default async function EditPostPage({ params }: PageProps<"/admin/content/posts/[id]">) {
  const { id } = await params;
  const [post, categories] = await Promise.all([getPost(id).catch(() => undefined), listPostCategories()]);
  if (!post) notFound();

  return (
    <PageShell
      tour="entity"
      eyebrow="Posts"
      title={post.title.en}
      back={{ href: "/admin/content/posts", label: "All posts" }}
      actions={<StatusBadge status={post.status} publishedAt={post.publishedAt} />}
    >
      <PostForm
        id={post.id}
        slugLocked={Boolean(post.publishedAt)}
        categories={categories.map((c) => ({ id: c.id, key: c.key, name: c.name.en, kind: c.kind }))}
        values={{
          slug: post.slug,
          categoryId: post.categoryId,
          status: post.status,
          publishedAt: post.publishedAt?.toISOString() ?? "",
          title: post.title,
          excerpt: post.excerpt ?? emptyLocalized,
          body: post.body ?? emptyLocalized,
          authorLabel: post.authorLabel ?? emptyLocalized,
          coverImage: post.coverImage ?? "",
          gallery: post.gallery,
          startsAt: post.startsAt?.toISOString() ?? "",
          endsAt: post.endsAt?.toISOString() ?? "",
          venue: post.venue ?? emptyLocalized,
          registrationUrl: post.registrationUrl ?? "",
          seo: post.seo ?? emptySeo,
        }}
      />
    </PageShell>
  );
}
