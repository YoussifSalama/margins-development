import "server-only";
import { requireUser } from "@/server/auth/session";
import { db, withId } from "@/server/db";

export async function getSectionData(page: string, section: string) {
  await requireUser();
  const row = await db.pageSections.findOne({ page, section }, { projection: { data: 1, updatedAt: 1 } });
  return row ? { data: row.data, updatedAt: row.updatedAt } : undefined;
}

export async function getHomeShowcase() {
  await requireUser();
  const showcase = await db.homeShowcase.findOne({ _id: "homeShowcase" });
  const ids = showcase?.projectIds ?? [];
  if (ids.length === 0) return [];
  const projects = await db.projects.find({ _id: { $in: ids } }, { projection: { name: 1, status: 1, coverImage: 1 } }).toArray();
  // keep Home's order; silently drop ids whose project is gone (no foreign keys here)
  return ids.flatMap((id) => projects.filter((project) => project._id === id).map(withId));
}

export async function getCalculatorSelection() {
  await requireUser();
  const selection = await db.calculator.findOne({ _id: "calculator" });
  return selection?.projectIds ?? [];
}

export async function getMainPost() {
  await requireUser();
  const [pin, options] = await Promise.all([
    db.mainPost.findOne({ _id: "mainPost" }),
    db.posts.find({ status: "published" }, { projection: { title: 1, publishedAt: 1 } }).sort({ publishedAt: -1 }).limit(300).toArray(),
  ]);
  const pinned = pin?.postId ?? null;
  // a pin pointing at a post that is no longer published/present reads as "automatic"
  return { postId: options.some((post) => post._id === pinned) ? pinned : null, options: options.map(withId) };
}
