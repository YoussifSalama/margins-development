import "server-only";
import type { Filter } from "mongodb";
import { requireUser } from "@/server/auth/session";
import { db, withId } from "@/server/db";
import type { JobApplicationDoc } from "@/server/db/types";
import { APPLICATION_STATUSES } from "@/lib/schemas/inbox";

export async function listLeads(view: "inbox" | "archived") {
  await requireUser();
  const leads = await db.leads
    .find(
      { archivedAt: view === "archived" ? { $ne: null } : null },
      { projection: { name: 1, email: 1, phone: 1, source: 1, readAt: 1, createdAt: 1, projectId: 1 } },
    )
    .sort({ createdAt: -1 })
    // ponytail: newest 500, add paging/search when the inbox outgrows it
    .limit(500)
    .toArray();

  const projectIds = [...new Set(leads.flatMap((lead) => (lead.projectId ? [lead.projectId] : [])))];
  const projects = projectIds.length ? await db.projects.find({ _id: { $in: projectIds } }, { projection: { name: 1 } }).toArray() : [];
  const names = new Map(projects.map((project) => [project._id, project.name]));
  return leads.map((lead) => ({ ...withId(lead), project: (lead.projectId && names.get(lead.projectId)) || null }));
}

export async function getLead(id: string) {
  await requireUser();
  const lead = await db.leads.findOne({ _id: id });
  if (!lead) return undefined;
  const [project, unitType] = await Promise.all([
    lead.projectId ? db.projects.findOne({ _id: lead.projectId }, { projection: { name: 1 } }) : null,
    lead.unitTypeId ? db.unitTypes.findOne({ _id: lead.unitTypeId }, { projection: { name: 1 } }) : null,
  ]);
  if (!lead.readAt) await db.leads.updateOne({ _id: id }, { $set: { readAt: new Date() } });
  return { lead: withId(lead), project: project?.name ?? null, unitType: unitType?.name ?? null };
}

export async function listApplications(filter: { job?: string; status?: string }) {
  await requireUser();
  const where: Filter<JobApplicationDoc> = {};
  if (filter.job) where.jobId = filter.job;
  if (APPLICATION_STATUSES.includes(filter.status as never)) where.status = filter.status as JobApplicationDoc["status"];
  return (await db.jobApplications.find(where).sort({ createdAt: -1 }).limit(500).toArray()).map(withId);
}

export async function listSubscribers() {
  await requireUser();
  return (await db.subscribers.find().sort({ createdAt: -1 }).toArray()).map(withId);
}
