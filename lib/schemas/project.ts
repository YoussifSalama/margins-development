import { z } from "zod";
import { emptyLocalized, emptySeo, id, localized, localizedOptional, mediaUrl, seo, slug } from "./common";
import { PUBLISH_STATUSES } from "./post";

export const BUILD_STATUSES = ["planning", "under_construction", "completed"] as const;
export const PLACE_CATEGORIES = ["transport", "education", "shopping", "food"] as const;

const coordinate = (limit: number) => z.number().min(-limit).max(limit).nullable();

export const storyBlockInput = z.object({
  heading: localized(200),
  body: localized(5000),
  images: z.array(mediaUrl),
});

export const placeInput = z.object({
  category: z.enum(PLACE_CATEGORIES),
  name: localized(120),
  distanceKm: z.number().nonnegative(),
});

const money = z.number().int().nonnegative().nullable();

// Everything about a unit in one place — what the project page shows and what the calculator needs.
export const unitInput = z.object({
  unitTypeId: id,
  image: mediaUrl,
  sizeRange: localizedOptional(80),
  avgPrice: money,
  annualGrossRent: money,
  annualOpCosts: money,
});

// null = "use the default from Pages → Calculator → Setup"
const pct = (min: number, max: number) => z.number().min(min).max(max).nullable();
const months = z.number().int().min(0).max(240).nullable();
export const investmentOverrides = z.object({
  phaseLabel: localizedOptional(120),
  occupancyPct: pct(0, 100),
  appreciationPct: pct(-50, 100),
  deliveryMonth: months,
  rentalStartMonth: months,
});
export const emptyOverrides = { phaseLabel: emptyLocalized, occupancyPct: null, appreciationPct: null, deliveryMonth: null, rentalStartMonth: null };

export const projectInput = z
  .object({
    slug,
    status: z.enum(PUBLISH_STATUSES),
    buildStatus: z.enum(BUILD_STATUSES),
    year: z.number().int().min(1900).max(2200).nullable(),
    name: localized(160),
    location: localized(160),
    tagline: localizedOptional(300),
    summary: localizedOptional(600),
    description: localizedOptional(3000),
    sector: localizedOptional(120),
    sizeLabel: localizedOptional(120),
    locationDescription: localizedOptional(1000),
    facilitiesDescription: localizedOptional(1000),
    unitsDescription: localizedOptional(2000),
    address: localizedOptional(300),
    coverImage: mediaUrl,
    heroMedia: mediaUrl,
    mapImage: mediaUrl,
    gallery: z.array(mediaUrl),
    lat: coordinate(90),
    lng: coordinate(180),
    storyBlocks: z.array(storyBlockInput),
    places: z.array(placeInput),
    amenityIds: z.array(id),
    units: z.array(unitInput),
    investment: investmentOverrides,
    seo,
  })
  .superRefine((project, ctx) => {
    const seen = new Set<string>();
    project.units.forEach((unit, index) => {
      if (seen.has(unit.unitTypeId)) ctx.addIssue({ code: "custom", path: ["units", index, "unitTypeId"], message: "Each unit type can appear once per project" });
      seen.add(unit.unitTypeId);
    });
    const { deliveryMonth, rentalStartMonth } = project.investment;
    if (deliveryMonth !== null && rentalStartMonth !== null && rentalStartMonth < deliveryMonth) {
      ctx.addIssue({ code: "custom", path: ["investment", "rentalStartMonth"], message: "Rent can't start before delivery" });
    }
    if (project.status !== "published") return;
    for (const key of ["summary", "description"] as const) {
      if (!project[key].en || !project[key].ar) {
        ctx.addIssue({ code: "custom", path: [key, project[key].en ? "ar" : "en"], message: "Required in both languages to publish" });
      }
    }
    if (!project.coverImage) ctx.addIssue({ code: "custom", path: ["coverImage"], message: "A cover image is required to publish" });
  });

export type ProjectInput = z.infer<typeof projectInput>;

export const emptyProject: ProjectInput = {
  slug: "",
  status: "draft",
  buildStatus: "planning",
  year: null,
  name: emptyLocalized,
  location: emptyLocalized,
  tagline: emptyLocalized,
  summary: emptyLocalized,
  description: emptyLocalized,
  sector: emptyLocalized,
  sizeLabel: emptyLocalized,
  locationDescription: emptyLocalized,
  facilitiesDescription: emptyLocalized,
  unitsDescription: emptyLocalized,
  address: emptyLocalized,
  coverImage: "",
  heroMedia: "",
  mapImage: "",
  gallery: [],
  lat: null,
  lng: null,
  storyBlocks: [],
  places: [],
  amenityIds: [],
  units: [],
  investment: emptyOverrides,
  seo: emptySeo,
};
