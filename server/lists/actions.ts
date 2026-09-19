"use server";

import { revalidateTag } from "next/cache";
import { defineAction, UserError } from "@/server/action";
import { db, newId } from "@/server/db";
import { nextPosition, reorder } from "@/server/db/reorder";
import { id, orderedIds } from "@/lib/schemas/common";
import { amenityInput, faqInput, partnerInput, unitTypeInput } from "@/lib/schemas/lists";

const optionalId = { id: id.optional() };

// ─── FAQs ────────────────────────────────────────────────────────────────────

export const saveFaq = defineAction(faqInput.extend(optionalId), async ({ id, ...values }) => {
  if (id) await db.faqs.updateOne({ _id: id }, { $set: values });
  else await db.faqs.insertOne({ _id: newId(), ...values, position: await nextPosition(db.faqs) });
  revalidateTag("faqs", { expire: 0 });
});
export const deleteFaq = defineAction(id, async (faqId) => {
  await db.faqs.deleteOne({ _id: faqId });
  revalidateTag("faqs", { expire: 0 });
});
export const reorderFaqs = defineAction(orderedIds, async (ids) => {
  await reorder(db.faqs, ids);
  revalidateTag("faqs", { expire: 0 });
});

// ─── Partners ────────────────────────────────────────────────────────────────

export const savePartner = defineAction(partnerInput.extend(optionalId), async ({ id, ...input }) => {
  const values = { ...input, logo: input.logo || null, url: input.url || null };
  if (id) await db.partners.updateOne({ _id: id }, { $set: values });
  else await db.partners.insertOne({ _id: newId(), ...values, position: await nextPosition(db.partners) });
  revalidateTag("partners", { expire: 0 });
});
export const deletePartner = defineAction(id, async (partnerId) => {
  await db.partners.deleteOne({ _id: partnerId });
  revalidateTag("partners", { expire: 0 });
});
export const reorderPartners = defineAction(orderedIds, async (ids) => {
  await reorder(db.partners, ids);
  revalidateTag("partners", { expire: 0 });
});

// ─── Lookups ─────────────────────────────────────────────────────────────────
// Unit types and amenities are rendered inside project pages, so they bust "projects".
// No foreign keys in MongoDB: the rules a relational DB would enforce live here.

export const saveUnitType = defineAction(unitTypeInput.extend(optionalId), async ({ id, ...values }) => {
  if (id) await db.unitTypes.updateOne({ _id: id }, { $set: values });
  else await db.unitTypes.insertOne({ _id: newId(), ...values, position: await nextPosition(db.unitTypes) });
  revalidateTag("projects", { expire: 0 });
});
export const deleteUnitType = defineAction(id, async (unitTypeId) => {
  // restrict: a unit type still used by a project can't disappear from under it
  const used = await db.projects.findOne({ "units.unitTypeId": unitTypeId }, { projection: { _id: 1 } });
  if (used) throw new UserError("This unit type is used by a project. Remove it from the project first.");
  await db.unitTypes.deleteOne({ _id: unitTypeId });
  // set null: old leads keep their message, just lose the unit type label
  await db.leads.updateMany({ unitTypeId }, { $set: { unitTypeId: null } });
  revalidateTag("projects", { expire: 0 });
});
export const reorderUnitTypes = defineAction(orderedIds, async (ids) => {
  await reorder(db.unitTypes, ids);
  revalidateTag("projects", { expire: 0 });
});

export const saveAmenity = defineAction(amenityInput.extend(optionalId), async ({ id, ...values }) => {
  if (id) await db.amenities.updateOne({ _id: id }, { $set: values });
  else await db.amenities.insertOne({ _id: newId(), ...values, position: await nextPosition(db.amenities) });
  revalidateTag("projects", { expire: 0 });
});
export const deleteAmenity = defineAction(id, async (amenityId) => {
  await db.amenities.deleteOne({ _id: amenityId });
  // cascade: untick it on every project that had it
  await db.projects.updateMany({ amenityIds: amenityId }, { $pull: { amenityIds: amenityId } });
  revalidateTag("projects", { expire: 0 });
});
export const reorderAmenities = defineAction(orderedIds, async (ids) => {
  await reorder(db.amenities, ids);
  revalidateTag("projects", { expire: 0 });
});
