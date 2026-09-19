import "server-only";
import { db } from "@/server/db";
import type { Localized } from "@/server/db/types";
import type { Destination } from "@/lib/calculator";

// The one place calculator inputs are assembled. The public calculator and the CMS preview
// both read this, and both feed it to computeEstimate (lib/calculator.ts) — so what the
// admin previews is exactly what a visitor gets.

export type CalculatorSetup = {
  horizons: number[];
  defaultHorizon: number;
  occupancyPct: number;
  appreciationPct: number;
  deliveryMonth: number;
  rentalStartMonth: number;
  assumptionCode: string;
  effectiveDate: string;
};

// used until an admin saves Pages → Calculator → Setup for the first time
export const DEFAULT_SETUP: CalculatorSetup = {
  horizons: [3, 5, 7, 10],
  defaultHorizon: 5,
  occupancyPct: 80,
  appreciationPct: 6,
  deliveryMonth: 18,
  rentalStartMonth: 21,
  assumptionCode: "DEFAULT",
  effectiveDate: "2026-01-01",
};

export async function getCalculatorSetup(): Promise<CalculatorSetup> {
  const row = await db.pageSections.findOne({ _id: "calculator.setup" });
  if (!row) return DEFAULT_SETUP;
  const data = row.data as Omit<CalculatorSetup, "horizons"> & { horizons: { years: number }[] };
  return { ...DEFAULT_SETUP, ...data, horizons: data.horizons.map((h) => h.years).sort((a, b) => a - b) };
}

export type DestinationRow = Destination & { status: string; skippedUnits: number };

/**
 * Selected projects, in the Calculator page's order, with their effective assumptions
 * (project override ?? setup default) and only the units that can be calculated
 * (a price and a rent). `publishedOnly` is what the website uses; the CMS preview passes
 * false so drafts show up with a warning instead of silently missing.
 */
export async function buildDestinations(locale: "en" | "ar", publishedOnly: boolean): Promise<DestinationRow[]> {
  const [setup, selection, unitTypes] = await Promise.all([
    getCalculatorSetup(),
    db.calculator.findOne({ _id: "calculator" }),
    db.unitTypes.find().toArray(),
  ]);
  const ids = selection?.projectIds ?? [];
  if (ids.length === 0) return [];

  const projects = await db.projects.find({ _id: { $in: ids }, ...(publishedOnly ? { status: "published" } : {}) }).toArray();
  const pick = (value: Localized | null | undefined) => value?.[locale] ?? "";
  const typeOf = new Map(unitTypes.map((type) => [type._id, type]));

  return ids.flatMap((id) => {
    const project = projects.find((p) => p._id === id);
    if (!project) return [];
    const overrides = project.investment;

    const units = project.units.flatMap((unit) => {
      const type = typeOf.get(unit.unitTypeId);
      if (!type || !unit.avgPrice || !unit.annualGrossRent) return [];
      return [{
        key: type.key,
        name: pick(type.name),
        sizeRange: pick(unit.sizeRange),
        avgPrice: unit.avgPrice,
        annualGrossRent: unit.annualGrossRent,
        annualOpCosts: unit.annualOpCosts ?? 0,
      }];
    });
    // nothing to calculate → not a destination (the CMS preview still lists it, flagged)
    if (units.length === 0 && publishedOnly) return [];

    return [{
      id: project._id,
      slug: project.slug,
      name: pick(project.name),
      location: pick(project.location),
      phaseLabel: pick(overrides?.phaseLabel),
      image: project.coverImage ?? "",
      occupancyPct: overrides?.occupancyPct ?? setup.occupancyPct,
      appreciationPct: overrides?.appreciationPct ?? setup.appreciationPct,
      deliveryMonth: overrides?.deliveryMonth ?? setup.deliveryMonth,
      rentalStartMonth: overrides?.rentalStartMonth ?? setup.rentalStartMonth,
      assumptionCode: setup.assumptionCode,
      effectiveDate: setup.effectiveDate,
      unitTypes: units,
      status: project.status,
      skippedUnits: project.units.length - units.length,
    }];
  });
}
