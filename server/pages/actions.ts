"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import { defineAction, UserError } from "@/server/action";
import { db } from "@/server/db";
import { cleanHtml } from "@/server/html";
import { buildSchema, mapRich } from "@/lib/cms/fields";
import { getSection } from "@/lib/cms/pages";
import { id, orderedIds } from "@/lib/schemas/common";

const sectionInput = z.object({ page: z.string(), section: z.string(), data: z.unknown() });

export const saveSection = defineAction(sectionInput, async ({ page, section, data }, user) => {
  const def = getSection(page, section);
  if (!def) throw new UserError("Unknown section.");
  if (def.adminOnly && user.role !== "admin") throw new UserError("Only admins can edit this section.");

  // the envelope is validated by defineAction; the payload by the section's own schema
  const parsed = buildSchema(def.fields).safeParse(data);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path.join(".")] ??= issue.message;
    throw new UserError("Some fields need attention.", fieldErrors);
  }

  const clean = mapRich(def.fields, parsed.data as Record<string, unknown>, cleanHtml);

  const crossFieldErrors = def.check?.(clean) ?? {};
  if (Object.keys(crossFieldErrors).length) throw new UserError("Some fields need attention.", crossFieldErrors);

  // choices whose options are data (post categories) can't be a static enum → check them here
  for (const field of def.fields) {
    if (field.kind !== "choice" || field.dynamic !== "postCategories") continue;
    const picked = clean[field.name] as string[];
    const known = await db.postCategories.find({ _id: { $in: picked } }, { projection: { _id: 1 } }).toArray();
    if (known.length !== picked.length) throw new UserError("Some fields need attention.", { [field.name]: "Pick from the existing categories" });
  }

  await db.pageSections.updateOne(
    { page, section },
    { $set: { data: clean, updatedAt: new Date() }, $setOnInsert: { _id: `${page}.${section}` } },
    { upsert: true },
  );
  revalidateTag(`page:${page}`, { expire: 0 });
  if (page === "calculator") revalidateTag("calculator", { expire: 0 });
});

// Home owns the pick and its order; nothing is written onto the projects.
export const saveHomeShowcase = defineAction(orderedIds.max(12), async (projectIds) => {
  // only ids of projects that exist — the picker can be stale if someone deleted one meanwhile
  const existing = await db.projects.find({ _id: { $in: projectIds } }, { projection: { _id: 1 } }).toArray();
  const valid = projectIds.filter((id) => existing.some((project) => project._id === id));
  await db.homeShowcase.updateOne({ _id: "homeShowcase" }, { $set: { projectIds: valid } }, { upsert: true });
  revalidateTag("page:home", { expire: 0 });
});

// The Calculator page owns which projects it offers and in what order.
export const saveCalculatorDestinations = defineAction(
  orderedIds.max(30),
  async (projectIds) => {
    const existing = await db.projects.find({ _id: { $in: projectIds } }, { projection: { _id: 1 } }).toArray();
    const valid = projectIds.filter((id) => existing.some((project) => project._id === id));
    await db.calculator.updateOne({ _id: "calculator" }, { $set: { projectIds: valid } }, { upsert: true });
    revalidateTag("calculator", { expire: 0 });
  },
  { role: "admin" },
);

export const saveMainPost = defineAction(id.nullable(), async (postId) => {
  if (postId && !(await db.posts.findOne({ _id: postId, status: "published" }, { projection: { _id: 1 } }))) {
    throw new UserError("Only a published post can be pinned.");
  }
  await db.mainPost.updateOne({ _id: "mainPost" }, { $set: { postId } }, { upsert: true });
  revalidateTag("posts", { expire: 0 });
});
