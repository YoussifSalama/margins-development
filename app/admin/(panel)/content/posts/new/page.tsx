import PageShell from "@/components/cms/page-shell";
import Link from "next/link";
import { listPostCategories } from "@/server/posts/queries";
import { emptyPost } from "@/lib/schemas/post";
import PostForm from "../post-form";

export const metadata = { title: "New post" };

export default async function NewPostPage() {
  const categories = await listPostCategories();
  return (
    <PageShell tour="entity" eyebrow="Posts" title="New post" back={{ href: "/admin/content/posts", label: "All posts" }}>
      {categories.length === 0 ? (
        <p className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          Posts need a category. <Link href="/admin/shared/lookups" className="font-medium text-foreground underline">Add one under Shared → Lookups</Link> first.
        </p>
      ) : (
        <PostForm values={{ ...emptyPost, categoryId: categories[0].id }} categories={categories.map((c) => ({ id: c.id, key: c.key, name: c.name.en, kind: c.kind }))} />
      )}
    </PageShell>
  );
}
