import "server-only";
import { requireUser } from "@/server/auth/session";
import { db, withId } from "@/server/db";

// CMS reads. Public, cached reads for the website live in server/public/*.

export async function listFaqs() {
  await requireUser();
  return (await db.faqs.find().sort({ position: 1 }).toArray()).map(withId);
}

export async function listPartners() {
  await requireUser();
  return (await db.partners.find().sort({ position: 1 }).toArray()).map(withId);
}

export async function listUnitTypes() {
  await requireUser();
  return (await db.unitTypes.find().sort({ position: 1 }).toArray()).map(withId);
}

export async function listAmenities() {
  await requireUser();
  return (await db.amenities.find().sort({ position: 1 }).toArray()).map(withId);
}
