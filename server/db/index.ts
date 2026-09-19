import "server-only";
import { randomUUID } from "node:crypto";
import { MongoClient } from "mongodb";
import type {
  AmenityDoc, AuditLogDoc, CalculatorDoc, FaqDoc, HomeShowcaseDoc, JobApplicationDoc, JobDoc, LeadDoc, MainPostDoc, PageSectionDoc, PartnerDoc,
  PostCategoryDoc, PostDoc, RateLimitDoc, ProjectDoc, SessionDoc, SubscriberDoc, UnitTypeDoc, UserDoc,
} from "./types";

// One client per process; reused across dev hot reloads and warm serverless invocations.
const globalForDb = globalThis as unknown as { mongo?: MongoClient; mongoReady?: Promise<void> };
// Fail in 8s, not the default 30s, when the database can't be reached (IP not allow-listed
// in Atlas, VPN, wrong URI) — so the CMS shows an error instead of hanging.
const client = (globalForDb.mongo ??= new MongoClient(process.env.MONGODB_URI!, { serverSelectionTimeoutMS: 8000 }));
const database = client.db(); // database name comes from the connection string

export const db = {
  users: database.collection<UserDoc>("users"),
  sessions: database.collection<SessionDoc>("sessions"),
  unitTypes: database.collection<UnitTypeDoc>("unitTypes"),
  amenities: database.collection<AmenityDoc>("amenities"),
  projects: database.collection<ProjectDoc>("projects"),
  postCategories: database.collection<PostCategoryDoc>("postCategories"),
  posts: database.collection<PostDoc>("posts"),
  jobs: database.collection<JobDoc>("jobs"),
  faqs: database.collection<FaqDoc>("faqs"),
  partners: database.collection<PartnerDoc>("partners"),
  pageSections: database.collection<PageSectionDoc>("pageSections"),
  // two typed views of the same collection
  homeShowcase: database.collection<HomeShowcaseDoc>("compositions"),
  mainPost: database.collection<MainPostDoc>("compositions"),
  calculator: database.collection<CalculatorDoc>("compositions"),
  leads: database.collection<LeadDoc>("leads"),
  jobApplications: database.collection<JobApplicationDoc>("jobApplications"),
  subscribers: database.collection<SubscriberDoc>("subscribers"),
  rateLimits: database.collection<RateLimitDoc>("rateLimits"),
  auditLogs: database.collection<AuditLogDoc>("auditLogs"),
};

// MongoDB has no schema to migrate, but uniqueness and expiry are enforced by indexes.
// createIndex is idempotent, so this runs once per process instead of as a manual step
// someone can forget. Scripts await `ready`; request handlers don't need to.
async function ensureIndexes() {
  await Promise.all([
    db.users.createIndex({ email: 1 }, { unique: true }),
    db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.unitTypes.createIndex({ key: 1 }, { unique: true }),
    db.amenities.createIndex({ key: 1 }, { unique: true }),
    db.projects.createIndex({ slug: 1 }, { unique: true }),
    db.projects.createIndex({ status: 1, position: 1 }),
    db.projects.createIndex({ "units.unitTypeId": 1 }),
    db.posts.createIndex({ slug: 1 }, { unique: true }),
    db.postCategories.createIndex({ key: 1 }, { unique: true }),
    db.posts.createIndex({ categoryId: 1, status: 1, publishedAt: -1 }),
    db.jobs.createIndex({ slug: 1 }, { unique: true }),
    db.pageSections.createIndex({ page: 1, section: 1 }, { unique: true }),
    db.leads.createIndex({ createdAt: -1 }),
    db.jobApplications.createIndex({ jobId: 1, createdAt: -1 }),
    db.subscribers.createIndex({ email: 1 }, { unique: true }),
    db.rateLimits.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.auditLogs.createIndex({ createdAt: 1 }, { expireAfterSeconds: 400 * 24 * 60 * 60 }),
  ]);
}

export const ready = (globalForDb.mongoReady ??= ensureIndexes().catch((error) => {
  console.error("MongoDB index setup failed:", error);
  globalForDb.mongoReady = undefined; // retry on next import/reload
}));

export const newId = () => randomUUID();

/** `_id` → `id`, so nothing outside the data layer knows which database this is. */
export const withId = <T extends { _id: string }>({ _id, ...rest }: T) => ({ id: _id, ...rest });

// scripts only. Waits for index setup first, so closing can never interrupt it.
export const closeDb = async () => {
  await ready;
  await client.close();
};
