// One place for the "?" tooltips. Written for editors, not developers: what the field is,
// where visitors see it, and what changing it does. Looked up by the field's name, so any
// field added later with a known name is explained automatically. A field can still pass
// its own `help` to override.

export const seoHelp: Record<string, string> = {
  "seo.title": "The title search engines and browser tabs show for this page. Leave empty to use the normal title.",
  "seo.description": "The short summary shown under the title in Google results. Plain text. Leave empty to use the summary or excerpt.",
  "seo.keywords": "Words people might search for, one per line, in each language. Added to the page's keywords tag.",
  "seo.ogImage": "The picture shown when this page is shared on WhatsApp, Facebook, LinkedIn or X. Falls back to the cover image.",
};

const byName: Record<string, string> = {
  // identity & publishing
  slug: "The last part of the page's web address, e.g. /projects/harbor-view or /media/news/launch-event. It is the same in English and Arabic, and it locks once the page has been live so existing links keep working.",
  status: "Draft = only visible here in the CMS. Published / Open = live on the website. Archived / Closed = taken off the website but kept here.",
  categoryId: "Which tab of the Media Center this post appears under. The category is also part of the post's web address (/media/<category>/<slug>); if you move a post to another category, its old address redirects to the new one. Event categories add an Event details tab. Categories are managed under Shared → Lookups.",
  categoryIds: "Which post categories this block shows. The newest published posts from them appear automatically.",
  kind: "What posts in this category are. Event categories give their posts a date and venue.",
  publishedAt: "When the post goes live. Leave empty to publish immediately. Pick a future date to schedule it — it appears on the website by itself at that time.",
  published: "Turn off to hide this item from the website without deleting it.",
  key: "A short internal code the website uses to recognise this item. Visitors never see it. Don't change it once it is in use.",

  // common copy
  title: "The main heading of this block, exactly as visitors read it.",
  name: "The name visitors see. Fill in both English and Arabic.",
  heading: "The heading shown above this section on the website.",
  eyebrow: "The small line of text shown above the main heading.",
  subtitle: "The supporting line shown under the main title.",
  description: "Supporting text shown under the heading. You can use bold, italic, lists and links.",
  text: "The paragraph visitors read in this block.",
  summary: "A short version used on cards and lists. It is also the default description for search engines.",
  excerpt: "A one or two sentence teaser shown on cards. It is also the default description for search engines.",
  body: "The full article. Use the Heading button for sections — they automatically become the table of contents on the website.",
  authorLabel: "Who the article is credited to, as shown next to the date.",
  message: "The quoted message shown in this block.",
  caption: "A small line of text shown under the number.",
  value: "The big number or figure, e.g. “50+” or “EGP 3.5M”.",
  label: "The words that explain the number or item.",
  question: "The question as a visitor would ask it.",
  answer: "The answer shown when the visitor opens the question.",

  credential: "The line under the person's name, e.g. their degree or role.",
  keywords: "Words people might search for, one per line, in each language.",
  ogImage: "The picture shown when this page is shared on WhatsApp, Facebook, LinkedIn or X.",

  // media
  image: "The picture for this block. Upload a file or paste a link.",
  images: "The pictures for this block, shown in this order.",
  media: "The background of this block — a picture or a short MP4 video.",
  coverImage: "The main picture: used on cards, at the top of the page and when the page is shared. Required before publishing.",
  heroMedia: "The large picture or video at the very top of the page. If empty, the cover image is used.",
  gallery: "Extra pictures shown in the gallery on the page, in this order.",
  logo: "The logo file. A transparent PNG or WebP looks best.",
  mapImage: "The map picture shown in the Location section.",
  backgroundImage: "The picture shown behind this section.",
  ctaMedia: "The picture or video behind the call-to-action at the bottom of every page.",

  // events
  startsAt: "When the event begins. The website uses it to label the event as Upcoming or Past.",
  endsAt: "When the event ends. Optional.",
  venue: "Where the event takes place.",
  registrationUrl: "A link where visitors can register. Optional — leave empty to show no button.",

  // jobs
  openings: "How many people you are hiring for this role.",
  postedAt: "The date shown as “posted”. Leave empty to use the day the job is opened.",
  deadline: "The last day to apply. Shown on the job page and sent to Google's job listings.",
  employmentType: "Used for Google's job listings. What visitors read is the “Job type label” below.",
  salaryMin: "Lowest monthly salary, numbers only. Optional — used for Google's job listings, not shown as typed.",
  salaryMax: "Highest monthly salary, numbers only. Optional.",
  currency: "Three-letter currency code, e.g. EGP or USD.",
  jobTypeLabel: "What visitors read, e.g. “Full time (Hybrid)”.",
  salaryLabel: "What visitors read, e.g. “EGP 30k – 50k (Monthly)”.",
  experience: "What visitors read, e.g. “3+ Years Experience”.",
  intro: "The opening paragraph at the top of the job page.",
  responsibilities: "The “What you will do” bullet list. One bullet per line.",
  requirements: "The “Requirements” bullet list. One bullet per line.",
  perks: "The “Perks & Benefits” list shown on every job page. One per line.",
  workingHours: "Shown in the facts box on every job page.",
  workingDays: "Shown in the facts box on every job page.",
  educationNote: "The “Educational Qualification” paragraph shown on every job page.",
  closing: "The final paragraph shown at the bottom of every job page.",

  // projects
  buildStatus: "Where construction stands. Shown in the project's facts list.",
  year: "The delivery or completion year shown in the project's facts list.",
  location: "A short place name, e.g. “North Coast”. Shown on cards and in the facts list.",
  sector: "The kind of development, e.g. “Residential Luxury”. Shown in the facts list.",
  sizeLabel: "The size as visitors read it, e.g. “40,000 sqm”.",
  tagline: "The sentence shown under the project name at the top of its page.",
  locationDescription: "The paragraph under the “Project Location” heading.",
  facilitiesDescription: "The paragraph under the “Project Facilities” heading.",
  unitsDescription: "The paragraph shown on the unit cards.",
  address: "The full address. Used for the “Open Map” button and for search engines.",
  lat: "Map latitude, e.g. 30.0444. Optional — helps search engines place the project.",
  lng: "Map longitude, e.g. 31.2357. Optional.",
  category: "Which tab this place appears under in the Location section.",
  distanceKm: "Distance from the project in kilometres, e.g. 0.8.",
  unitTypeId: "Pick from the shared list of unit types (Shared → Lookups). Each type can be used once per project.",
  sizeRange: "The size range as visitors read it, e.g. “75 – 100 m²”.",

  // calculator
  horizons: "The holding periods a visitor can pick on the calculator's Horizon step.",
  defaultHorizon: "The horizon that is already selected when the visitor reaches that step. Must be one of the choices.",
  assumptionCode: "A reference for this set of figures, e.g. “MRG-2026-Q3”. Give it a new value whenever you change a number — every lead records the code the visitor saw, so you can always tell which figures they were shown.",
  effectiveDate: "The date these figures apply from. Shown in the calculator's disclaimer.",
  phaseLabel: "Shown on the project card in the calculator, e.g. “Off-Plan · Phase 1”.",
  occupancyPct: "Expected share of the year a unit is rented, as a percentage (0–100). Used for the rental income.",
  appreciationPct: "Expected yearly growth in a unit's value, as a percentage. Used for the projected value.",
  deliveryMonth: "How many months after booking the unit is delivered. Shown on the calculator's timeline.",
  rentalStartMonth: "How many months after booking rent starts coming in. No rent is counted before it. Can't be earlier than delivery.",
  avgPrice: "Average price of this unit type in EGP, numbers only. With the yearly rent, it puts this unit in the calculator.",
  annualGrossRent: "Expected rent per year in EGP if the unit were rented all year. Occupancy is applied on top.",
  annualOpCosts: "Expected running costs per year in EGP (maintenance, management, fees). Subtracted from the rent.",
  years: "A number of years, e.g. 5.",

  // page composition
  limit: "How many posts the block shows.",
  stats: "The row of numbers. Add, remove and reorder them freely.",
  items: "The repeated cards in this block. The order here is the order on the website.",
  people: "The people shown in this block, in this order.",
  cardTitle: "The heading on the form card.",

  // site settings
  phone: "The main phone number, shown on the Contact page.",
  whatsapp: "WhatsApp number in international format, e.g. +201012877474.",
  email: "The public contact email address.",
  mapUrl: "A Google Maps link to the office.",
  platform: "Which social network this link is for — it decides the icon.",
  url: "The full link, starting with https://",
  ctaHeading: "The large sentence in the call-to-action at the bottom of every page.",
  newsletterDisclaimer: "The small consent text under the newsletter box.",
  copyright: "The line at the very bottom of every page.",
  legalName: "The company's official name, used in search-engine data.",
  defaultDescription: "The description search engines show for any page that doesn't have its own.",

  // users
  role: "Admins can do everything. Editors manage content, pages and the inbox, but not users, site settings or calculator figures.",
  password: "At least 10 characters. When editing a user, leave empty to keep their current password.",
};

/** `storyBlocks.2.heading` → `heading`; `seo.title` is matched whole first. */
export function fieldHelp(path: string): string | undefined {
  const clean = path.replace(/\.\d+/g, "").replace(/\.(en|ar)$/, "");
  return seoHelp[clean] ?? byName[clean.split(".").pop()!];
}

export const statusHelp: Record<string, string> = {
  Draft: "Only visible here in the CMS. Not on the website.",
  Published: "Live on the website.",
  Scheduled: "Will go live by itself on its publish date.",
  Archived: "Taken off the website, kept here.",
  Open: "Live on the Careers page and accepting applications.",
  Closed: "No longer shown on the Careers page.",
};
