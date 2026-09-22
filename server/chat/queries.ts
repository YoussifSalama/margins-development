import "server-only";
import { requireAdmin } from "@/server/auth/session";
import { loadChatSettings } from "./store";

// The stored key is never sent to the browser — only whether one exists, and which source wins.
export async function getChatSettings() {
  await requireAdmin();
  const settings = await loadChatSettings();
  return { hasEnvKey: Boolean(process.env.GEMINI_API_KEY), hasDbKey: Boolean(settings.apiKeyEnc), systemPrompt: settings.systemPrompt };
}
