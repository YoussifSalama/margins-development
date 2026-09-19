import "server-only";
import { requireUser } from "@/server/auth/session";
import { db, withId } from "@/server/db";

export async function listProjects() {
  await requireUser();
  const [projects, showcase, calculator] = await Promise.all([
    db.projects
      .find({}, { projection: { slug: 1, name: 1, location: 1, status: 1, buildStatus: 1, coverImage: 1 } })
      .sort({ position: 1, createdAt: -1 })
      .toArray(),
    db.homeShowcase.findOne({ _id: "homeShowcase" }),
    db.calculator.findOne({ _id: "calculator" }),
  ]);
  const onHome = new Set(showcase?.projectIds ?? []);
  const inCalculator = new Set(calculator?.projectIds ?? []);
  return projects.map((project) => ({ ...withId(project), inCalculator: inCalculator.has(project._id), onHome: onHome.has(project._id) }));
}

/** Same shape the edit page has always consumed; the children now come from one document. */
export async function getProject(id: string) {
  await requireUser();
  const doc = await db.projects.findOne({ _id: id });
  if (!doc) return undefined;
  const { storyBlocks, places, amenityIds, units, investment, ...project } = doc;
  return { project: withId(project), storyBlocks, places, amenityIds, units, investment };
}

/** Compact list for pickers (Home showcase). */
export async function listProjectOptions() {
  await requireUser();
  const projects = await db.projects.find({}, { projection: { name: 1, status: 1, coverImage: 1 } }).sort({ position: 1 }).toArray();
  return projects.map(withId);
}
