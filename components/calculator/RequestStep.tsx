"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import Button from "@/components/Button";
import { fadeUpBounce, spring } from "@/lib/motion";
import { submitCalculatorLead } from "@/server/inbox/public";
import {
  computeEstimate,
  formatEGPCompact,
  type Destination,
  type UnitTypeAssumption,
} from "@/lib/calculator";

const fieldClass =
  "w-full rounded-xl bg-background px-4 py-3 text-base text-foreground ring-1 ring-border outline-none transition placeholder:text-muted/60 focus:ring-2 focus:ring-accent";

export default function RequestStep({
  destination,
  unitType,
  years,
  onBack,
  onStartOver,
}: {
  destination: Destination;
  unitType: UnitTypeAssumption;
  years: number;
  onBack: () => void;
  onStartOver: () => void;
}) {
  const t = useTranslations("calculator.requestStep");
  const locale = useLocale();
  const estimate = computeEstimate(destination, unitType, years);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setStatus("sending");
    setError(null);
    const result = await submitCalculatorLead({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      message: String(data.get("message") ?? ""),
      website: String(data.get("website") ?? ""),
      locale: locale === "ar" ? "ar" : "en",
      destinationSlug: destination.slug,
      unitTypeKey: unitType.key,
      years,
    }).catch(() => ({ ok: false as const, error: t("error") }));
    if (result.ok) return setStatus("sent");
    setStatus("idle");
    setError(t("error"));
  }

  if (status === "sent") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 text-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={spring}
          className="flex size-16 items-center justify-center rounded-full bg-accent text-white"
        >
          <FiCheck className="size-7" />
        </motion.span>
        <h2 className="text-2xl font-semibold text-foreground">
          {t("sentHeading")}
        </h2>
        <p className="text-muted">{t("sentBody")}</p>
        <button
          type="button"
          onClick={onStartOver}
          className="mt-2 rounded-full border border-border px-8 py-4 text-base font-semibold text-foreground transition hover:bg-black/5"
        >
          {t("startOver")}
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
      }}
      className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6"
    >
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium tracking-wide text-accent uppercase"
      >
        <FiArrowLeft className="size-3.5 rtl:rotate-180" />
        {t("back")}
      </button>
      <h2 className="text-2xl font-semibold text-foreground">{t("heading")}</h2>

      <div className="grid w-full gap-6 lg:grid-cols-[2fr_3fr]">
        {/* what gets sent along with the form */}
        <motion.div
          variants={fadeUpBounce}
          className="flex flex-col gap-5 rounded-3xl bg-dark p-8 text-white"
        >
          <p className="text-xs tracking-wide text-white/60 uppercase">
            {t("summaryHeading")}
          </p>
          <dl className="flex flex-col gap-4 text-sm">
            <Row label={t("destination")} value={destination.name} />
            <Row
              label={t("unitType")}
              value={`${unitType.name} · ${unitType.sizeRange}`}
            />
            <Row label={t("horizon")} value={t("years", { years })} />
            <div className="h-px w-full bg-white/10" />
            <Row
              label={t("avgUnitPrice")}
              value={formatEGPCompact(estimate.avgPrice, 2)}
            />
            <Row
              label={t("projectedValue")}
              value={formatEGPCompact(estimate.projectedValue, 2)}
            />
            <Row label={t("roi")} value={`${estimate.roiPct.toFixed(1)}%`} />
          </dl>
          <div className="mt-auto">
            <p className="font-heading text-5xl text-accent">
              {estimate.avgAnnualReturnPct.toFixed(1)}%
            </p>
            <p className="mt-1 text-sm text-white/60">{t("avgAnnualReturn")}</p>
          </div>
        </motion.div>

        <motion.form
          variants={fadeUpBounce}
          onSubmit={onSubmit}
          className="flex flex-col gap-4 rounded-3xl bg-background p-8 ring-1 ring-border"
        >
          <Field label={t("name")}>
            <input
              name="name"
              required
              minLength={2}
              maxLength={120}
              autoComplete="name"
              className={fieldClass}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("email")}>
              <input
                name="email"
                type="email"
                required
                maxLength={200}
                autoComplete="email"
                dir="ltr"
                className={fieldClass}
              />
            </Field>
            <Field label={t("phone")}>
              <input
                name="phone"
                type="tel"
                maxLength={40}
                autoComplete="tel"
                dir="ltr"
                className={fieldClass}
              />
            </Field>
          </div>
          <Field label={t("message")}>
            <textarea
              name="message"
              rows={4}
              maxLength={2000}
              placeholder={t("messagePlaceholder")}
              className={`${fieldClass} resize-none`}
            />
          </Field>
          {/* honeypot — hidden from people and assistive tech, bots fill it */}
          <input
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="hidden"
          />

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          <Button
            as="button"
            type="submit"
            variant="solid"
            disabled={status === "sending"}
            className="mt-2 self-start disabled:opacity-60"
          >
            {status === "sending" ? t("sending") : t("submit")}
          </Button>
        </motion.form>
      </div>
    </motion.div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-white/60">{label}</dt>
      <dd className="text-end font-medium">{value}</dd>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
      {label}
      {children}
    </label>
  );
}
