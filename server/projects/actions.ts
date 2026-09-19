"use server";

import { revalidateTag } from "next/cache";
import { defineAction, UserError } from "@/server/action";
import { audit } from "@/server/audit";
import { db, newId } from "@/server/db";
import { reorder } from "@/server/db/reorder";
import type { ProjectUnit } from "@/server/db/types";
import { id, orderedIds } from "@/lib/schemas/common";
import { projectInput } from "@/lib/schemas/project";

const bust = (slug: string) => {
  revalidateTag("projects", { expire: 0 });
  revalidateTag(`project:${slug}`, { expire: 0 });
};

const orNull = (value: string) => value || null;

// Story blocks, places, amenity ids and units are embedded, so a project save is one
// atomic document write — a half-saved project is impossible, without transactions.
export const saveProject = defineAction(projectInput.safeExtend({ id: id.optional() }), async ({ id, ...input }, user) => {
  const now = new Date();
  const existing = id ? await db.projects.findOne({ _id: id }, { projection: { slug: 1, status: 1, units: 1, investment: 1 } }) : null;
  if (id && !existing) throw new UserError("This project no longer exists.");

  // a unit keeps its id across saves (matched by unit type), so anything that references it stays valid
  // Prices, rents, costs and the percentage overrides are shown to buyers as return estimates,
  // so only an admin can change them. For an editor the submitted numbers are ignored and the
  // stored ones kept — enforced here, not just by greying the fields out.
  const isAdmin = user.role === "admin";
  const units: ProjectUnit[] = input.units.map((unit) => {
    const before = existing?.units.find((u) => u.unitTypeId === unit.unitTypeId);
    const figures = isAdmin
      ? { avgPrice: unit.avgPrice, annualGrossRent: unit.annualGrossRent, annualOpCosts: unit.annualOpCosts }
      : { avgPrice: before?.avgPrice ?? null, annualGrossRent: before?.annualGrossRent ?? null, annualOpCosts: before?.annualOpCosts ?? null };
    return { ...unit, ...figures, id: before?.id ?? newId(), image: orNull(unit.image) };
  });

  // all-empty overrides are stored as null = "this project just uses the calculator defaults"
  const { phaseLabel, ...numbers } = input.investment;
  const hasOverrides = Boolean(phaseLabel.en || phaseLabel.ar) || Object.values(numbers).some((value) => value !== null);
  const submitted = hasOverrides ? { ...numbers, phaseLabel: phaseLabel.en || phaseLabel.ar ? phaseLabel : null } : null;
  const investment = isAdmin ? submitted : (existing?.investment ?? null);

  const values = {
    ...input,
    // a project that is or was live keeps its URL
    slug: existing && existing.status !== "draft" ? existing.slug : input.slug,
    coverImage: orNull(input.coverImage),
    heroMedia: orNull(input.heroMedia),
    mapImage: orNull(input.mapImage),
    units,
    investment,
    updatedAt: now,
  };

  if (id) {
    await db.projects.updateOne({ _id: id }, { $set: values });
  } else {
    id = newId();
    const [last] = await db.projects.find({}, { projection: { position: 1 } }).sort({ position: -1 }).limit(1).toArray();
    await db.projects.insertOne({ _id: id, ...values, position: (last?.position ?? -1) + 1, createdAt: now });
  }

  // a record of every change to the figures: who, which project, before → after
  const figuresOf = (list: ProjectUnit[] | undefined) => (list ?? []).map((u) => [u.unitTypeId, u.avgPrice, u.annualGrossRent, u.annualOpCosts]);
  if (isAdmin && JSON.stringify([figuresOf(existing?.units), existing?.investment ?? null]) !== JSON.stringify([figuresOf(units), investment])) {
    await audit(user, "calculator.project-figures-changed", { project: id, before: { units: figuresOf(existing?.units), investment: existing?.investment ?? null }, after: { units: figuresOf(units), investment } });
  }

  bust(values.slug);
  revalidateTag("calculator", { expire: 0 }); // unit prices and overrides feed the calculator
  return { id, slug: values.slug };
});

export const deleteProject = defineAction(id, async (projectId, user) => {
  await audit(user, "project.deleted", { project: projectId });
  const deleted = await db.projects.findOneAndDelete({ _id: projectId }, { projection: { slug: 1 } });
  // What foreign keys did in SQL: cascade out of the Home showcase, null out old leads.
  await Promise.all([
    db.homeShowcase.updateOne({ _id: "homeShowcase" }, { $pull: { projectIds: projectId } }),
    db.calculator.updateOne({ _id: "calculator" }, { $pull: { projectIds: projectId } }),
    db.leads.updateMany({ projectId }, { $set: { projectId: null } }),
  ]);
  if (deleted) bust(deleted.slug);
  revalidateTag("page:home", { expire: 0 });
  revalidateTag("calculator", { expire: 0 });
});

export const reorderProjects = defineAction(orderedIds, async (ids) => {
  await reorder(db.projects, ids);
  revalidateTag("projects", { expire: 0 });
});
