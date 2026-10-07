import "server-only";
import { randomUUID } from "node:crypto";
import { MongoClient, type Collection } from "mongodb";
import type {
  AmenityDoc, AuditLogDoc, CalculatorDoc, FaqDoc, HomeShowcaseDoc, JobApplicationDoc, JobDoc, LeadDoc, MainPostDoc, PageSectionDoc, PartnerDoc,
  PostCategoryDoc, PostDoc, RateLimitDoc, ProjectDoc, SessionDoc, SubscriberDoc, UnitTypeDoc, UserDoc,
} from "./types";

// One client per process; reused across dev hot reloads and warm serverless invocations.
const globalForDb = globalThis as unknown as { mongo?: MongoClient; mongoReady?: Promise<void> };

// Never close this client during a request. If its topology closes anyway (or a connect
// fails) drop it, so the next call builds a fresh one instead of reusing a dead client.
function getClient() {
  if (globalForDb.mongo) return globalForDb.mongo;
  // Fail in 8s, not the default 30s, when the database can't be reached (IP not allow-listed
  // in Atlas, VPN, wrong URI) — so the CMS shows an error instead of hanging.
  const client = new MongoClient(process.env.MONGODB_URI!, { serverSelectionTimeoutMS: 8000, maxPoolSize: 10 });
  const reset = () => {
    if (globalForDb.mongo === client) globalForDb.mongo = undefined;
  };
  client.on("topologyClosed", reset);
  client.connect().catch(reset);
  return (globalForDb.mongo = client);
}

type Docs = {
  users: UserDoc; sessions: SessionDoc; unitTypes: UnitTypeDoc; amenities: AmenityDoc; projects: ProjectDoc;
  postCategories: PostCategoryDoc; posts: PostDoc; jobs: JobDoc; faqs: FaqDoc; partners: PartnerDoc;
  pageSections: PageSectionDoc; homeShowcase: HomeShowcaseDoc; mainPost: MainPostDoc; calculator: CalculatorDoc;
  leads: LeadDoc; jobApplications: JobApplicationDoc; subscribers: SubscriberDoc; rateLimits: RateLimitDoc;
  auditLogs: AuditLogDoc;
};
// three typed views share the "compositions" collection
const names: Record<keyof Docs, string> = {
  users: "users", sessions: "sessions", unitTypes: "unitTypes", amenities: "amenities", projects: "projects",
  postCategories: "postCategories", posts: "posts", jobs: "jobs", faqs: "faqs", partners: "partners",
  pageSections: "pageSections", homeShowcase: "compositions", mainPost: "compositions", calculator: "compositions",
  leads: "leads", jobApplications: "jobApplications", subscribers: "subscribers", rateLimits: "rateLimits",
  auditLogs: "auditLogs",
};

// Resolved on every access, so call sites always get a collection of the live client.
export const db = new Proxy({} as { [K in keyof Docs]: Collection<Docs[K]> }, {
  get: (_, key: keyof Docs) => getClient().db().collection(names[key]), // db name comes from the connection string
});

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
  await globalForDb.mongo?.close();
};
