import "server-only";
import type { Filter } from "mongodb";
import { requireUser } from "@/server/auth/session";
import { db, withId } from "@/server/db";
import type { PostDoc } from "@/server/db/types";
import { PUBLISH_STATUSES } from "@/lib/schemas/post";

export async function listPostCategories() {
  await requireUser();
  return (await db.postCategories.find().sort({ position: 1 }).toArray()).map(withId);
}

export async function listPosts(filter: { category?: string; status?: string }) {
  await requireUser();
  const categories = await listPostCategories();
  const where: Filter<PostDoc> = {};
  const category = categories.find((c) => c.key === filter.category);
  if (category) where.categoryId = category.id;
  if (PUBLISH_STATUSES.includes(filter.status as never)) where.status = filter.status as PostDoc["status"];

  const posts = await db.posts
    .find(where, { projection: { slug: 1, categoryId: 1, status: 1, publishedAt: 1, title: 1, updatedAt: 1 } })
    .sort({ updatedAt: -1 })
    // ponytail: no pagination; add skip/limit + search when the list passes a few hundred
    .limit(500)
    .toArray();

  const names = new Map(categories.map((c) => [c.id, c.name.en]));
  return { categories, posts: posts.map((post) => ({ ...withId(post), category: names.get(post.categoryId) ?? "—" })) };
}

export async function getPost(id: string) {
  await requireUser();
  const post = await db.posts.findOne({ _id: id });
  return post ? withId(post) : undefined;
}
