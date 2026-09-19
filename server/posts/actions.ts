"use server";

import { revalidateTag } from "next/cache";
import { defineAction, UserError } from "@/server/action";
import { db, newId } from "@/server/db";
import { nextPosition, reorder } from "@/server/db/reorder";
import { cleanHtml } from "@/server/html";
import { id, orderedIds } from "@/lib/schemas/common";
import { postCategoryInput } from "@/lib/schemas/lists";
import { makePostInput, postInput } from "@/lib/schemas/post";

const date = (value: string) => (value ? new Date(value) : null);

export const savePost = defineAction(postInput.safeExtend({ id: id.optional() }), async ({ id, ...input }) => {
  const category = await db.postCategories.findOne({ _id: input.categoryId });
  if (!category) throw new UserError("Choose a category.", { categoryId: "Choose a category" });
  const isEvent = category.kind === "event";

  // defineAction validated the shape; the event rules need the category, so they run here
  const checked = makePostInput(isEvent ? [category._id] : []).safeParse(input);
  if (!checked.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of checked.error.issues) fieldErrors[issue.path.join(".")] ??= issue.message;
    throw new UserError("Some fields need attention.", fieldErrors);
  }

  const now = new Date();
  const values = {
    ...input,
    body: { en: cleanHtml(input.body.en), ar: cleanHtml(input.body.ar) },
    coverImage: input.coverImage || null,
    publishedAt: date(input.publishedAt) ?? (input.status === "published" ? now : null),
    // event-only fields never linger on a post that moved to a non-event category
    startsAt: isEvent ? date(input.startsAt) : null,
    endsAt: isEvent ? date(input.endsAt) : null,
    venue: isEvent ? input.venue : null,
    registrationUrl: isEvent ? input.registrationUrl || null : null,
    updatedAt: now,
  };

  if (id) {
    const existing = await db.posts.findOne({ _id: id }, { projection: { slug: 1, publishedAt: 1 } });
    if (!existing) throw new UserError("This post no longer exists.");
    // once a post has been live its URL is permanent
    if (existing.publishedAt) values.slug = existing.slug;
    await db.posts.updateOne({ _id: id }, { $set: values });
  } else {
    id = newId();
    await db.posts.insertOne({ _id: id, ...values, createdAt: now });
  }

  revalidateTag("posts", { expire: 0 });
  revalidateTag(`post:${values.slug}`, { expire: 0 });
  return { id, slug: values.slug };
});

export const deletePost = defineAction(id, async (postId) => {
  const deleted = await db.posts.findOneAndDelete({ _id: postId }, { projection: { slug: 1 } });
  // set null: a Media Center pinned to this post falls back to "latest published"
  await db.mainPost.updateOne({ _id: "mainPost", postId }, { $set: { postId: null } });
  if (deleted) revalidateTag(`post:${deleted.slug}`, { expire: 0 });
  revalidateTag("posts", { expire: 0 });
});

// ─── Categories ──────────────────────────────────────────────────────────────

export const savePostCategory = defineAction(postCategoryInput.extend({ id: id.optional() }), async ({ id, ...values }) => {
  if (id) await db.postCategories.updateOne({ _id: id }, { $set: values });
  else await db.postCategories.insertOne({ _id: newId(), ...values, position: await nextPosition(db.postCategories) });
  revalidateTag("posts", { expire: 0 });
});

export const deletePostCategory = defineAction(id, async (categoryId) => {
  // restrict: posts can't be left without a category
  const used = await db.posts.countDocuments({ categoryId });
  if (used) throw new UserError(`${used} post${used === 1 ? " uses" : "s use"} this category. Move them to another category first.`);
  await db.postCategories.deleteOne({ _id: categoryId });
  // cascade: drop it from the Home feed rule
  await db.pageSections.updateOne({ _id: "home.feed" }, { $pull: { "data.categoryIds": categoryId } as never });
  revalidateTag("posts", { expire: 0 });
  revalidateTag("page:home", { expire: 0 });
});

export const reorderPostCategories = defineAction(orderedIds, async (ids) => {
  await reorder(db.postCategories, ids);
  revalidateTag("posts", { expire: 0 });
});
