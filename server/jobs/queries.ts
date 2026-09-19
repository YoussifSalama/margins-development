import "server-only";
import { requireUser } from "@/server/auth/session";
import { db, withId } from "@/server/db";

export async function listJobs() {
  await requireUser();
  const [jobs, counts] = await Promise.all([
    db.jobs.find({}, { projection: { title: 1, status: 1, openings: 1, deadline: 1 } }).sort({ updatedAt: -1 }).toArray(),
    db.jobApplications.aggregate<{ _id: string | null; n: number }>([{ $group: { _id: "$jobId", n: { $sum: 1 } } }]).toArray(),
  ]);
  const applications = new Map(counts.map((row) => [row._id, row.n]));
  return jobs.map((job) => ({ ...withId(job), applications: applications.get(job._id) ?? 0 }));
}

export async function getJob(id: string) {
  await requireUser();
  const job = await db.jobs.findOne({ _id: id });
  return job ? withId(job) : undefined;
}
