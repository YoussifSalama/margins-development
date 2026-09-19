"use server";

import { z } from "zod";
import { db, newId } from "@/server/db";
import { computeEstimate } from "@/lib/calculator";
import { getCalculatorPage } from "@/server/public/pages";
import { randomBytes, randomUUID } from "node:crypto";
import { sign, verify } from "@/server/secret";
import { allow, allowKey } from "@/server/rate-limit";
import { copyObject, cvBucket, deleteObject, headObject, presignPut, readStart, sweep } from "@/server/storage/r2";
import { CV_MAX_BYTES, CV_TYPES } from "@/lib/schemas/inbox";
import type { ActionResult } from "@/lib/schemas/common";

// Public (no session) — everything here is untrusted visitor input.
const calculatorLead = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().max(2000).optional(),
  locale: z.enum(["en", "ar"]),
  destinationSlug: z.string().max(80),
  unitTypeKey: z.string().max(40),
  years: z.number().int().min(1).max(40),
  website: z.string().max(0), // honeypot: humans never see it, bots fill it
});

const TOO_MANY: ActionResult = { ok: false, error: "Too many requests. Please try again in a few minutes." };

const fieldErrorsOf = (error: z.ZodError) => {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) fieldErrors[issue.path.join(".")] ??= issue.message;
  return fieldErrors;
};

// Spam protection on every public form: a honeypot field + a per-IP budget (server/rate-limit.ts).
export async function submitCalculatorLead(
  raw: z.input<typeof calculatorLead>,
): Promise<ActionResult> {
  const parsed = calculatorLead.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues)
      fieldErrors[issue.path.join(".")] ??= issue.message;
    return { ok: false, error: "Some fields need attention.", fieldErrors };
  }
  if (!(await allow("calculator-lead", 5, 600))) return TOO_MANY;
  const {
    name,
    email,
    phone,
    message,
    locale,
    destinationSlug,
    unitTypeKey,
    years,
  } = parsed.data;

  // The numbers staff see are recomputed here from the ids — never taken from the client.
  // the same payload the visitor's page was rendered from
  const { destinations, horizons } = (await getCalculatorPage(locale)).page;
  const destination = destinations.find((d) => d.slug === destinationSlug);
  const unitType = destination?.unitTypes.find((u) => u.key === unitTypeKey);
  // horizons are data now, so "is this a real choice" is checked against the CMS list
  if (!destination || !unitType || !horizons.includes(years))
    return { ok: false, error: "That selection is no longer available." };

  try {
    await db.leads.insertOne({
      _id: newId(),
      source: "calculator",
      name,
      email,
      phone: phone || null,
      message: message || null,
      locale,
      unitTypeId: null,
      projectId: destination.id,
      snapshot: {
        assumptionCode: destination.assumptionCode,
        effectiveDate: destination.effectiveDate,
        destination: { slug: destination.slug, name: destination.name },
        unitType: { key: unitType.key, name: unitType.name },
        years,
        estimate: computeEstimate(destination, unitType, years),
      },
      readAt: null,
      archivedAt: null,
      createdAt: new Date(),
    });
    return { ok: true, data: undefined };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

// ─── Contact form ────────────────────────────────────────────────────────────

const contactLead = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().min(2).max(3000),
  locale: z.enum(["en", "ar"]),
  unitTypeId: z.union([z.literal(""), z.uuid()]).optional(),
  website: z.string().max(0), // honeypot
});

export async function submitContactLead(raw: z.input<typeof contactLead>): Promise<ActionResult> {
  const parsed = contactLead.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Some fields need attention.", fieldErrors: fieldErrorsOf(parsed.error) };
  if (!(await allow("contact-lead", 5, 600))) return TOO_MANY;
  const { name, email, phone, message, locale, unitTypeId } = parsed.data;

  try {
    // the unit type comes from the visitor — only keep it if it's one of ours
    const unitType = unitTypeId ? await db.unitTypes.findOne({ _id: unitTypeId }, { projection: { _id: 1 } }) : null;
    await db.leads.insertOne({
      _id: newId(), source: "contact", name, email, phone: phone || null, message, locale,
      unitTypeId: unitType?._id ?? null, projectId: null, snapshot: null, readAt: null, archivedAt: null, createdAt: new Date(),
    });
    return { ok: true, data: undefined };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

// ─── Newsletter ──────────────────────────────────────────────────────────────

const subscription = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  locale: z.enum(["en", "ar"]),
  website: z.string().max(0), // honeypot
});

export async function subscribeNewsletter(raw: z.input<typeof subscription>): Promise<ActionResult> {
  const parsed = subscription.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Enter a valid email address.", fieldErrors: fieldErrorsOf(parsed.error) };
  if (!(await allow("newsletter", 5, 600))) return TOO_MANY;

  try {
    // upsert: subscribing twice is a success, and the answer never reveals whether an address was already on the list
    await db.subscribers.updateOne(
      { email: parsed.data.email },
      { $setOnInsert: { _id: newId(), email: parsed.data.email, locale: parsed.data.locale, createdAt: new Date() } },
      { upsert: true },
    );
    return { ok: true, data: undefined };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

// ─── Job application (CV upload) ─────────────────────────────────────────────
// 1. signCvUpload  → the browser gets a 5-minute upload link for ONE key we chose, plus a token
// 2. the browser PUTs the file straight to R2 (type and size are part of the link's signature)
// 3. submitApplication → the token proves the key is one we issued, then the stored object is
//    checked again (exists, size, type) before anything is written to the database.

// The token is an HMAC of the key (server/secret.ts), so an applicant can only attach the object
// they uploaded — never somebody else's CV or an arbitrary object in the bucket.

// What the file really is, from its first bytes — the declared Content-Type is just a claim.
const SIGNATURES: Record<string, number[]> = {
  pdf: [0x25, 0x50, 0x44, 0x46, 0x2d], // %PDF-
  doc: [0xd0, 0xcf, 0x11, 0xe0], // OLE2 container
  docx: [0x50, 0x4b, 0x03, 0x04], // zip
};

const cvUpload = z.object({ contentType: z.string().max(120), size: z.number().int().positive(), website: z.string().max(0) });

export type CvUpload = { ok: true; uploadUrl: string; key: string; token: string } | { ok: false; error: string };

export async function signCvUpload(raw: z.input<typeof cvUpload>): Promise<CvUpload> {
  const parsed = cvUpload.safeParse(raw);
  const extension = parsed.success ? CV_TYPES[parsed.data.contentType] : undefined;
  if (!parsed.success || !extension) return { ok: false, error: "type" };
  if (parsed.data.size > CV_MAX_BYTES) return { ok: false, error: "size" };
  // per visitor, and for the whole site: upload links are free to request, so the total is capped too
  if (!(await allow("cv-upload", 6, 600)) || !(await allowKey("cv-upload:all", 120, 3600))) return { ok: false, error: "rate" };

  // extension from our own map, never from the visitor's filename; 256 random bits in the key
  // uploads land in cv/tmp/ and only move to their final place once an application is submitted;
  // whatever is abandoned there is swept after a day
  const key = `cv/tmp/${randomUUID()}-${randomBytes(16).toString("hex")}.${extension}`;
  if (Math.random() < 0.1) void sweep(cvBucket(), "cv/tmp/", 24 * 60 * 60 * 1000).catch(() => {});
  try {
    const uploadUrl = await presignPut(cvBucket(), key, parsed.data.contentType, parsed.data.size);
    return { ok: true, uploadUrl, key, token: sign("cv", key) };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "unavailable" };
  }
}

const application = z.object({
  jobSlug: z.string().max(140),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(200),
  phone: z.string().trim().min(6).max(40),
  note: z.string().trim().max(3000).optional(),
  cvKey: z.string().regex(/^cv\/tmp\/[0-9a-f-]{36}-[0-9a-f]{32}\.(pdf|doc|docx)$/),
  cvToken: z.string().max(200),
  website: z.string().max(0), // honeypot
});

export async function submitApplication(raw: z.input<typeof application>): Promise<ActionResult> {
  const parsed = application.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Some fields need attention.", fieldErrors: fieldErrorsOf(parsed.error) };
  if (!(await allow("job-application", 3, 600))) return TOO_MANY;
  const { jobSlug, name, email, phone, note, cvKey, cvToken } = parsed.data;
  if (!verify("cv", cvKey, cvToken)) return { ok: false, error: "Please upload your CV again." };

  try {
    const job = await db.jobs.findOne({ slug: jobSlug, status: "open" }, { projection: { title: 1 } });
    if (!job) return { ok: false, error: "This job is no longer open." };

    // trust the bucket, not the browser: the file must really be there, within the rules, and BE
    // the type it claims (first bytes) — a renamed executable or an HTML page is rejected and removed
    const bucket = cvBucket();
    const stored = await headObject(bucket, cvKey);
    const extension = cvKey.split(".").pop()!;
    const start = stored && (await readStart(bucket, cvKey, 8));
    const genuine = start && SIGNATURES[extension]?.every((byte, index) => start[index] === byte);
    if (!stored || stored.size > CV_MAX_BYTES || !CV_TYPES[stored.contentType] || !genuine) {
      if (stored) await deleteObject(bucket, cvKey).catch(() => {});
      return { ok: false, error: "Please upload your CV again." };
    }

    // move it out of tmp/ (copy + delete). The final key is what the record keeps; a second
    // submit of the same upload finds tmp/ empty and stops above, so no duplicates.
    const finalKey = cvKey.replace("cv/tmp/", `cv/${new Date().getFullYear()}/`);
    if (!(await copyObject(bucket, cvKey, finalKey))) return { ok: false, error: "Something went wrong. Please try again." };
    await deleteObject(bucket, cvKey).catch(() => {});

    await db.jobApplications.insertOne({
      _id: newId(), jobId: job._id, jobTitle: job.title.en, name, email, phone, note: note || null, cvKey: finalKey, status: "new", createdAt: new Date(),
    });
    return { ok: true, data: undefined };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
