"use server";

import { z } from "zod";
import { defineAction, UserError } from "@/server/action";
import { db } from "@/server/db";
import { cvBucket, deleteObject, presignGet } from "@/server/storage/r2";
import { id } from "@/lib/schemas/common";
import { APPLICATION_STATUSES } from "@/lib/schemas/inbox";

export const archiveLead = defineAction(z.object({ id, archived: z.boolean() }), async ({ id, archived }) => {
  await db.leads.updateOne({ _id: id }, { $set: { archivedAt: archived ? new Date() : null } });
});

// Personal data: removal is an admin decision.
export const deleteLead = defineAction(id, async (leadId) => void (await db.leads.deleteOne({ _id: leadId })), { role: "admin" });

export const setApplicationStatus = defineAction(z.object({ id, status: z.enum(APPLICATION_STATUSES) }), async ({ id, status }) => {
  await db.jobApplications.updateOne({ _id: id }, { $set: { status } });
});

export const deleteApplication = defineAction(
  id,
  async (applicationId) => {
    const deleted = await db.jobApplications.findOneAndDelete({ _id: applicationId }, { projection: { cvKey: 1 } });
    // personal data: the CV file goes with the record (best effort — a storage hiccup must not resurrect the record)
    if (deleted) await deleteObject(cvBucket(), deleted.cvKey).catch((error) => console.error("CV delete failed:", error));
  },
  { role: "admin" },
);

/** CVs live in a private bucket; staff get a link that expires in a minute. */
export const getCvUrl = defineAction(id, async (applicationId) => {
  const application = await db.jobApplications.findOne({ _id: applicationId }, { projection: { cvKey: 1, name: 1 } });
  if (!application) throw new UserError("Application not found.");
  try {
    const extension = application.cvKey.split(".").pop();
    return await presignGet(cvBucket(), application.cvKey, 60, `CV - ${application.name}.${extension}`);
  } catch (error) {
    throw new UserError(error instanceof Error ? error.message : "Could not create the download link.");
  }
});

export const deleteSubscriber = defineAction(id, async (subscriberId) => void (await db.subscribers.deleteOne({ _id: subscriberId })));
