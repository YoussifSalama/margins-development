import "server-only";
import { db, newId } from "@/server/db";
import { clientIp } from "@/server/rate-limit";
import type { SessionUser } from "@/server/auth/session";

// Who did what, for the actions that matter: sign-ins, users, calculator figures, personal
// data (viewing CVs, deleting leads) and deletions. Never blocks the action it records.
export async function audit(user: Pick<SessionUser, "id" | "email"> | null, action: string, detail: Record<string, unknown> = {}) {
  try {
    await db.auditLogs.insertOne({ _id: newId(), userId: user?.id ?? null, email: user?.email ?? null, action, detail, ip: await clientIp(), createdAt: new Date() });
  } catch (error) {
    console.error("audit log failed:", error);
  }
}
