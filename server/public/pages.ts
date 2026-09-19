import "server-only";
import { db } from "@/server/db";
import type { JobDoc, PostCategoryDoc, PostDoc, ProjectDoc } from "@/server/db/types";
import { buildDestinations, getCalculatorSetup } from "@/server/calculator/data";
import type {
  AboutPage, CalculatorPage, CareersPage, Company, ContactPage, FaqItem, HomePage, JobCard, JobPage, Locale, MediaPage,
  PagePayload, Partner, Post, PostCard, PostPage, PrivacyPage, ProjectCard, ProjectDetail, ProjectPage, ProjectsPage,
} from "@/lib/content";
import { asLocale, cachedLoader, formatDate, loadSections, loadSite, pick } from "./core";
import { buildSeo, schema } from "./seo";

// ONE loader per page. Each returns everything that page renders — SEO (tags + structured
// data), site-wide data (contact, socials, footer) and every section — in one language.
// GET /api/pages/<page> serves exactly these payloads; the server components call the same
// functions directly instead of going over HTTP to themselves.

const as = <T>(value: unknown) => value as T;
const stripGold = (value: string) => value.replace(/<\/?gold>/g, "").replace(/\s*\n\s*/g, " ").trim();

// ─── entity → DTO ────────────────────────────────────────────────────────────

const livePosts = () => ({ status: "published" as const, publishedAt: { $lte: new Date() } });

const projectCard = (p: ProjectDoc, locale: Locale): ProjectCard => ({ slug: p.slug, name: pick(p.name, locale), location: pick(p.location, locale), image: p.coverImage ?? "" });

function postCard(p: PostDoc, categories: PostCategoryDoc[], locale: Locale): PostCard {
  const category = categories.find((c) => c._id === p.categoryId);
  return {
    slug: p.slug,
    category: category?.key ?? "news",
    categoryName: pick(category?.name, locale),
    title: pick(p.title, locale),
    excerpt: pick(p.excerpt, locale),
    date: formatDate(p.publishedAt, locale),
    image: p.coverImage ?? "",
  };
}

const jobCard = (j: JobDoc, locale: Locale): JobCard => ({
  slug: j.slug,
  title: pick(j.title, locale),
  openings: j.openings,
  summary: pick(j.summary, locale),
  location: pick(j.location, locale),
  date: formatDate(j.postedAt, locale),
  jobType: pick(j.jobTypeLabel, locale),
});

const loadFaqs = async (locale: Locale): Promise<FaqItem[]> =>
  (await db.faqs.find({ published: true }).sort({ position: 1 }).toArray()).map((f) => ({ question: pick(f.question, locale), answer: pick(f.answer, locale) }));

const loadPartners = async (locale: Locale): Promise<Partner[]> =>
  (await db.partners.find().sort({ position: 1 }).toArray()).map((p) => ({ name: pick(p.name, locale), logo: p.logo, url: p.url }));

/** ids → published projects, in the given order; ids that no longer resolve are skipped */
async function projectsByIds(ids: string[], locale: Locale) {
  if (ids.length === 0) return [];
  const docs = await db.projects.find({ _id: { $in: ids }, status: "published" }).toArray();
  return ids.flatMap((id) => docs.filter((p) => p._id === id).map((p) => projectCard(p, locale)));
}

// ─── Home ────────────────────────────────────────────────────────────────────

export const getHomePage = cachedLoader(
  "page:home",
  ["page:home", "page:settings", "projects", "posts", "faqs", "partners"],
  async (localeArg: string): Promise<PagePayload<HomePage>> => {
    const locale = asLocale(localeArg);
    const [site, s, showcase, categories, faqs, partners] = await Promise.all([
      loadSite(locale), loadSections("home", locale), db.homeShowcase.findOne({ _id: "homeShowcase" }),
      db.postCategories.find().toArray(), loadFaqs(locale), loadPartners(locale),
    ]);
    const feed = as<{ heading: string; description: string; categoryIds: string[]; limit: number }>(s.feed);
    const [projects, posts] = await Promise.all([
      projectsByIds(showcase?.projectIds ?? [], locale),
      // a rule, not a pick list: newest published posts of the chosen categories
      db.posts.find({ ...livePosts(), ...(feed.categoryIds.length ? { categoryId: { $in: feed.categoryIds } } : {}) }).sort({ publishedAt: -1 }).limit(feed.limit || 8).toArray(),
    ]);

    const page: HomePage = {
      hero: as(s.hero),
      partners,
      about: as(s.about),
      showcase: { eyebrow: as<{ eyebrow: string }>(s.showcase).eyebrow, projects },
      approach: as(s.approach),
      feed: { heading: feed.heading, description: feed.description, posts: posts.map((p) => postCard(p, categories, locale)) },
      faq: { ...as<{ heading: string; description: string }>(s.faq), items: faqs },
    };
    return {
      site,
      page,
      seo: buildSeo({
        locale, site, path: "/", stored: s.seo,
        fallback: { title: page.hero.title, description: page.hero.subtitle, image: page.hero.media },
        jsonLd: [schema.itemList(locale, projects.map((p) => ({ name: p.name, path: `/projects/${p.slug}` }))), schema.faq(faqs)],
      }),
    };
  },
);

// ─── About ───────────────────────────────────────────────────────────────────

export const getAboutPage = cachedLoader("page:about", ["page:about", "page:settings", "partners"], async (localeArg: string): Promise<PagePayload<AboutPage>> => {
  const locale = asLocale(localeArg);
  const [site, s, partners] = await Promise.all([loadSite(locale), loadSections("about", locale), loadPartners(locale)]);
  const page: AboutPage = {
    hero: as(s.hero), partners, whoWeAre: as(s.whoWeAre), stats: as<{ items: AboutPage["stats"] }>(s.stats).items,
    statement: as(s.statement), chairman: as(s.chairman),
  };
  return {
    site, page,
    seo: buildSeo({
      locale, site, path: "/about", stored: s.seo,
      fallback: { title: stripGold(page.hero.title), description: page.hero.description, image: page.hero.image },
      breadcrumb: [{ name: stripGold(page.hero.title), path: "/about" }],
      jsonLd: [schema.pageType("AboutPage", locale, "/about")],
    }),
  };
});

// ─── Projects ────────────────────────────────────────────────────────────────

async function loadCompany(locale: Locale): Promise<Company> {
  const s = await loadSections("company", locale);
  return { vision: as(s.vision), mission: as(s.mission), banner: as(s.banner), values: as(s.values) };
}

export const getProjectsPage = cachedLoader(
  "page:projects",
  ["page:projects", "page:company", "page:settings", "projects"],
  async (localeArg: string, pageArg?: number, limitArg?: number): Promise<PagePayload<ProjectsPage>> => {
    const locale = asLocale(localeArg);
    const limit = Math.min(Math.max(limitArg || 4, 1), 48);
    const [site, s, company, total] = await Promise.all([
      loadSite(locale), loadSections("projects", locale), loadCompany(locale), db.projects.countDocuments({ status: "published" }),
    ]);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const current = Math.min(Math.max(pageArg || 1, 1), totalPages);
    const docs = await db.projects.find({ status: "published" }).sort({ position: 1, createdAt: -1 }).skip((current - 1) * limit).limit(limit).toArray();
    const hero = as<ProjectsPage["hero"]>(s.hero);
    const projects = docs.map((p) => projectCard(p, locale));
    return {
      site,
      page: { hero, projects, pagination: { page: current, totalPages, limit }, company },
      seo: buildSeo({
        locale, site, path: "/projects", query: current > 1 ? `?page=${current}` : "", stored: s.seo,
        fallback: { title: stripGold(hero.title), description: hero.description, image: hero.images[0] },
        breadcrumb: [{ name: stripGold(hero.title), path: "/projects" }],
        jsonLd: [schema.pageType("CollectionPage", locale, "/projects"), schema.itemList(locale, projects.map((p) => ({ name: p.name, path: `/projects/${p.slug}` })))],
      }),
    };
  },
);

const distance = (km: number, locale: Locale) => `${km} ${locale === "ar" ? "كم" : "KM"}`;

/** null when the slug doesn't exist or the project isn't published */
export const getProjectPage = cachedLoader(
  "page:project",
  ["projects", "faqs", "page:home", "page:projects", "page:settings"],
  async (localeArg: string, slug?: string): Promise<PagePayload<ProjectPage> | null> => {
    const locale = asLocale(localeArg);
    const p = await db.projects.findOne({ slug, status: "published" });
    if (!p) return null;
    const [site, home, listing, faqs, unitTypes, amenities, others] = await Promise.all([
      loadSite(locale), loadSections("home", locale), loadSections("projects", locale), loadFaqs(locale),
      db.unitTypes.find().toArray(), db.amenities.find().sort({ position: 1 }).toArray(),
      db.projects.find({ status: "published", _id: { $ne: p._id } }).sort({ position: 1 }).limit(12).toArray(),
    ]);

    const address = pick(p.address, locale);
    const mapQuery = p.lat !== null && p.lng !== null ? `${p.lat},${p.lng}` : address || pick(p.location, locale);
    const projectAmenities = amenities.filter((a) => p.amenityIds.includes(a._id));
    const categories = ["transport", "education", "shopping", "food"] as const;

    const project: ProjectDetail = {
      ...projectCard(p, locale),
      tagline: pick(p.tagline, locale),
      summary: pick(p.summary, locale),
      description: pick(p.description, locale),
      heroMedia: p.heroMedia || p.coverImage || "",
      gallery: p.gallery,
      facts: { year: p.year ? String(p.year) : "", location: pick(p.location, locale), sector: pick(p.sector, locale), size: pick(p.sizeLabel, locale), status: p.buildStatus },
      storyBlocks: p.storyBlocks.map((b) => ({ heading: pick(b.heading, locale), paragraphs: pick(b.body, locale).split(/\n{2,}/).filter(Boolean), images: b.images })),
      locationDescription: pick(p.locationDescription, locale),
      mapImage: p.mapImage ?? "",
      mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`,
      placeCategories: categories.map((key) => ({ key, places: p.places.filter((place) => place.category === key).map((place) => ({ name: pick(place.name, locale), distance: distance(place.distanceKm, locale) })) })),
      facilitiesDescription: pick(p.facilitiesDescription, locale),
      amenities: projectAmenities.map((a) => ({ key: a.key, label: pick(a.label, locale) })),
      unitsDescription: pick(p.unitsDescription, locale),
      units: p.units.map((u) => {
        const type = unitTypes.find((t) => t._id === u.unitTypeId);
        return { key: type?.key ?? u.id, title: pick(type?.name, locale), image: u.image ?? "", sizeRange: pick(u.sizeRange, locale) };
      }),
    };

    const listingTitle = stripGold(as<{ title: string }>(listing.hero).title);
    return {
      site,
      page: { project, more: others.map((o) => projectCard(o, locale)), faq: { ...as<{ heading: string; description: string }>(home.faq), items: faqs } },
      seo: buildSeo({
        locale, site, path: `/projects/${p.slug}`,
        stored: p.seo && { title: pick(p.seo.title, locale), description: pick(p.seo.description, locale), keywords: p.seo.keywords[locale], ogImage: p.seo.ogImage },
        fallback: { title: project.name, description: project.summary || project.description, image: p.coverImage },
        breadcrumb: [{ name: listingTitle, path: "/projects" }, { name: project.name, path: `/projects/${p.slug}` }],
        jsonLd: [
          schema.project(locale, { name: project.name, slug: p.slug, description: project.description || project.summary, image: p.coverImage ?? "", address, lat: p.lat, lng: p.lng, amenities: project.amenities.map((a) => a.label) }),
          schema.faq(faqs),
        ],
      }),
    };
  },
);

// ─── Media Center ────────────────────────────────────────────────────────────

/** null when `categoryKey` is given but isn't a category */
export const getMediaPage = cachedLoader(
  "page:media",
  ["page:media", "page:settings", "posts"],
  async (localeArg: string, categoryKey?: string, pageArg?: number, limitArg?: number): Promise<PagePayload<MediaPage> | null> => {
    const locale = asLocale(localeArg);
    const limit = Math.min(Math.max(limitArg || 5, 1), 48);
    const categoryDocs = await db.postCategories.find().sort({ position: 1 }).toArray();
    const categoryDoc = categoryKey ? categoryDocs.find((c) => c.key === categoryKey) : undefined;
    if (categoryKey && !categoryDoc) return null;

    const filter = { ...livePosts(), ...(categoryDoc ? { categoryId: categoryDoc._id } : {}) };
    const [site, s, pin, docs] = await Promise.all([
      loadSite(locale), loadSections("media", locale), db.mainPost.findOne({ _id: "mainPost" }),
      // ponytail: whole listing in memory so the pinned item can lead; switch to skip/limit + a separate pin query past ~1k posts
      db.posts.find(filter).sort({ publishedAt: -1 }).limit(1000).toArray(),
    ]);
    // the pinned main item leads — on a category tab only if it belongs to that category
    const pinned = docs.find((d) => d._id === pin?.postId);
    const ordered = pinned ? [pinned, ...docs.filter((d) => d !== pinned)] : docs;

    const totalPages = Math.max(1, Math.ceil(ordered.length / limit));
    const current = Math.min(Math.max(pageArg || 1, 1), totalPages);
    const slice = ordered.slice((current - 1) * limit, current * limit).map((d) => postCard(d, categoryDocs, locale));
    const hero = as<MediaPage["hero"]>(s.hero);
    const category = categoryDoc ? { key: categoryDoc.key, name: pick(categoryDoc.name, locale) } : null;
    const path = category ? `/media/${category.key}` : "/media";
    const heroTitle = stripGold(hero.title);

    return {
      site,
      page: {
        hero,
        categories: categoryDocs.map((c) => ({ key: c.key, name: pick(c.name, locale) })),
        category,
        featured: current === 1 ? (slice[0] ?? null) : null,
        posts: current === 1 ? slice.slice(1) : slice,
        pagination: { page: current, totalPages, limit },
      },
      seo: buildSeo({
        locale, site, path, query: current > 1 ? `?page=${current}` : "", stored: category ? null : s.seo,
        fallback: { title: category ? `${category.name} — ${heroTitle}` : heroTitle, description: hero.description, image: hero.image },
        breadcrumb: [{ name: heroTitle, path: "/media" }, ...(category ? [{ name: category.name, path }] : [])],
        jsonLd: [schema.pageType("CollectionPage", locale, path), schema.itemList(locale, slice.map((c) => ({ name: c.title, path: `/media/${c.category}/${c.slug}` })))],
      }),
    };
  },
);

const slugId = (value: string, index: number) => `${value.toLowerCase().replace(/<[^>]+>/g, "").replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "section"}-${index + 1}`;

/** Gives every <h2> an id and returns the table of contents. */
function withHeadingIds(html: string) {
  const headings: Post["headings"] = [];
  const bodyHtml = html.replace(/<h2>(.*?)<\/h2>/g, (_match, inner: string) => {
    const id = slugId(inner, headings.length);
    headings.push({ id, text: inner.replace(/<[^>]+>/g, "") });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { bodyHtml, headings };
}

/** null when the post doesn't exist or isn't live yet */
export const getPostPage = cachedLoader("page:post", ["posts", "page:media", "page:settings"], async (localeArg: string, slug?: string): Promise<PagePayload<PostPage> | null> => {
  const locale = asLocale(localeArg);
  const p = await db.posts.findOne({ slug, ...livePosts() });
  if (!p) return null;
  const [site, media, categories, relatedDocs] = await Promise.all([
    loadSite(locale), loadSections("media", locale), db.postCategories.find().toArray(),
    db.posts.find({ ...livePosts(), _id: { $ne: p._id } }).sort({ publishedAt: -1 }).limit(40).toArray(),
  ]);
  const category = categories.find((c) => c._id === p.categoryId);
  const card = postCard(p, categories, locale);
  const body = pick(p.body, locale);
  const minutes = Math.max(1, Math.round(body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 200));
  // same category first, so "related" is actually related
  const related = [...relatedDocs.filter((d) => d.categoryId === p.categoryId), ...relatedDocs.filter((d) => d.categoryId !== p.categoryId)].slice(0, 2);
  const isEvent = category?.kind === "event" && p.startsAt;

  const post: Post = {
    ...card,
    ...withHeadingIds(body),
    dateIso: p.publishedAt!.toISOString(),
    readingTime: locale === "ar" ? `${minutes} دقائق` : `${minutes} Min`,
    author: pick(p.authorLabel, locale),
    gallery: p.gallery,
    event: isEvent
      ? { startsAt: p.startsAt!.toISOString(), endsAt: p.endsAt?.toISOString() ?? null, venue: pick(p.venue, locale), registrationUrl: p.registrationUrl, upcoming: (p.endsAt ?? p.startsAt)! > new Date() }
      : null,
  };
  const path = `/media/${card.category}/${p.slug}`;
  const mediaTitle = stripGold(as<{ title: string }>(media.hero).title);
  return {
    site,
    page: { post, related: related.map((d) => postCard(d, categories, locale)) },
    seo: buildSeo({
      locale, site, path, type: "article",
      stored: p.seo && { title: pick(p.seo.title, locale), description: pick(p.seo.description, locale), keywords: p.seo.keywords[locale], ogImage: p.seo.ogImage },
      fallback: { title: post.title, description: post.excerpt, image: p.coverImage },
      breadcrumb: [{ name: mediaTitle, path: "/media" }, { name: card.categoryName, path: `/media/${card.category}` }, { name: post.title, path }],
      jsonLd: [schema.post(locale, {
        kind: category?.kind ?? "news", path, title: post.title, description: post.excerpt, image: p.coverImage ?? "", author: post.author,
        publishedAt: post.dateIso, updatedAt: p.updatedAt.toISOString(), startsAt: post.event?.startsAt ?? null, endsAt: post.event?.endsAt ?? null,
        venue: post.event?.venue ?? "", registrationUrl: p.registrationUrl,
      })],
    }),
  };
});

// ─── Careers ─────────────────────────────────────────────────────────────────

export const getCareersPage = cachedLoader("page:careers", ["page:careers", "page:settings", "jobs"], async (localeArg: string): Promise<PagePayload<CareersPage>> => {
  const locale = asLocale(localeArg);
  const [site, s, jobs] = await Promise.all([loadSite(locale), loadSections("careers", locale), db.jobs.find({ status: "open" }).sort({ postedAt: -1 }).toArray()]);
  const hero = as<CareersPage["hero"]>(s.hero);
  const cards = jobs.map((j) => jobCard(j, locale));
  return {
    site,
    page: { hero, discover: as(s.discover), hiring: as(s.hiring), jobs: cards, values: as(s.values) },
    seo: buildSeo({
      locale, site, path: "/careers", stored: s.seo,
      fallback: { title: locale === "ar" ? "الوظائف" : "Careers", description: hero.description, image: hero.image },
      breadcrumb: [{ name: locale === "ar" ? "الوظائف" : "Careers", path: "/careers" }],
      jsonLd: [schema.pageType("CollectionPage", locale, "/careers"), schema.itemList(locale, cards.map((j) => ({ name: j.title, path: `/careers/${j.slug}` })))],
    }),
  };
});

/** null when the job doesn't exist or isn't open */
export const getJobPage = cachedLoader("page:job", ["jobs", "page:careers", "page:settings"], async (localeArg: string, slug?: string): Promise<PagePayload<JobPage> | null> => {
  const locale = asLocale(localeArg);
  const j = await db.jobs.findOne({ slug, status: "open" });
  if (!j) return null;
  const [site, s] = await Promise.all([loadSite(locale), loadSections("careers", locale)]);
  const card = jobCard(j, locale);
  const careers = locale === "ar" ? "الوظائف" : "Careers";
  const job = {
    ...card,
    intro: pick(j.intro, locale),
    responsibilities: j.responsibilities?.[locale] ?? [],
    requirements: j.requirements?.[locale] ?? [],
    experience: pick(j.experience, locale),
    salary: pick(j.salaryLabel, locale),
    deadline: formatDate(j.deadline, locale),
  };
  return {
    site,
    page: { job, heroImage: as<{ image: string }>(s.hero).image, jobInfo: as(s.jobInfo) },
    seo: buildSeo({
      locale, site, path: `/careers/${j.slug}`,
      stored: j.seo && { title: pick(j.seo.title, locale), description: pick(j.seo.description, locale), keywords: j.seo.keywords[locale], ogImage: j.seo.ogImage },
      fallback: { title: job.title, description: job.summary || job.intro, image: as<{ image: string }>(s.hero).image },
      breadcrumb: [{ name: careers, path: "/careers" }, { name: job.title, path: `/careers/${j.slug}` }],
      jsonLd: [schema.job(locale, {
        slug: j.slug, title: job.title, description: [job.intro, ...job.responsibilities, ...job.requirements].join("\n"), employmentType: j.employmentType,
        postedAt: j.postedAt, deadline: j.deadline, location: job.location, salaryMin: j.salaryMin, salaryMax: j.salaryMax, currency: j.currency, openings: j.openings,
      })],
    }),
  };
});

// ─── Contact · Calculator · Privacy ──────────────────────────────────────────

export const getContactPage = cachedLoader("page:contact", ["page:contact", "page:settings", "projects"], async (localeArg: string): Promise<PagePayload<ContactPage>> => {
  const locale = asLocale(localeArg);
  const [site, s, unitTypes] = await Promise.all([loadSite(locale), loadSections("contact", locale), db.unitTypes.find().sort({ position: 1 }).toArray()]);
  const hero = as<ContactPage["hero"]>(s.hero);
  return {
    site,
    page: { hero, form: as(s.form), unitTypes: unitTypes.map((t) => ({ id: t._id, name: pick(t.name, locale) })) },
    seo: buildSeo({
      locale, site, path: "/contact", stored: s.seo,
      fallback: { title: stripGold(hero.title), description: hero.description, image: hero.image },
      breadcrumb: [{ name: stripGold(hero.title), path: "/contact" }],
      jsonLd: [schema.pageType("ContactPage", locale, "/contact")],
    }),
  };
});

export const getCalculatorPage = cachedLoader("page:calculator", ["page:calculator", "page:settings", "calculator", "projects"], async (localeArg: string): Promise<PagePayload<CalculatorPage>> => {
  const locale = asLocale(localeArg);
  const [site, s, setup, rows] = await Promise.all([loadSite(locale), loadSections("calculator", locale), getCalculatorSetup(), buildDestinations(locale, true)]);
  const intro = as<CalculatorPage["intro"]>(s.intro);
  const title = stripGold(intro.heading);
  return {
    site,
    page: {
      intro,
      disclaimer: as<{ text: string }>(s.disclaimer).text,
      // DTO: CMS-only fields (status, skippedUnits) never reach the browser
      destinations: rows.map((row) => ({
        id: row.id, slug: row.slug, name: row.name, location: row.location, phaseLabel: row.phaseLabel, image: row.image,
        occupancyPct: row.occupancyPct, appreciationPct: row.appreciationPct, deliveryMonth: row.deliveryMonth,
        rentalStartMonth: row.rentalStartMonth, assumptionCode: row.assumptionCode, effectiveDate: row.effectiveDate, unitTypes: row.unitTypes,
      })),
      horizons: setup.horizons,
      defaultHorizon: setup.defaultHorizon,
    },
    seo: buildSeo({
      locale, site, path: "/calculator", stored: s.seo,
      fallback: { title, description: intro.subtitle },
      breadcrumb: [{ name: title, path: "/calculator" }],
      jsonLd: [schema.calculator(locale, title)],
    }),
  };
});

export const getPrivacyPage = cachedLoader("page:privacy", ["page:privacy", "page:settings"], async (localeArg: string): Promise<PagePayload<PrivacyPage>> => {
  const locale = asLocale(localeArg);
  const [site, s] = await Promise.all([loadSite(locale), loadSections("privacy", locale)]);
  const content = as<{ title: string; body: string }>(s.content);
  return {
    site,
    page: { title: content.title, bodyHtml: content.body },
    seo: buildSeo({ locale, site, path: "/privacy", stored: s.seo, fallback: { title: content.title, description: content.body }, breadcrumb: [{ name: content.title, path: "/privacy" }] }),
  };
});

// ─── static params (slugs to prerender) ──────────────────────────────────────

export const getProjectSlugs = async () => (await db.projects.find({ status: "published" }, { projection: { slug: 1 } }).toArray()).map((p) => p.slug);
export const getJobSlugs = async () => (await db.jobs.find({ status: "open" }, { projection: { slug: 1 } }).toArray()).map((j) => j.slug);
