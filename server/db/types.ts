// The domain model, as MongoDB documents. `_id` is always a UUID string (never an
// ObjectId) so ids validate with z.uuid(), work in URLs and cross the server → client
// boundary as plain strings. Only translatable fields are Localized; slugs, numbers,
// dates, statuses, media and relationships are stored once per document.

export type Localized = { en: string; ar: string };
export type LocalizedList = { en: string[]; ar: string[] };
export type Seo = { title: Localized; description: Localized; keywords: LocalizedList; ogImage: string | null };

export type PublishStatus = "draft" | "published" | "archived";

// ─── Auth ────────────────────────────────────────────────────────────────────

export type UserDoc = {
  _id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: "admin" | "editor";
  failedLogins: number;
  lockedUntil: Date | null;
  createdAt: Date;
};

// _id = sha256 of the cookie token; the raw token never touches the database.
// A TTL index on expiresAt lets MongoDB delete expired sessions by itself.
export type SessionDoc = { _id: string; userId: string; expiresAt: Date };

// ─── Lookups ─────────────────────────────────────────────────────────────────

export type UnitTypeDoc = { _id: string; key: string; name: Localized; position: number };
export type AmenityDoc = { _id: string; key: string; label: Localized; position: number };

// ─── Projects ────────────────────────────────────────────────────────────────
// Story blocks, places, units and the investment assumptions are owned by exactly one
// project and never referenced from outside, so they are embedded. That makes every
// project save a single atomic document write — no transactions required.

export type StoryBlock = { heading: Localized; body: Localized; images: string[] };
export type Place = { category: "transport" | "education" | "shopping" | "food"; name: Localized; distanceKm: number };

export type ProjectUnit = {
  id: string;
  unitTypeId: string;
  image: string | null;
  sizeRange: Localized | null;
  // EGP. A unit needs a price and a rent to appear in the calculator; without them it only shows on the project page
  avgPrice: number | null;
  annualGrossRent: number | null;
  annualOpCosts: number | null;
};

// Per-project calculator overrides. Every number is optional: null = use the default from
// Pages → Calculator → Setup. Whether a project is offered at all is NOT stored here — the
// Calculator page owns that list (compositions.calculator), like Home owns its showcase.
export type Investment = {
  phaseLabel: Localized | null;
  occupancyPct: number | null;
  appreciationPct: number | null;
  deliveryMonth: number | null;
  rentalStartMonth: number | null;
};

export type ProjectDoc = {
  _id: string;
  slug: string;
  status: PublishStatus;
  buildStatus: "planning" | "under_construction" | "completed";
  year: number | null;
  name: Localized;
  location: Localized;
  tagline: Localized | null;
  summary: Localized | null;
  description: Localized | null;
  sector: Localized | null;
  sizeLabel: Localized | null;
  locationDescription: Localized | null;
  facilitiesDescription: Localized | null;
  unitsDescription: Localized | null;
  address: Localized | null;
  coverImage: string | null;
  heroMedia: string | null;
  mapImage: string | null;
  gallery: string[];
  lat: number | null;
  lng: number | null;
  storyBlocks: StoryBlock[];
  places: Place[];
  amenityIds: string[];
  units: ProjectUnit[];
  investment: Investment | null;
  position: number;
  seo: Seo | null;
  createdAt: Date;
  updatedAt: Date;
};

// ─── Posts & their categories ────────────────────────────────────────────────
// Categories are editor-managed (News, Events, Blogs, Press releases…). `kind` is the one
// thing code needs to know about a category: event categories add date/venue fields, and
// the kind picks the structured-data type (NewsArticle / BlogPosting / Event).

export type PostKind = "news" | "article" | "event";
export type PostCategoryDoc = { _id: string; key: string; name: Localized; kind: PostKind; position: number };

export type PostDoc = {
  _id: string;
  slug: string;
  categoryId: string;
  status: PublishStatus;
  // published + future publishedAt = scheduled; public reads filter on publishedAt <= now
  publishedAt: Date | null;
  title: Localized;
  excerpt: Localized | null;
  body: Localized | null;
  authorLabel: Localized | null;
  coverImage: string | null;
  gallery: string[];
  // only for posts whose category kind is "event"
  startsAt: Date | null;
  endsAt: Date | null;
  venue: Localized | null;
  registrationUrl: string | null;
  seo: Seo | null;
  createdAt: Date;
  updatedAt: Date;
};

// ─── Careers ─────────────────────────────────────────────────────────────────

export type JobDoc = {
  _id: string;
  slug: string;
  status: "draft" | "open" | "closed";
  employmentType: "full_time" | "part_time" | "contract" | "internship";
  openings: number;
  postedAt: string | null; // YYYY-MM-DD
  deadline: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  title: Localized;
  summary: Localized | null;
  intro: Localized | null;
  location: Localized | null;
  jobTypeLabel: Localized | null;
  experience: Localized | null;
  salaryLabel: Localized | null;
  responsibilities: LocalizedList | null;
  requirements: LocalizedList | null;
  seo: Seo | null;
  createdAt: Date;
  updatedAt: Date;
};

// ─── Shared entities ─────────────────────────────────────────────────────────

export type FaqDoc = { _id: string; question: Localized; answer: Localized; published: boolean; position: number };
export type PartnerDoc = { _id: string; name: Localized; logo: string | null; url: string | null; position: number };

// ─── Page composition ────────────────────────────────────────────────────────

// Typed copy per (page, section); _id = "<page>.<section>". The section set is fixed in
// lib/cms/pages.ts and each has its own zod schema — not an admin-composable block engine.
export type PageSectionDoc = { _id: string; page: string; section: string; data: Record<string, unknown>; updatedAt: Date };

// Page-owned relationships. Entities carry no "featured" flags: Home owns its pick and
// order; the Media Center owns its pinned main item. MongoDB has no foreign keys, so the
// delete actions clean these up (server/projects/actions.ts, server/posts/actions.ts)
// and reads ignore ids that no longer resolve.
// Both live in the "compositions" collection, one fixed-id document each.
export type HomeShowcaseDoc = { _id: "homeShowcase"; projectIds: string[] };
// which projects the investment calculator offers, in order
export type CalculatorDoc = { _id: "calculator"; projectIds: string[] };
// the single pinned "main item" of the Media Center listing
export type MainPostDoc = { _id: "mainPost"; postId: string | null };

// ─── Inbox ───────────────────────────────────────────────────────────────────

export type LeadDoc = {
  _id: string;
  source: "contact" | "calculator";
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  locale: string;
  unitTypeId: string | null;
  projectId: string | null;
  // calculator leads: assumption code + inputs + results the visitor was shown
  snapshot: unknown;
  readAt: Date | null;
  archivedAt: Date | null;
  createdAt: Date;
};

export type JobApplicationDoc = {
  _id: string;
  jobId: string | null;
  jobTitle: string; // survives job deletion
  name: string;
  email: string;
  phone: string | null;
  note: string | null;
  cvKey: string; // object key in the private R2 bucket — never a public URL
  status: "new" | "reviewed" | "shortlisted" | "rejected";
  createdAt: Date;
};

// per (action, ip, time window) counter for the public forms; expires by itself
export type RateLimitDoc = { _id: string; count: number; expiresAt: Date };

export type SubscriberDoc = { _id: string; email: string; locale: string; createdAt: Date };
