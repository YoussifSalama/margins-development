"use server";

import { z } from "zod";
import { defineAction } from "@/server/action";
import { audit } from "@/server/audit";
import { encryptSecret } from "@/server/secret";
import { loadChatSettings, saveChatSettings } from "./store";

const settingsInput = z.object({
  apiKey: z.string().trim().max(200), // blank = leave the stored key unchanged
  systemPrompt: z.string().trim().max(4000),
});

export const saveChatbotSettings = defineAction(
  settingsInput,
  async ({ apiKey, systemPrompt }, user) => {
    const current = await loadChatSettings();
    await saveChatSettings({ apiKeyEnc: apiKey ? encryptSecret(apiKey) : current.apiKeyEnc, systemPrompt });
    await audit(user, "section.saved", { page: "chatbot", section: "settings" });
  },
  { role: "admin" },
);

export const clearChatbotApiKey = defineAction(
  z.object({}),
  async (_input, user) => {
    const current = await loadChatSettings();
    await saveChatSettings({ ...current, apiKeyEnc: null });
    await audit(user, "section.saved", { page: "chatbot", section: "settings" });
  },
  { role: "admin" },
);
