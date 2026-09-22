"use server";

import { z } from "zod";
import { db } from "@/server/db";
import { allow } from "@/server/rate-limit";
import { pick } from "@/server/public/core";
import type { Locale } from "@/lib/content";
import { loadChatSettings, resolveApiKey } from "./store";

// Public (no session) — same shape as the other public forms in server/inbox/public.ts:
// zod-validated input, honeypot, per-IP budget.

const ACTION_KINDS = ["whatsapp", "phone", "email", "facebook", "instagram", "linkedin", "x", "tiktok", "youtube", "none"] as const;

const chatMessage = z.object({ role: z.enum(["user", "model"]), text: z.string().trim().min(1).max(1000) });

const chatInput = z.object({
  history: z.array(chatMessage).max(12),
  message: z.string().trim().min(1).max(1000),
  locale: z.enum(["en", "ar"]),
  website: z.string().max(0), // honeypot
});

export type ChatAction = { kind: (typeof ACTION_KINDS)[number]; label: string; href: string };
export type ChatResult = { ok: true; reply: string; action?: ChatAction } | { ok: false; error: string };

const TOO_MANY: ChatResult = { ok: false, error: "Too many messages. Please wait a moment and try again." };
const UNAVAILABLE: ChatResult = { ok: false, error: "Sorry, I couldn't respond right now. Please try again." };

async function faqContext(locale: Locale) {
  const faqs = await db.faqs.find({ published: true }).sort({ position: 1 }).toArray();
  return faqs.map((f) => `Q: ${pick(f.question, locale)}\nA: ${pick(f.answer, locale)}`).join("\n\n");
}

const LABELS: Record<string, string> = {
  whatsapp: "Chat on WhatsApp", phone: "Call us", email: "Email us", facebook: "Facebook",
  instagram: "Instagram", linkedin: "LinkedIn", x: "X (Twitter)", tiktok: "TikTok", youtube: "YouTube",
};

// Real contact details from Shared → Site settings — never let the model invent a number or
// link. It only picks WHICH one to offer; the actual href is always built from this data.
async function contactActions() {
  const [contactRow, socialsRow] = await Promise.all([
    db.pageSections.findOne({ page: "settings", section: "contact" }, { projection: { data: 1 } }),
    db.pageSections.findOne({ page: "settings", section: "socials" }, { projection: { data: 1 } }),
  ]);
  const contact = (contactRow?.data ?? {}) as { phone?: string; whatsapp?: string; email?: string };
  const socials = ((socialsRow?.data as { items?: { platform: string; url: string }[] })?.items ?? []).filter((s) => s.url);

  // Contact details are the canonical source for whatsapp/phone/email — applied after the
  // socials list so a "whatsapp" entry there (same platform key) never overrides it.
  const actions: Record<string, ChatAction> = {};
  for (const s of socials) if (LABELS[s.platform]) actions[s.platform] = { kind: s.platform as ChatAction["kind"], label: LABELS[s.platform], href: s.url };
  if (contact.whatsapp) actions.whatsapp = { kind: "whatsapp", label: LABELS.whatsapp, href: `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}` };
  if (contact.phone) actions.phone = { kind: "phone", label: LABELS.phone, href: `tel:${contact.phone}` };
  if (contact.email) actions.email = { kind: "email", label: LABELS.email, href: `mailto:${contact.email}` };
  return actions;
}

// First few FAQ questions, shown as suggestion chips before the visitor types anything.
export async function chatSuggestions(locale: Locale) {
  const faqs = await db.faqs.find({ published: true }).sort({ position: 1 }).limit(3).toArray();
  return faqs.map((f) => pick(f.question, locale));
}

// ponytail: whole FAQ list stuffed into the prompt instead of a vector store — fine while
// there are a few dozen entries. Move to embeddings + retrieval if that list gets large.
export async function askChatbot(raw: z.input<typeof chatInput>): Promise<ChatResult> {
  const parsed = chatInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Message is too long." };
  // Gemini's free tier is one shared budget for the whole site, not per visitor — this per-IP
  // cap just stops one visitor from burning through it.
  if (!(await allow("chat", 15, 300))) return TOO_MANY;
  const { history, message, locale } = parsed.data;

  const settings = await loadChatSettings();
  const apiKey = await resolveApiKey(settings);
  if (!apiKey) return UNAVAILABLE;

  const actions = await contactActions();
  const language = locale === "ar" ? "Arabic" : "English";
  const basePrompt =
    settings.systemPrompt ||
    `You are the website assistant for Margins, a real estate developer. Answer only from the FAQ list below, ` +
      `plus brief courteous small talk about Margins. If the question isn't covered, say you don't know and point ` +
      `to the contact page. Keep answers short (2-4 sentences).`;
  const contactList = Object.keys(actions).length
    ? `\n\nAvailable contact methods (set "action" to the matching key if the visitor asks for one of these, "none" otherwise):\n${Object.keys(actions).join(", ")}`
    : "";
  const systemInstruction = `${basePrompt} Always reply in ${language}.\n\nFAQs:\n${await faqContext(locale)}${contactList}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [...history.map((h) => ({ role: h.role, parts: [{ text: h.text }] })), { role: "user", parts: [{ text: message }] }],
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.4,
            // gemini-3.6-flash "thinks" by default, and thought tokens count against
            // maxOutputTokens — a short FAQ answer doesn't need chain-of-thought, and without
            // this a reply can silently come back empty (MAX_TOKENS spent entirely on thinking).
            thinkingConfig: { thinkingBudget: 0 },
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: { reply: { type: "STRING" }, action: { type: "STRING", enum: [...ACTION_KINDS] } },
              required: ["reply", "action"],
            },
          },
        }),
      },
    );
    if (!response.ok) throw new Error(`gemini ${response.status}: ${await response.text()}`);
    const data = await response.json();
    const text: string | undefined = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return UNAVAILABLE;
    const parsed = JSON.parse(text) as { reply: string; action: string };
    return { ok: true, reply: parsed.reply.trim(), action: actions[parsed.action] };
  } catch (error) {
    console.error("chat failed:", error);
    return UNAVAILABLE;
  }
}
