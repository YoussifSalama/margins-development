// SEED DATA ONLY — imported into the CMS by scripts/seed.mts on a fresh database.
// The website calculator reads the CMS (server/public/pages.ts → getCalculatorPage).
import type { Destination } from "@/lib/calculator";

type Locale = "en" | "ar";

// Seed data only (scripts/seed.mts imports it into the CMS on a fresh database). The website
// no longer reads this — it reads the CMS. Numbers are internally consistent placeholders.
const destinationsByLocale: Record<Locale, Omit<Destination, "id">[]> = {
  en: [
    {
      slug: "crimson-bay",
      name: "Crimson Bay",
      location: "North Coast, Egypt",
      phaseLabel: "Off-Plan · Phase 1",
      image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1200&q=80&auto=format&fit=crop",
      occupancyPct: 85,
      appreciationPct: 7,
      deliveryMonth: 18,
      rentalStartMonth: 21,
      assumptionCode: "CB-2026-Q3",
      effectiveDate: "2026-07-01",
      unitTypes: [
        { key: "studio", name: "Studio", sizeRange: "45 – 60 m²", avgPrice: 2_800_000, annualGrossRent: 224_000, annualOpCosts: 35_000 },
        { key: "oneBed", name: "1 Bedroom", sizeRange: "75 – 100 m²", avgPrice: 4_500_000, annualGrossRent: 360_000, annualOpCosts: 65_000 },
        { key: "twoBed", name: "2 Bedrooms", sizeRange: "120 – 155 m²", avgPrice: 7_200_000, annualGrossRent: 576_000, annualOpCosts: 95_000 },
        { key: "villa", name: "Villa", sizeRange: "300 – 450 m²", avgPrice: 18_000_000, annualGrossRent: 1_350_000, annualOpCosts: 180_000 },
      ],
    },
    {
      slug: "leon-ledger",
      name: "Leon & Ledger",
      location: "New Cairo, Egypt",
      phaseLabel: "Off-Plan · Phase 2",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80&auto=format&fit=crop",
      occupancyPct: 82,
      appreciationPct: 6.5,
      deliveryMonth: 15,
      rentalStartMonth: 18,
      assumptionCode: "LL-2026-Q3",
      effectiveDate: "2026-07-01",
      unitTypes: [
        { key: "studio", name: "Studio", sizeRange: "40 – 55 m²", avgPrice: 2_200_000, annualGrossRent: 176_000, annualOpCosts: 28_000 },
        { key: "oneBed", name: "1 Bedroom", sizeRange: "70 – 95 m²", avgPrice: 3_600_000, annualGrossRent: 260_000, annualOpCosts: 50_000 },
        { key: "twoBed", name: "2 Bedrooms", sizeRange: "110 – 145 m²", avgPrice: 5_800_000, annualGrossRent: 420_000, annualOpCosts: 78_000 },
        { key: "villa", name: "Villa", sizeRange: "280 – 400 m²", avgPrice: 14_500_000, annualGrossRent: 950_000, annualOpCosts: 140_000 },
      ],
    },
    {
      slug: "cristale-hart",
      name: "Cristale Hart",
      location: "El Gouna, Red Sea",
      phaseLabel: "Off-Plan · Phase 1",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80&auto=format&fit=crop",
      occupancyPct: 78,
      appreciationPct: 8,
      deliveryMonth: 20,
      rentalStartMonth: 24,
      assumptionCode: "CH-2026-Q3",
      effectiveDate: "2026-07-01",
      unitTypes: [
        { key: "studio", name: "Studio", sizeRange: "42 – 58 m²", avgPrice: 3_400_000, annualGrossRent: 235_000, annualOpCosts: 42_000 },
        { key: "oneBed", name: "1 Bedroom", sizeRange: "78 – 105 m²", avgPrice: 5_200_000, annualGrossRent: 340_000, annualOpCosts: 72_000 },
        { key: "twoBed", name: "2 Bedrooms", sizeRange: "125 – 160 m²", avgPrice: 8_500_000, annualGrossRent: 550_000, annualOpCosts: 110_000 },
        { key: "villa", name: "Villa", sizeRange: "320 – 480 m²", avgPrice: 21_000_000, annualGrossRent: 1_250_000, annualOpCosts: 210_000 },
      ],
    },
  ],
  ar: [
    {
      slug: "crimson-bay",
      name: "كريمسون باي",
      location: "الساحل الشمالي، مصر",
      phaseLabel: "على المخطط · المرحلة 1",
      image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1200&q=80&auto=format&fit=crop",
      occupancyPct: 85,
      appreciationPct: 7,
      deliveryMonth: 18,
      rentalStartMonth: 21,
      assumptionCode: "CB-2026-Q3",
      effectiveDate: "2026-07-01",
      unitTypes: [
        { key: "studio", name: "استوديو", sizeRange: "45 – 60 م²", avgPrice: 2_800_000, annualGrossRent: 224_000, annualOpCosts: 35_000 },
        { key: "oneBed", name: "غرفة نوم واحدة", sizeRange: "75 – 100 م²", avgPrice: 4_500_000, annualGrossRent: 360_000, annualOpCosts: 65_000 },
        { key: "twoBed", name: "غرفتا نوم", sizeRange: "120 – 155 م²", avgPrice: 7_200_000, annualGrossRent: 576_000, annualOpCosts: 95_000 },
        { key: "villa", name: "فيلا", sizeRange: "300 – 450 م²", avgPrice: 18_000_000, annualGrossRent: 1_350_000, annualOpCosts: 180_000 },
      ],
    },
    {
      slug: "leon-ledger",
      name: "ليون آند ليدجر",
      location: "القاهرة الجديدة، مصر",
      phaseLabel: "على المخطط · المرحلة 2",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80&auto=format&fit=crop",
      occupancyPct: 82,
      appreciationPct: 6.5,
      deliveryMonth: 15,
      rentalStartMonth: 18,
      assumptionCode: "LL-2026-Q3",
      effectiveDate: "2026-07-01",
      unitTypes: [
        { key: "studio", name: "استوديو", sizeRange: "40 – 55 م²", avgPrice: 2_200_000, annualGrossRent: 176_000, annualOpCosts: 28_000 },
        { key: "oneBed", name: "غرفة نوم واحدة", sizeRange: "70 – 95 م²", avgPrice: 3_600_000, annualGrossRent: 260_000, annualOpCosts: 50_000 },
        { key: "twoBed", name: "غرفتا نوم", sizeRange: "110 – 145 م²", avgPrice: 5_800_000, annualGrossRent: 420_000, annualOpCosts: 78_000 },
        { key: "villa", name: "فيلا", sizeRange: "280 – 400 م²", avgPrice: 14_500_000, annualGrossRent: 950_000, annualOpCosts: 140_000 },
      ],
    },
    {
      slug: "cristale-hart",
      name: "كريستال هارت",
      location: "الجونة، البحر الأحمر",
      phaseLabel: "على المخطط · المرحلة 1",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80&auto=format&fit=crop",
      occupancyPct: 78,
      appreciationPct: 8,
      deliveryMonth: 20,
      rentalStartMonth: 24,
      assumptionCode: "CH-2026-Q3",
      effectiveDate: "2026-07-01",
      unitTypes: [
        { key: "studio", name: "استوديو", sizeRange: "42 – 58 م²", avgPrice: 3_400_000, annualGrossRent: 235_000, annualOpCosts: 42_000 },
        { key: "oneBed", name: "غرفة نوم واحدة", sizeRange: "78 – 105 م²", avgPrice: 5_200_000, annualGrossRent: 340_000, annualOpCosts: 72_000 },
        { key: "twoBed", name: "غرفتا نوم", sizeRange: "125 – 160 م²", avgPrice: 8_500_000, annualGrossRent: 550_000, annualOpCosts: 110_000 },
        { key: "villa", name: "فيلا", sizeRange: "320 – 480 م²", avgPrice: 21_000_000, annualGrossRent: 1_250_000, annualOpCosts: 210_000 },
      ],
    },
  ],
};

export function getDestinations(locale: string) {
  return destinationsByLocale[locale as Locale] ?? destinationsByLocale.en;
}

