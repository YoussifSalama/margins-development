"use server";

import { revalidateTag } from "next/cache";
import { defineAction, UserError } from "@/server/action";
import { db, newId } from "@/server/db";
import { id } from "@/lib/schemas/common";
import { jobInput } from "@/lib/schemas/job";

export const saveJob = defineAction(jobInput.safeExtend({ id: id.optional() }), async ({ id, ...input }) => {
  const now = new Date();
  const values = {
    ...input,
    postedAt: input.postedAt || (input.status === "open" ? now.toISOString().slice(0, 10) : null),
    deadline: input.deadline || null,
    updatedAt: now,
  };

  if (id) {
    const existing = await db.jobs.findOne({ _id: id }, { projection: { slug: 1 } });
    if (!existing) throw new UserError("This job no longer exists.");
    await db.jobs.updateOne({ _id: id }, { $set: values });
    if (existing.slug !== values.slug) revalidateTag(`job:${existing.slug}`, { expire: 0 }); // the old URL stops serving
  } else {
    id = newId();
    await db.jobs.insertOne({ _id: id, ...values, createdAt: now });
  }

  revalidateTag("jobs", { expire: 0 });
  revalidateTag(`job:${values.slug}`, { expire: 0 });
  return { id, slug: values.slug };
});

export const deleteJob = defineAction(id, async (jobId) => {
  const deleted = await db.jobs.findOneAndDelete({ _id: jobId }, { projection: { slug: 1 } });
  // set null: applications survive with their jobTitle, so the inbox keeps its history
  await db.jobApplications.updateMany({ jobId }, { $set: { jobId: null } });
  revalidateTag("jobs", { expire: 0 });
  if (deleted) revalidateTag(`job:${deleted.slug}`, { expire: 0 });
});
