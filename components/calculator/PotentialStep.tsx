"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { animate, motion, AnimatePresence } from "motion/react";
import { FiArrowLeft, FiChevronDown } from "react-icons/fi";
import Button from "@/components/Button";
import { fadeUpBounce, spring } from "@/lib/motion";
import {
  computeEstimate,
  formatEGP,
  formatEGPCompact,
  type Destination,
  type UnitTypeAssumption,
} from "@/lib/calculator";

export default function PotentialStep({
  destination,
  unitType,
  years,
  onEdit,
  onStartOver,
  onRequest,
  disclaimer,
}: {
  /** CMS legal text; {date} is replaced with the assumption set's effective date */
  disclaimer?: string;
  destination: Destination;
  unitType: UnitTypeAssumption;
  years: number;
  onEdit: () => void;
  onStartOver: () => void;
  onRequest: () => void;
}) {
  const t = useTranslations("calculator.potentialStep");
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);
  const estimate = computeEstimate(destination, unitType, years);
  const calculationDate = new Intl.DateTimeFormat(undefined, {
    month: "short",
    year: "numeric",
  }).format(new Date());

  const rentalBarPct = Math.min(
    100,
    (estimate.cumulativeNetRent / estimate.totalGrossReturn) * 100,
  );
  const apprBarPct = Math.min(
    100,
    (estimate.capitalAppreciation / estimate.totalGrossReturn) * 100,
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
      }}
      className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6"
    >
      <button
        type="button"
        onClick={onEdit}
        className="flex items-center gap-2 text-sm font-medium tracking-wide text-accent uppercase"
      >
        <FiArrowLeft className="size-3.5 rtl:rotate-180" />
        {t("editSelection")}
      </button>

      <motion.div
        variants={fadeUpBounce}
        className="w-full overflow-hidden rounded-3xl bg-dark text-white"
      >
        <div className="p-8 sm:p-10">
          <p className="text-xs tracking-wide text-white/60 uppercase">
            {t("summary", {
              destination: destination.name,
              unitType: unitType.name,
              years,
            })}
          </p>
          <p className="mt-4 font-heading text-6xl text-accent tabular-nums">
            <CountUp value={estimate.avgAnnualReturnPct} />
          </p>
          <p className="mt-2 text-lg">{t("avgAnnualReturn")}</p>
          <p className="mt-4 max-w-2xl text-sm text-white/60">
            {t("description", { month: destination.rentalStartMonth })}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 border-t border-white/10 p-8 sm:grid-cols-4 sm:p-10">
          <Stat
            label={t("avgUnitPrice")}
            value={formatEGPCompact(estimate.avgPrice, 2)}
          />
          <Stat
            label={t("netRentalYield")}
            value={`${estimate.netRentalYieldPct.toFixed(1)}%`}
          />
          <Stat
            label={t("cumulativeNetRent")}
            value={formatEGPCompact(estimate.cumulativeNetRent, 2)}
          />
          <Stat
            label={t("projectedValueHorizon", { years })}
            value={formatEGPCompact(estimate.projectedValue, 2)}
          />
        </div>
      </motion.div>

      <motion.div
        variants={fadeUpBounce}
        className="grid w-full gap-6 sm:grid-cols-2"
      >
        <div className="rounded-2xl bg-background p-6 ring-1 ring-border">
          <h3 className="font-semibold text-foreground">
            {t("timeline.heading")}
          </h3>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            <TimelineRow
              dot="accent"
              label={t("timeline.calculationDate")}
              value={calculationDate}
            />
            <TimelineRow
              dot="dark"
              label={t("timeline.expectedDelivery")}
              value={t("timeline.month", { month: destination.deliveryMonth })}
            />
            <TimelineRow
              dot="dark"
              label={t("timeline.rentalStarts")}
              value={t("timeline.month", {
                month: destination.rentalStartMonth,
              })}
            />
            <TimelineRow
              dot="accent"
              label={t("timeline.horizonEnd")}
              value={t("timeline.month", { month: estimate.horizonMonths })}
            />
          </ul>
        </div>

        <div className="rounded-2xl bg-background p-6 ring-1 ring-border">
          <h3 className="font-semibold text-foreground">
            {t("breakdown.heading")}
          </h3>
          <div className="mt-4 flex flex-col gap-4 text-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-muted">
                  {t("breakdown.rentalIncome")}
                </span>
                <span className="font-medium text-foreground">
                  {formatEGP(estimate.cumulativeNetRent)}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border">
                <Bar pct={rentalBarPct} className="bg-accent" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-muted">
                  {t("breakdown.capitalAppreciation")}
                </span>
                <span className="font-medium text-foreground">
                  {formatEGP(estimate.capitalAppreciation)}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border">
                <Bar pct={apprBarPct} className="bg-dark" />
              </div>
            </div>
            <div className="h-px w-full bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-muted">
                {t("breakdown.totalGrossReturn")}
              </span>
              <span className="font-semibold text-foreground">
                {formatEGP(estimate.totalGrossReturn)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">{t("breakdown.roi")}</span>
              <span className="font-semibold text-accent tabular-nums">
                <CountUp value={estimate.roiPct} />
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={fadeUpBounce}
        className="w-full rounded-2xl bg-background ring-1 ring-border"
      >
        <button
          type="button"
          onClick={() => setAssumptionsOpen((v) => !v)}
          aria-expanded={assumptionsOpen}
          className="flex w-full items-center justify-between px-6 py-5"
        >
          <span className="font-medium text-foreground">
            {t("assumptions.toggle")}
          </span>
          <motion.span
            animate={{ rotate: assumptionsOpen ? 180 : 0 }}
            transition={spring}
          >
            <FiChevronDown className="size-4 text-foreground" />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {assumptionsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 gap-4 border-t border-border px-6 py-6 text-sm sm:grid-cols-3">
                <Assumption
                  label={t("assumptions.assumptionSet")}
                  value={destination.assumptionCode}
                />
                <Assumption
                  label={t("assumptions.effectiveDate")}
                  value={destination.effectiveDate}
                />
                <Assumption
                  label={t("assumptions.weightingMethod")}
                  value={t("assumptions.weightingMethodValue")}
                />
                <Assumption
                  label={t("assumptions.occupancy")}
                  value={`${destination.occupancyPct.toFixed(1)}%`}
                />
                <Assumption
                  label={t("assumptions.appreciation")}
                  value={`${destination.appreciationPct.toFixed(1)}%`}
                />
                <Assumption
                  label={t("assumptions.opCosts")}
                  value={formatEGP(unitType.annualOpCosts)}
                />
                <Assumption
                  label={t("assumptions.grossRent")}
                  value={formatEGP(unitType.annualGrossRent)}
                />
                <Assumption
                  label={t("assumptions.currency")}
                  value={t("assumptions.currencyValue")}
                />
                <Assumption
                  label={t("assumptions.acquisitionCosts")}
                  value={t("assumptions.acquisitionCostsValue")}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        variants={fadeUpBounce}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <Button as="button" type="button" onClick={onRequest} variant="solid">
          {t("requestCta")}
        </Button>
        <button
          type="button"
          onClick={onStartOver}
          className="inline-flex items-center justify-center rounded-full border border-border px-8 py-4 text-base font-semibold text-foreground transition hover:bg-black/5"
        >
          {t("startOver")}
        </button>
      </motion.div>

      <p className="max-w-2xl text-center text-xs text-muted">
        {/* legal text from the CMS (Pages → Calculator → Disclaimer); the translation file is only the fallback */}
        {(disclaimer || t("disclaimer", { date: "{date}" })).replaceAll("{date}", destination.effectiveDate)}
      </p>
    </motion.div>
  );
}

// counts 0 → value once on mount; writes textContent directly so 60fps ticks don't re-render the step
function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.4,
      delay: 0.3,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${v.toFixed(1)}%`;
      },
    });
    return () => controls.stop();
  }, [value]);
  return <span ref={ref}>{value.toFixed(1)}%</span>;
}

function Bar({ pct, className }: { pct: number; className: string }) {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${pct}%` }}
      transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
      className={`h-full rounded-full ${className}`}
    />
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-white/60">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function TimelineRow({
  dot,
  label,
  value,
}: {
  dot: "accent" | "dark";
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-2 text-muted">
        <span
          className={`size-1.5 shrink-0 rounded-full ${dot === "accent" ? "bg-accent" : "bg-dark"}`}
        />
        {label}
      </span>
      <span className="shrink-0 font-medium text-foreground">{value}</span>
    </li>
  );
}

function Assumption({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted">{label}</p>
      <p className="mt-1 font-medium text-foreground">{value}</p>
    </div>
  );
}
