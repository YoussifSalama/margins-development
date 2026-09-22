"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from "motion/react";
import { FiArrowUp, FiExternalLink, FiMail, FiPhone, FiX } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaWhatsapp, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { askChatbot, type ChatAction } from "@/server/chat/public";
import { useAutoScroll } from "@/components/chat/use-auto-scroll";
import { spring } from "@/lib/motion";

type Message = { role: "user" | "model"; text: string; action?: ChatAction };

const ACTION_ICONS: Record<ChatAction["kind"], React.ReactNode> = {
  whatsapp: <FaWhatsapp size={15} />, phone: <FiPhone size={15} />, email: <FiMail size={15} />,
  facebook: <FaFacebookF size={14} />, instagram: <FaInstagram size={15} />, linkedin: <FaLinkedinIn size={15} />,
  x: <FaXTwitter size={14} />, tiktok: <FaTiktok size={14} />, youtube: <FaYoutube size={16} />, none: null,
};

// A real, CMS-backed contact link the model was allowed to surface (server/chat/public.ts
// builds the href from Site settings — the model only picks which one, never the value).
function ActionPill({ action }: { action: ChatAction }) {
  return (
    <motion.a
      href={action.href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="me-auto mt-1 flex w-fit items-center gap-2 rounded-full bg-dark px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-black/10"
    >
      {ACTION_ICONS[action.kind]}
      {action.label}
      <FiExternalLink size={13} className="opacity-60" />
    </motion.a>
  );
}

// Bubble shape/behaviour adapted from shadcn-chatbot-kit's chat-message.tsx (MIT), but
// restyled with the site's own tokens (bg-faq-item, bg-accent, font-heading…) instead of
// the admin shadcn theme — the two token sets never mix (see app/admin/admin.css).
// Markdown, tool calls and attachments dropped: this bot only ever sends short plain text.
const bubble = cva("max-w-[82%] px-4 py-2.5 text-sm leading-relaxed shadow-sm", {
  variants: {
    isUser: { true: "ms-auto rounded-2xl rounded-br-md bg-accent text-white", false: "me-auto rounded-2xl rounded-bl-md bg-faq-item text-body" },
  },
});

// Same three-dot recipe as the kit's typing-indicator.tsx, ported to `motion`
// (the framer-motion fork already used site-wide) instead of a new Tailwind keyframe.
function TypingDots() {
  return (
    <div className="me-auto flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-md bg-faq-item px-4 py-3.5">
      {[0, 0.15, 0.3].map((delay) => (
        <motion.span
          key={delay}
          className="size-1.5 rounded-full bg-body/40"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// Floating bottom-corner assistant. Answers from the CMS FAQ list (server/chat/public.ts),
// falls back to small talk about Margins through the LLM.
export default function ChatWidget({ suggestions }: { suggestions: string[] }) {
  const t = useTranslations("chat");
  const locale = useLocale() === "ar" ? "ar" : "en";
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const { containerRef, handleScroll, handleTouchStart } = useAutoScroll([messages, sending]);

  async function ask(text: string) {
    if (!text || sending) return;
    const history = messages.slice(-12);
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setSending(true);
    const result = await askChatbot({ history, message: text, locale, website: "" }).catch(() => ({ ok: false as const, error: "" }));
    setMessages((m) => [...m, result.ok ? { role: "model", text: result.reply, action: result.action } : { role: "model", text: t("error") }]);
    setSending(false);
  }

  return (
    <div className="fixed bottom-5 end-5 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={spring}
            style={{ transformOrigin: "bottom right" }}
            className="flex h-[68vh] max-h-[600px] w-96 max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-black/5"
          >
            <div className="flex items-center gap-3 bg-gradient-to-br from-banner-grad-start to-banner-grad-end px-5 py-4">
              <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-accent/40">
                <img src="/favicon.ico" alt="" className="size-full object-cover" />
              </span>
              <div className="flex-1">
                <p className="font-heading text-base text-white">{t("title")}</p>
                <p className="text-xs text-white/60">Margins</p>
              </div>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type="button" onClick={() => setOpen(false)} aria-label={t("close")} className="text-white/70 hover:text-white">
                <FiX size={18} />
              </motion.button>
            </div>

            <div ref={containerRef} onScroll={handleScroll} onTouchStart={handleTouchStart} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.length === 0 && (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-muted">{t("greeting")}</p>
                  {suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((question) => (
                        <motion.button
                          key={question}
                          type="button"
                          onClick={() => ask(question)}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          className="rounded-full border border-field-border px-3.5 py-2 text-start text-xs font-medium text-body hover:border-accent hover:text-accent"
                        >
                          {question}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {messages.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex flex-col">
                  <p className={bubble({ isUser: m.role === "user" })}>{m.text}</p>
                  {m.action && <ActionPill action={m.action} />}
                </motion.div>
              ))}
              {sending && <TypingDots />}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input.trim());
              }}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("placeholder")}
                className="flex-1 rounded-full bg-surface px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-placeholder focus:ring-2 focus:ring-accent/40"
              />
              <motion.button
                type="submit"
                disabled={sending || !input.trim()}
                aria-label={t("send")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                transition={spring}
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-md shadow-accent/30 disabled:opacity-40"
              >
                <FiArrowUp size={16} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("title")}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ y: -4, scale: 1.05 }}
        whileTap={{ scale: 1.1, y: -4 }}
        transition={spring}
        className="flex size-14 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/50"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={open ? "close" : "chat"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
            {open ? <FiX size={22} /> : <img src="/favicon.ico" alt="" className="size-7 rounded-full" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
