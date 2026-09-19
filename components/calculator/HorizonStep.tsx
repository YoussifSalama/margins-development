"use client";

import { useTranslations } from "next-intl";
import { FiArrowLeft } from "react-icons/fi";
import {
  computeEstimate,
  formatEGPCompact,
  type Destination,
  type UnitTypeAssumption,
} from "@/lib/calculator";

export default function HorizonStep({
  destination,
  unitType,
  years,
  horizons,
  onYearsChange,
  onBack,
  onContinue,
}: {
  destination: Destination;
  unitType: UnitTypeAssumption;
  years: number;
  /** the holding periods on offer, from the CMS */
  horizons: number[];
  onYearsChange: (years: number) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const t = useTranslations("calculator.horizonStep");
  const estimate = computeEstimate(destination, unitType, years);
  const index = Math.max(0, horizons.indexOf(years));

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium tracking-wide text-accent uppercase"
      >
        <FiArrowLeft className="size-3.5 rtl:rotate-180" />
        {unitType.name} · {destination.name}
      </button>
      <h2 className="text-2xl font-semibold text-foreground">{t("heading")}</h2>

      <div className="w-full max-w-lg rounded-3xl bg-background p-8 ring-1 ring-border">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {horizons.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => onYearsChange(y)}
              className={`flex h-10 items-center justify-center rounded-full px-5 text-sm font-medium transition ${
                y === years
                  ? "bg-accent text-white"
                  : "border border-border text-muted hover:bg-black/5"
              }`}
            >
              {y}y
            </button>
          ))}
        </div>

        <input
          type="range"
          min={0}
          max={horizons.length - 1}
          step={1}
          value={index}
          onChange={(e) => onYearsChange(horizons[Number(e.target.value)])}
          className="mt-8 w-full accent-accent"
          aria-label={t("heading")}
        />
        <div className="mt-2 flex justify-between text-xs text-muted">
          {horizons.map((y) => (
            <span key={y}>{y}y</span>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-surface p-6">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">
            {t("outlook", { years })}
          </p>
          <div className="mt-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted">{t("estAnnualReturn")}</p>
              <p className="mt-1 font-heading text-3xl text-foreground">
                {estimate.avgAnnualReturnPct.toFixed(1)}%
              </p>
            </div>
            <div className="text-end">
              <p className="text-sm text-muted">{t("projectedValue")}</p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {formatEGPCompact(estimate.projectedValue, 2)}
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted">
            {t("rentalNote", { month: destination.rentalStartMonth })}
          </p>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="mt-6 w-full rounded-full bg-dark py-4 text-base font-semibold text-white transition hover:brightness-110"
        >
          {t("viewPotential")}
        </button>
      </div>
    </div>
  );
}
