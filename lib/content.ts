// The shapes the website renders. Everything here is already in ONE language, plain strings,
// ISO dates — produced by server/public/* from the CMS. Components import types from here only;
// nothing in the website knows about MongoDB documents or { en, ar } pairs.

export type Locale = "en" | "ar";

// ─── shared by every page payload ────────────────────────────────────────────

export type SocialLink = { platform: string; url: string };

export type Site = {
  brand: string;
  logo: string;
  /** site-wide fallback for og:image when a page has no image of its own */
  shareImage: string;
  contact: { phone: string; whatsapp: string; email: string; address: string; mapUrl: string };
  socials: SocialLink[];
  footer: { ctaHeading: string; ctaMedia: string; newsletterDisclaimer: string; copyright: string };
};

export type PageSeo = {
  title: string;
  description: string;
  keywords: string[];
  /** locale-prefixed path, e.g. /en/media/news */
  canonical: string;
  /** hreflang → path, including x-default */
  alternates: Record<string, string>;
  /** og:image / twitter image: the editor's share image → the page's own picture → the site default */
  image: string | null;
  siteName: string;
  locale: Locale;
  type: "website" | "article";
  /** schema.org objects, generated from the content — rendered as <script type="application/ld+json"> */
  jsonLd: Record<string, unknown>[];
};

/** What every page endpoint returns: GET /api/pages/<page> */
export type PagePayload<T> = { seo: PageSeo; site: Site; page: T };

// ─── entities ────────────────────────────────────────────────────────────────

export type PostCategory = { key: string; name: string };

export type PostCard = {
  slug: string;
  category: string;
  categoryName: string;
  title: string;
  excerpt: string;
  /** display string in the page's language */
  date: string;
  image: string;
};

export type Post = PostCard & {
  dateIso: string;
  readingTime: string;
  author: string;
  /** sanitised HTML; every <h2> carries an id matching `headings` */
  bodyHtml: string;
  headings: { id: string; text: string }[];
  gallery: string[];
  event: { startsAt: string; endsAt: string | null; venue: string; registrationUrl: string | null; upcoming: boolean } | null;
};

export type ProjectCard = { slug: string; name: string; location: string; image: string };

export type ProjectDetail = ProjectCard & {
  tagline: string;
  summary: string;
  description: string;
  heroMedia: string;
  gallery: string[];
  facts: { year: string; location: string; sector: string; size: string; status: "planning" | "under_construction" | "completed" };
  storyBlocks: { heading: string; paragraphs: string[]; images: string[] }[];
  locationDescription: string;
  mapImage: string;
  mapUrl: string;
  placeCategories: { key: "transport" | "education" | "shopping" | "food"; places: { name: string; distance: string }[] }[];
  facilitiesDescription: string;
  amenities: { key: string; label: string }[];
  unitsDescription: string;
  units: { key: string; title: string; image: string; sizeRange: string }[];
};

export type JobCard = { slug: string; title: string; openings: number; summary: string; location: string; date: string; jobType: string };

export type JobDetail = JobCard & {
  intro: string;
  responsibilities: string[];
  requirements: string[];
  experience: string;
  salary: string;
  deadline: string;
};

export type FaqItem = { question: string; answer: string };
export type Partner = { name: string; logo: string | null; url: string | null };

// ─── page bodies ─────────────────────────────────────────────────────────────

type Hero = { title: string; description: string; image: string };

export type HomePage = {
  hero: { title: string; subtitle: string; media: string };
  partners: Partner[];
  about: { text: string; stats: { value: string; label: string }[] };
  showcase: { eyebrow: string; projects: ProjectCard[] };
  approach: { heading: string; description: string; items: { title: string; description: string; image: string }[] };
  feed: { heading: string; description: string; posts: PostCard[] };
  faq: { heading: string; description: string; items: FaqItem[] };
};

export type AboutPage = {
  hero: Hero;
  partners: Partner[];
  whoWeAre: { eyebrow: string; title: string; description: string };
  stats: { value: string; label: string; caption: string; image: string }[];
  statement: { title: string; description: string };
  chairman: { eyebrow: string; title: string; message: string; people: { name: string; credential: string; image: string }[] };
};

export type Company = {
  vision: { title: string; description: string; image: string };
  mission: { title: string; description: string; image: string };
  banner: { eyebrow: string; title: string; image: string };
  values: { heading: string; items: { title: string; description: string }[] };
};

export type ProjectsPage = {
  hero: { title: string; description: string; images: string[] };
  projects: ProjectCard[];
  pagination: { page: number; totalPages: number; limit: number };
  company: Company;
};

export type ProjectPage = { project: ProjectDetail; more: ProjectCard[]; faq: { heading: string; description: string; items: FaqItem[] } };

export type MediaPage = {
  hero: Hero;
  categories: PostCategory[];
  category: PostCategory | null;
  /** page 1 only: the pinned main item (or the latest) — already removed from `posts` */
  featured: PostCard | null;
  posts: PostCard[];
  pagination: { page: number; totalPages: number; limit: number };
};

export type PostPage = { post: Post; related: PostCard[] };

export type CareersPage = {
  hero: Hero;
  discover: { title: string; description: string; images: string[] };
  hiring: { heading: string };
  jobs: JobCard[];
  values: { title: string; description: string; items: { title: string; description: string }[] };
};

export type JobPage = {
  job: JobDetail;
  heroImage: string;
  jobInfo: { perks: string[]; workingHours: string; workingDays: string; educationNote: string; closing: string };
};

export type ContactPage = { hero: Hero; form: { title: string; cardTitle: string; backgroundImage: string }; unitTypes: { id: string; name: string }[] };

export type CalculatorPage = {
  intro: { eyebrow: string; heading: string; subtitle: string };
  disclaimer: string;
  destinations: import("./calculator").Destination[];
  horizons: number[];
  defaultHorizon: number;
};

export type PrivacyPage = { title: string; bodyHtml: string };
