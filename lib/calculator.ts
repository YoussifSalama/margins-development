// Shared by the website calculator, the lead action and the CMS preview: the types the
// calculator works with and the ONE formula (computeEstimate). The data itself comes from the
// CMS — server/public/calculator.ts — not from this file.

export type UnitTypeAssumption = {
  /** the unit type's key from Shared → Lookups (studio, oneBed, …) — editors can add more */
  key: string;
  name: string;
  sizeRange: string;
  avgPrice: number;
  annualGrossRent: number;
  annualOpCosts: number;
};

export type Destination = {
  id: string;
  slug: string;
  name: string;
  location: string;
  phaseLabel: string;
  image: string;
  occupancyPct: number;
  appreciationPct: number;
  deliveryMonth: number;
  rentalStartMonth: number;
  assumptionCode: string;
  effectiveDate: string;
  unitTypes: UnitTypeAssumption[];
};

export function getGrossYieldPct(destination: Destination, unitType: UnitTypeAssumption) {
  return ((unitType.annualGrossRent * (destination.occupancyPct / 100)) / unitType.avgPrice) * 100;
}

export type Estimate = {
  avgPrice: number;
  grossYieldPct: number;
  netRentalYieldPct: number;
  cumulativeNetRent: number;
  projectedValue: number;
  capitalAppreciation: number;
  totalGrossReturn: number;
  roiPct: number;
  avgAnnualReturnPct: number;
  rentalYears: number;
  horizonMonths: number;
};

// Verified against the reference scenario (Crimson Bay · 1 Bedroom · 5y):
// 9.5% avg annual return, EGP 6.31M projected value, EGP 783,250 cumulative
// net rent, EGP 1,811,483 capital appreciation, 57.7% ROI, 6.8% gross yield,
// 5.4% net rental yield — every figure below reproduces those exactly.
export function computeEstimate(destination: Destination, unitType: UnitTypeAssumption, years: number): Estimate {
  const horizonMonths = years * 12;
  const rentalMonths = Math.max(0, horizonMonths - destination.rentalStartMonth);
  const rentalYears = rentalMonths / 12;
  const occupancy = destination.occupancyPct / 100;
  const appreciation = destination.appreciationPct / 100;

  const netAnnualRent = unitType.annualGrossRent * occupancy - unitType.annualOpCosts;
  const cumulativeNetRent = Math.max(0, netAnnualRent * rentalYears);
  const projectedValue = unitType.avgPrice * Math.pow(1 + appreciation, years);
  const capitalAppreciation = projectedValue - unitType.avgPrice;
  const totalGrossReturn = cumulativeNetRent + capitalAppreciation;
  const roiPct = (totalGrossReturn / unitType.avgPrice) * 100;
  const avgAnnualReturnPct =
    (Math.pow((unitType.avgPrice + totalGrossReturn) / unitType.avgPrice, 1 / years) - 1) * 100;

  return {
    avgPrice: unitType.avgPrice,
    grossYieldPct: getGrossYieldPct(destination, unitType),
    netRentalYieldPct: rentalYears > 0 ? (cumulativeNetRent / unitType.avgPrice / rentalYears) * 100 : 0,
    cumulativeNetRent,
    projectedValue,
    capitalAppreciation,
    totalGrossReturn,
    roiPct,
    avgAnnualReturnPct,
    rentalYears,
    horizonMonths,
  };
}

export function formatEGP(value: number) {
  return `EGP ${Math.round(value).toLocaleString("en-US")}`;
}

export function formatEGPCompact(value: number, decimals = 2) {
  return `EGP ${(value / 1_000_000).toFixed(decimals)}M`;
}
