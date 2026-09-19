// Imports the starter content (scripts/seed-data/*.ts + the copy in messages/*.json) into
// MongoDB so the CMS opens populated. Doubles as the schema check: every page section
// is validated against the same zod schema the CMS form uses.
//
//   npm run db:seed            refuses if content already exists
//   npm run db:seed -- --force wipes content collections first (never users / sessions / inbox)
import assert from "node:assert/strict";
import { closeDb, db, newId, ready } from "@/server/db";
import type { Localized, ProjectDoc, ProjectUnit } from "@/server/db/types";
import { buildSchema, mapRich, plainToHtml } from "@/lib/cms/fields";
import { getSection } from "@/lib/cms/pages";
import { getProjects } from "./seed-data/projects";
import { getPosts } from "./seed-data/posts";
import { getRoles, getCareersContent } from "./seed-data/careers";
import { getDestinations } from "./seed-data/calculator";
import en from "@/messages/en.json";
import ar from "@/messages/ar.json";

type L = Localized;
const l = (a: string, b: string): L => ({ en: a, ar: b });
const same = (value: string): L => ({ en: value, ar: value });
const day = (value: string) => new Date(`${value} UTC`);
const isoDay = (value: string) => day(value).toISOString().slice(0, 10);
const now = new Date();

await ready; // unique indexes must exist before the first insert
const force = process.argv.includes("--force");
if ((await db.projects.countDocuments()) > 0 && !force) {
  console.error("Content already exists. Re-run with --force to wipe content collections and re-import.");
  process.exit(1);
}
if (force) {
  const content = [db.projects, db.postCategories, db.posts, db.jobs, db.faqs, db.partners, db.unitTypes, db.amenities, db.pageSections, db.homeShowcase] as const;
  for (const collection of content) await collection.deleteMany({});
}

// ─── Lookups ─────────────────────────────────────────────────────────────────

const unitNames: Record<string, L> = {
  studio: l("Studio", "استوديو"),
  oneBed: l("1 Bedroom", "غرفة نوم واحدة"),
  twoBed: l("2 Bedrooms", "غرفتا نوم"),
  villa: l("Villa", "فيلا"),
  apartments: l(en.projects.units.apartments, ar.projects.units.apartments),
  residential: l(en.projects.units.residential, ar.projects.units.residential),
  commercial: l(en.projects.units.commercial, ar.projects.units.commercial),
};
const unitTypeRows = Object.entries(unitNames).map(([key, name], position) => ({ _id: newId(), key, name, position }));
await db.unitTypes.insertMany(unitTypeRows);
const unitTypeId = (key: string) => unitTypeRows.find((row) => row.key === key)!._id;

// the old messages file listed kitchen/mediaRoom twice (kitchen2, mediaRoom2) — deduped here
const featureKeys = Object.keys(en.projects.features).filter((key) => !/\d$/.test(key)) as (keyof typeof en.projects.features)[];
const amenityRows = featureKeys.map((key, position) => ({ _id: newId(), key, label: l(en.projects.features[key], ar.projects.features[key]), position }));
await db.amenities.insertMany(amenityRows);

// ─── Projects ────────────────────────────────────────────────────────────────

const buildStatus = { Planning: "planning", "Under Construction": "under_construction", Completed: "completed" } as const;
const storyImages = [1, 2].map((block) => [1, 2, 3].map((i) => `/pages/projects/detail/story${block}-${i}.png`));
const unitImages = { apartments: "/pages/projects/location/unit-1.jpg", residential: "/pages/projects/location/unit-2.jpg", commercial: "/pages/projects/location/unit-3.png" };

const blankProject = (): Omit<ProjectDoc, "_id" | "slug" | "name" | "location" | "position"> => ({
  status: "draft", buildStatus: "planning", year: null, tagline: null, summary: null, description: null, sector: null, sizeLabel: null,
  locationDescription: null, facilitiesDescription: null, unitsDescription: null, address: null, coverImage: null, heroMedia: null,
  mapImage: null, gallery: [], lat: null, lng: null, storyBlocks: [], places: [], amenityIds: [], units: [], investment: null,
  seo: null, createdAt: now, updatedAt: now,
});
const unit = (key: string, extra: Partial<ProjectUnit> = {}): ProjectUnit => ({
  id: newId(), unitTypeId: unitTypeId(key), image: null, sizeRange: null, avgPrice: null, annualGrossRent: null, annualOpCosts: null, ...extra,
});

// Story, places, units and amenities used to be one global block shared by every project
// page. Each project now embeds its own copy, so they can finally diverge.
const categories = ["transport", "education", "shopping", "food"] as const;
const sharedDetail = (): Pick<ProjectDoc, "storyBlocks" | "places" | "amenityIds" | "units"> => ({
  storyBlocks: (["block1", "block2"] as const).map((key, i) => ({
    heading: l(en.projects.story[key].heading, ar.projects.story[key].heading),
    body: l(`${en.projects.story[key].p1}\n\n${en.projects.story[key].p2}`, `${ar.projects.story[key].p1}\n\n${ar.projects.story[key].p2}`),
    images: storyImages[i],
  })),
  places: categories.flatMap((category) =>
    en.projects.places.categories[category].map((place, i) => ({
      category,
      name: l(place.name, ar.projects.places.categories[category][i].name),
      distanceKm: parseFloat(place.distance),
    })),
  ),
  amenityIds: amenityRows.map((amenity) => amenity._id),
  units: (["apartments", "residential", "commercial"] as const).map((key) => unit(key, { image: unitImages[key] })),
});

const arProjects = getProjects("ar");
const projectDocs: ProjectDoc[] = getProjects("en").map((project, position) => {
  const other = arProjects.find((p) => p.slug === project.slug)!;
  return {
    ...blankProject(),
    ...sharedDetail(),
    _id: newId(),
    slug: project.slug,
    status: "published",
    buildStatus: buildStatus[project.status],
    year: Number(project.year),
    position,
    name: l(project.name, other.name),
    location: l(project.location, other.location),
    summary: l(project.summary, other.summary),
    description: l(project.description, other.description),
    sector: l(project.sector, other.sector),
    sizeLabel: l(project.size, other.size),
    tagline: l(en.projects.heroDescription, ar.projects.heroDescription),
    locationDescription: l(en.projects.locationDescription, ar.projects.locationDescription),
    facilitiesDescription: l(en.projects.facilitiesDescription, ar.projects.facilitiesDescription),
    unitsDescription: l(en.projects.unitsDescription, ar.projects.unitsDescription),
    coverImage: project.image,
    mapImage: "/pages/projects/location/map.png",
  };
});

// The Home showcase had its own hardcoded list of four projects (title + location only).
// They become real — draft — projects so Home can reference them like any other.
const showcaseImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80&auto=format&fit=crop",
];
const slugOf = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const showcaseDocs: ProjectDoc[] = en.home.projectsShowcase.items.map((item, i) => ({
  ...blankProject(),
  _id: newId(),
  slug: slugOf(item.title),
  position: 10 + i,
  name: l(item.title, ar.home.projectsShowcase.items[i].title),
  location: l(item.location, ar.home.projectsShowcase.items[i].location),
  coverImage: showcaseImages[i],
}));

// Calculator "destinations" were a third unrelated project list → real projects with priced
// units. Published, because the calculator only offers published projects; their per-project
// percentages become overrides of the calculator's defaults.
const arDestinations = getDestinations("ar");
const destinationDocs: ProjectDoc[] = getDestinations("en").map((destination, i) => {
  const other = arDestinations.find((d) => d.slug === destination.slug)!;
  return {
    ...blankProject(),
    _id: newId(),
    slug: destination.slug,
    status: "published",
    position: 20 + i,
    name: l(destination.name, other.name),
    location: l(destination.location, other.location),
    coverImage: destination.image,
    units: destination.unitTypes.map((type, j) =>
      unit(type.key, { sizeRange: l(type.sizeRange, other.unitTypes[j].sizeRange), avgPrice: type.avgPrice, annualGrossRent: type.annualGrossRent, annualOpCosts: type.annualOpCosts }),
    ),
    investment: {
      phaseLabel: l(destination.phaseLabel, other.phaseLabel),
      occupancyPct: destination.occupancyPct,
      appreciationPct: destination.appreciationPct,
      deliveryMonth: destination.deliveryMonth,
      rentalStartMonth: destination.rentalStartMonth,
    },
  };
});

await db.projects.insertMany([...projectDocs, ...showcaseDocs, ...destinationDocs]);
await db.homeShowcase.updateOne({ _id: "homeShowcase" }, { $set: { projectIds: showcaseDocs.map((doc) => doc._id) } }, { upsert: true });
// the Calculator page owns which projects it offers
await db.calculator.updateOne({ _id: "calculator" }, { $set: { projectIds: destinationDocs.map((doc) => doc._id) } }, { upsert: true });

// ─── Posts ───────────────────────────────────────────────────────────────────

// News / Events / Blogs start as categories; editors can add more under Shared → Lookups.
const categoryRows = [
  { _id: newId(), key: "news", name: l("News", "الأخبار"), kind: "news" as const, position: 0 },
  { _id: newId(), key: "events", name: l("Events", "الفعاليات"), kind: "event" as const, position: 1 },
  { _id: newId(), key: "blogs", name: l("Blogs", "المدونة"), kind: "article" as const, position: 2 },
];
await db.postCategories.insertMany(categoryRows);
const categoryOf = (key: string) => categoryRows.find((row) => row.key === key)!;
const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const toHtml = (sections: { heading: string; paragraphs: string[] }[]) =>
  sections.map((section) => `<h2>${escape(section.heading)}</h2>${section.paragraphs.map((p) => `<p>${escape(p)}</p>`).join("")}`).join("");

const arPosts = getPosts("ar");
await db.posts.insertMany(
  getPosts("en").map((post) => {
    const other = arPosts.find((p) => p.slug === post.slug)!;
    const category = categoryOf(post.category);
    const publishedAt = day(post.date);
    return {
      _id: newId(),
      slug: post.slug,
      categoryId: category._id,
      status: "published" as const,
      publishedAt,
      title: l(post.title, other.title),
      excerpt: l(post.excerpt, other.excerpt),
      body: l(toHtml(post.sections), toHtml(other.sections)),
      authorLabel: l(post.author, other.author),
      coverImage: post.image,
      gallery: post.gallery,
      // the old data had no event date or venue — placeholders for an editor to correct
      startsAt: category.kind === "event" ? publishedAt : null,
      endsAt: null,
      venue: category.kind === "event" ? l("Margins Developments", "مارجنز ديفلوبمنت") : null,
      registrationUrl: null,
      seo: null,
      createdAt: now,
      updatedAt: now,
    };
  }),
);
await db.mainPost.updateOne({ _id: "mainPost" }, { $set: { postId: null } }, { upsert: true });

// ─── Jobs ────────────────────────────────────────────────────────────────────

const arRoles = getRoles("ar");
await db.jobs.insertMany(
  getRoles("en").map((role) => {
    const other = arRoles.find((r) => r.slug === role.slug)!;
    return {
      _id: newId(),
      slug: role.slug,
      status: "open" as const,
      employmentType: "full_time" as const,
      openings: role.openings,
      postedAt: isoDay(role.date),
      deadline: isoDay(role.deadline),
      salaryMin: null,
      salaryMax: null,
      currency: "EGP",
      title: l(role.title, other.title),
      summary: l(role.summary, other.summary),
      intro: l(role.intro, other.intro),
      location: l(role.location, other.location),
      jobTypeLabel: l(role.jobType, other.jobType),
      experience: l(role.experience, other.experience),
      salaryLabel: l(role.salary, other.salary),
      responsibilities: { en: role.responsibilities, ar: other.responsibilities },
      requirements: { en: role.requirements, ar: other.requirements },
      seo: null,
      createdAt: now,
      updatedAt: now,
    };
  }),
);

// ─── FAQs & partners ─────────────────────────────────────────────────────────

await db.faqs.insertMany(
  en.projects.faq.map((faq, position) => ({
    _id: newId(), position, published: true,
    question: l(faq.question, ar.projects.faq[position].question),
    answer: l(faq.answer, ar.projects.faq[position].answer),
  })),
);

const partnerNames = ["Crimson Bay™", "Loom & Ledger™", "Orbitale Net™", "Meridian Capital™", "Silverline Holdings™", "Northgate Partners™",
  "Aurelia Group™", "Bluepeak Ventures™", "Ironwood Estates™", "Solstice Realty™", "Harborstone™", "Vantage Point Co.™"];
await db.partners.insertMany(partnerNames.map((name, position) => ({ _id: newId(), name: same(name), logo: null, url: null, position })));

// ─── Page sections ───────────────────────────────────────────────────────────

const unsplash = (id: string, w = 1600) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
const emptySeo = { title: same(""), description: same(""), keywords: { en: [], ar: [] }, ogImage: "" };
const keysOf = <T extends object>(value: T) => Object.keys(value) as (keyof T)[];
const careersContent = { en: getCareersContent("en"), ar: getCareersContent("ar") };
const postsHero = unsplash("1486406146926-c627a92ad1ab", 1920);

const sections: Record<string, Record<string, unknown>> = {
  home: {
    hero: { title: l(en.home.title, ar.home.title), subtitle: l(en.home.subtitle, ar.home.subtitle), media: "/pages/home/hero.png" },
    about: {
      text: l(en.home.aboutText, ar.home.aboutText),
      stats: keysOf(en.home.stats).map((key) => ({ value: l(en.home.stats[key].value, ar.home.stats[key].value), label: l(en.home.stats[key].label, ar.home.stats[key].label) })),
    },
    showcase: { eyebrow: l(en.home.projectsShowcase.eyebrow, ar.home.projectsShowcase.eyebrow) },
    approach: {
      heading: l(
        `${en.home.approach.headingLine1}\n<gold>${en.home.approach.headingLine2}</gold>\n${en.home.approach.headingLine3}`,
        `${ar.home.approach.headingLine1}\n<gold>${ar.home.approach.headingLine2}</gold>\n${ar.home.approach.headingLine3}`,
      ),
      description: l(`${en.home.approach.description1}\n\n${en.home.approach.description2}`, `${ar.home.approach.description1}\n\n${ar.home.approach.description2}`),
      items: keysOf(en.home.approach.items).map((key, i) => ({
        title: l(en.home.approach.items[key].title, ar.home.approach.items[key].title),
        description: l(en.home.approach.items[key].description, ar.home.approach.items[key].description),
        image: [unsplash("1600607687939-ce8a6c25118c"), unsplash("1600585154340-be6161a56a0c"), unsplash("1613977257363-707ba9348227")][i] ?? "",
      })),
    },
    feed: {
      heading: l(`${en.home.newsEvents.headingLine1} <gold>${en.home.newsEvents.headingLine2}</gold>`, `${ar.home.newsEvents.headingLine1} <gold>${ar.home.newsEvents.headingLine2}</gold>`),
      description: l(en.home.newsEvents.description, ar.home.newsEvents.description),
      categoryIds: [categoryOf("news")._id, categoryOf("events")._id],
      limit: 8,
    },
    faq: { heading: l(en.projects.faqHeading, ar.projects.faqHeading), description: l(en.projects.faqDescription, ar.projects.faqDescription) },
  },
  about: {
    hero: { title: l(en.about.heroTitle, ar.about.heroTitle), description: l(en.about.heroDescription, ar.about.heroDescription), image: unsplash("1600596542815-ffad4c1539a9", 1920) },
    whoWeAre: { eyebrow: l(en.about.whoWeAre, ar.about.whoWeAre), title: l(en.about.section2Title, ar.about.section2Title), description: l(en.about.section2Description, ar.about.section2Description) },
    stats: {
      items: keysOf(en.about.stats).map((key, i) => ({
        value: l(en.about.stats[key].value, ar.about.stats[key].value),
        label: l(en.about.stats[key].label, ar.about.stats[key].label),
        caption: l(en.about.stats[key].caption, ar.about.stats[key].caption),
        image: [unsplash("1600585154340-be6161a56a0c", 1200), unsplash("1600607687939-ce8a6c25118c", 1200), unsplash("1613977257363-707ba9348227", 1200)][i] ?? "",
      })),
    },
    statement: { title: l(en.about.section3Title, ar.about.section3Title), description: l(en.about.section3Description, ar.about.section3Description) },
    chairman: {
      eyebrow: l(en.about.chairman.eyebrow, ar.about.chairman.eyebrow),
      title: l(en.about.chairman.title, ar.about.chairman.title),
      message: l(en.about.chairman.description, ar.about.chairman.description),
      people: en.about.chairman.people.map((person, i) => ({
        name: l(person.name, ar.about.chairman.people[i].name),
        credential: l(person.credential, ar.about.chairman.people[i].credential),
        image: [unsplash("1560250097-0b93528c311a", 800), unsplash("1500648767791-00dcc994a43e", 800)][i] ?? "",
      })),
    },
  },
  projects: {
    hero: {
      title: l(en.projects.heroTitle, ar.projects.heroTitle),
      description: l(en.projects.heroDescription, ar.projects.heroDescription),
      images: [...[1, 2, 3, 4, 5].map((i) => `/pages/projects/hero/left-${i}.png`), ...[1, 2, 3].map((i) => `/pages/projects/hero/right-${i}.png`)],
    },
  },
  media: { hero: { title: l(en.posts.heroTitle, ar.posts.heroTitle), description: l(en.posts.heroDescription, ar.posts.heroDescription), image: postsHero } },
  careers: {
    hero: { title: l(en.careers.heroTitle, ar.careers.heroTitle), description: l(en.careers.heroDescription, ar.careers.heroDescription), image: unsplash("1521737604893-d14cc237f11d", 1920) },
    discover: {
      // the page rendered heroTitle twice; the discover heading is now its own field
      title: l(en.careers.heroTitle, ar.careers.heroTitle),
      description: l(en.careers.discoverDescription, ar.careers.discoverDescription),
      images: ["1522071820081-009f0129c71c", "1524758631624-e2822e304c36", "1600880292203-757bb62b4baf", "1543269865-cbf427effbad"].map((id) => unsplash(id, 900)),
    },
    hiring: { heading: l(en.careers.hiringHeading, ar.careers.hiringHeading) },
    values: {
      title: l(en.careers.valuesTitle, ar.careers.valuesTitle),
      description: l(en.careers.valuesDescription, ar.careers.valuesDescription),
      items: keysOf(en.careers.values).map((key) => ({ title: l(en.careers.values[key].title, ar.careers.values[key].title), description: l(en.careers.values[key].description, ar.careers.values[key].description) })),
    },
    jobInfo: {
      perks: { en: careersContent.en.perks, ar: careersContent.ar.perks },
      workingHours: l(careersContent.en.workingHours, careersContent.ar.workingHours),
      workingDays: l(careersContent.en.workingDays, careersContent.ar.workingDays),
      educationNote: l(careersContent.en.educationNote, careersContent.ar.educationNote),
      closing: l(careersContent.en.closing, careersContent.ar.closing),
    },
  },
  contact: {
    hero: { title: l(en.contact.heroTitle, ar.contact.heroTitle), description: l(en.contact.heroDescription, ar.contact.heroDescription), image: "/pages/contact/hero.jpg" },
    form: { title: l(en.contact.formTitle, ar.contact.formTitle), cardTitle: l(en.contact.formCardTitle, ar.contact.formCardTitle), backgroundImage: "/pages/contact/contact-form-bg.jpg" },
  },
  calculator: {
    setup: {
      horizons: [3, 5, 7, 10].map((years) => ({ years })),
      defaultHorizon: 5,
      occupancyPct: 80,
      appreciationPct: 6,
      deliveryMonth: 18,
      rentalStartMonth: 21,
      assumptionCode: "MRG-2026-Q3",
      effectiveDate: "2026-07-01",
    },
    intro: {
      eyebrow: l(en.calculator.eyebrow, ar.calculator.eyebrow),
      heading: l(`${en.calculator.headingLine1} <gold>${en.calculator.headingLine2}</gold>`, `${ar.calculator.headingLine1} <gold>${ar.calculator.headingLine2}</gold>`),
      subtitle: l(en.calculator.subtitle, ar.calculator.subtitle),
    },
    disclaimer: { text: l(en.calculator.potentialStep.disclaimer, ar.calculator.potentialStep.disclaimer) },
  },
  privacy: { content: { title: l("Privacy Policy", "سياسة الخصوصية"), body: same("") } },
  company: {
    vision: { title: l(en.projects.vision.title, ar.projects.vision.title), description: l(en.projects.vision.description, ar.projects.vision.description), image: "/pages/projects/explore/floorplan-1.png" },
    mission: { title: l(en.projects.mission.title, ar.projects.mission.title), description: l(en.projects.mission.description, ar.projects.mission.description), image: "/pages/projects/explore/floorplan-2.png" },
    banner: { eyebrow: l(en.projects.bannerEyebrow, ar.projects.bannerEyebrow), title: l(en.projects.bannerTitle, ar.projects.bannerTitle), image: "/pages/projects/explore/banner.png" },
    values: {
      heading: l(`${en.projects.exploreLine1}\n<gold>${en.projects.valuesLine2}</gold>`, `${ar.projects.exploreLine1}\n<gold>${ar.projects.valuesLine2}</gold>`),
      items: keysOf(en.projects.values).map((key) => ({ title: l(en.projects.values[key].title, ar.projects.values[key].title), description: l(en.projects.values[key].description, ar.projects.values[key].description) })),
    },
  },
  settings: {
    contact: {
      phone: en.contact.methods.phone.value,
      whatsapp: en.contact.methods.whatsapp.value,
      email: en.contact.methods.email.value,
      address: l(en.contact.methods.location.value, ar.contact.methods.location.value),
      mapUrl: "",
    },
    // footer had 3 links, contact page had 6 different ones → one merged list
    socials: {
      items: [
        ["facebook", "https://facebook.com/marginsdevelopment"], ["instagram", "https://instagram.com/marginsdevelopment"],
        ["linkedin", "https://linkedin.com/company/marginsdevelopment"], ["x", "https://x.com/marginsdevelopment"],
        ["tiktok", "https://tiktok.com/@marginsdevelopment"], ["youtube", "https://youtube.com/@marginsdevelopment"],
        ["whatsapp", "https://wa.me/201012877474"],
      ].map(([platform, url]) => ({ platform, url })),
    },
    footer: {
      ctaHeading: l(en.footer.cta, ar.footer.cta),
      ctaMedia: "https://customer-v992ht8wqeglys2p.cloudflarestream.com/59601d5cd4816162ef786255ed977700/downloads/default.mp4",
      newsletterDisclaimer: l(en.footer.disclaimer, ar.footer.disclaimer),
      copyright: l(en.footer.copyright, ar.footer.copyright),
    },
    organization: { legalName: l("Margins Developments", "مارجنز للتطوير العقاري"), logo: "/brand/logo.png", defaultDescription: l(en.home.subtitle, ar.home.subtitle) },
  },
};

let sectionCount = 0;
for (const [page, pageSections] of Object.entries(sections)) {
  for (const [section, data] of Object.entries(pageSections)) {
    const def = getSection(page, section);
    assert.ok(def, `unknown section ${page}.${section}`);
    // descriptions are rich text now; the old copy was plain
    const parsed = buildSchema(def.fields).safeParse(mapRich(def.fields, data as Record<string, unknown>, plainToHtml));
    assert.ok(parsed.success, `${page}.${section} failed validation: ${!parsed.success && JSON.stringify(parsed.error.issues[0])}`);
    assert.deepEqual(def.check?.(parsed.data as Record<string, unknown>) ?? {}, {}, `${page}.${section} failed its cross-field check`);
    await db.pageSections.insertOne({ _id: `${page}.${section}`, page, section, data: parsed.data as Record<string, unknown>, updatedAt: now });
    sectionCount++;
  }
  if (getSection(page, "seo")) await db.pageSections.insertOne({ _id: `${page}.seo`, page, section: "seo", data: emptySeo, updatedAt: now });
}

console.log(`✓ seeded ${projectDocs.length + showcaseDocs.length + destinationDocs.length} projects, posts, jobs, faqs, partners, lookups and ${sectionCount} page sections`);
await closeDb();
