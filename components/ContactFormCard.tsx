"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FiCheck } from "react-icons/fi";
import Button from "@/components/Button";
import FormField from "@/components/FormField";
import { submitContactLead } from "@/server/inbox/public";

// `unitTypes` = the shared list from the CMS (Shared → Lookups), already in the page's language.
// Submissions land in the CMS under Inbox → Leads.
export default function ContactFormCard({ title, unitTypes }: { title?: string; unitTypes: { id: string; name: string }[] }) {
  const t = useTranslations("contact");
  const locale = useLocale() === "ar" ? "ar" : "en";
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) ?? "");
    setStatus("sending");
    setError(null);
    const result = await submitContactLead({
      name: value("name"), email: value("email"), phone: value("phone"), message: value("message"),
      unitTypeId: value("unitTypeId"), website: value("website"), locale,
    }).catch(() => ({ ok: false as const, error: "" }));
    if (result.ok) {
      form.reset();
      return setStatus("sent");
    }
    setStatus("idle");
    setError(t("formError"));
  }

  return (
    <div className="relative w-full max-w-[636px] overflow-hidden rounded-3xl bg-dark px-6 pt-10 pb-14 shadow-[0px_3px_3px_0px_rgba(0,0,0,0.1),0px_7.77px_16px_0px_rgba(0,0,0,0.06)] sm:px-10 sm:pt-12 sm:pb-20 lg:px-14 lg:pt-14 lg:pb-37">
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0px_4px_0px_0px_rgba(58,54,54,0.6),inset_0px_-8px_0px_0px_rgba(0,0,0,0.05)]" />

      <h3 className="font-heading text-[36px] leading-[48px] tracking-[-0.36px] text-accent">
        {title || t("formCardTitle")}
      </h3>

      {status === "sent" ? (
        <div role="status" className="mt-10 flex flex-col items-start gap-4 text-white">
          <span className="flex size-14 items-center justify-center rounded-full bg-accent text-dark">
            <FiCheck className="size-6" />
          </span>
          <p className="font-heading text-2xl">{t("formSentHeading")}</p>
          <p className="text-white/70">{t("formSentBody")}</p>
          <button type="button" onClick={() => setStatus("idle")} className="mt-2 text-sm text-accent underline underline-offset-4">
            {t("formSendAnother")}
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-6">
          <FormField name="name" required label={t("nameLabel")} placeholder={t("namePlaceholder")} type="text" />
          <FormField name="email" required label={t("emailLabel2")} placeholder={t("emailPlaceholder2")} type="email" />
          <FormField name="phone" label={t("phoneLabel")} placeholder={t("phonePlaceholder")} type="tel" />
          <FormField
            as="select"
            name="unitTypeId"
            label={t("unitLabel")}
            placeholder={t("unitPlaceholder")}
            options={unitTypes.map((type) => ({ value: type.id, label: type.name }))}
          />
          <FormField as="textarea" name="message" required label={t("messageLabel")} placeholder={t("messagePlaceholder")} />

          {/* honeypot — hidden from people and assistive tech, bots fill it */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

          {error && <p role="alert" className="text-sm text-red-300">{error}</p>}

          <Button as="button" type="submit" variant="solid" disabled={status === "sending"} className="mt-4 self-start !text-[#271b16]">
            {status === "sending" ? t("formSending") : t("submit")}
          </Button>
        </form>
      )}
    </div>
  );
}
