import "server-only";
import { db } from "@/server/db";
import { decryptSecret } from "@/server/secret";

// One doc, same pageSections collection as every other CMS section (_id: "chatbot.settings").
const DOC = { page: "chatbot", section: "settings" };

export type ChatSettings = { apiKeyEnc: string | null; systemPrompt: string };

export async function loadChatSettings(): Promise<ChatSettings> {
  const row = await db.pageSections.findOne(DOC, { projection: { data: 1 } });
  const data = (row?.data ?? {}) as Partial<ChatSettings>;
  return { apiKeyEnc: data.apiKeyEnc ?? null, systemPrompt: data.systemPrompt ?? "" };
}

export async function saveChatSettings(next: ChatSettings) {
  await db.pageSections.updateOne(DOC, { $set: { data: next, updatedAt: new Date() }, $setOnInsert: { _id: `${DOC.page}.${DOC.section}` } }, { upsert: true });
}

// env var wins when set — the DB key is the fallback for whoever can't set env vars (e.g. no server access)
export async function resolveApiKey(settings: ChatSettings) {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  return settings.apiKeyEnc ? decryptSecret(settings.apiKeyEnc) : null;
}
