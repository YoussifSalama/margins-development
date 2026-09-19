import Link from "next/link";
import { Plus } from "lucide-react";
import PageShell from "@/components/cms/page-shell";
import FilterTabs from "@/components/cms/filter-tabs";
import StatusBadge from "@/components/cms/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listPosts } from "@/server/posts/queries";
import { formatDateTime } from "@/lib/dates";

export const metadata = { title: "Posts" };

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export default async function PostsPage({ searchParams }: PageProps<"/admin/content/posts">) {
  const sp = await searchParams;
  const category = one(sp.category);
  const status = one(sp.status);
  const { categories, posts } = await listPosts({ category, status });

  return (
    <PageShell
      tour="list"
      eyebrow="Content"
      title="Posts"
      description="Everything published in the Media Center. Each post belongs to a category — News, Events, Blogs or any you add under Shared → Lookups."
      actions={
        <Button asChild>
          <Link href="/admin/content/posts/new"><Plus className="size-4" />New post</Link>
        </Button>
      }
    >
      <div className="flex flex-wrap gap-3">
        <FilterTabs
          basePath="/admin/content/posts"
          param="category"
          active={category}
          keep={{ status }}
          options={[{ label: "All categories" }, ...categories.map((c) => ({ value: c.key, label: c.name.en }))]}
        />
        <FilterTabs
          basePath="/admin/content/posts"
          param="status"
          active={status}
          keep={{ category }}
          options={[{ label: "Any status" }, { value: "draft", label: "Drafts" }, { value: "published", label: "Published" }, { value: "archived", label: "Archived" }]}
        />
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Publish date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 && (
              <TableRow><TableCell colSpan={4} className="py-10 text-center text-muted-foreground">No posts match.</TableCell></TableRow>
            )}
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="max-w-md">
                  <Link href={`/admin/content/posts/${post.id}`} className="block font-medium hover:underline">
                    <span className="block truncate">{post.title.en}</span>
                    <span dir="rtl" className="block truncate text-start text-sm font-normal text-muted-foreground">{post.title.ar}</span>
                  </Link>
                </TableCell>
                <TableCell><Badge variant="outline">{post.category}</Badge></TableCell>
                <TableCell><StatusBadge status={post.status} publishedAt={post.publishedAt} /></TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDateTime(post.publishedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageShell>
  );
}
