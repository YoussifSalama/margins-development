import type { FieldDef } from "./fields";
import { seoHelp } from "./help";

const GOLD = "Wrap words in <gold>…</gold> to highlight them. A new line starts a new line on the site.";

const hero = (withImage = true): FieldDef[] => [
  { kind: "text", name: "title", label: "Title", required: true, hint: GOLD },
  { kind: "rich", basic: true, name: "description", label: "Description" },
  ...(withImage ? [{ kind: "media", name: "image", label: "Background image" } as FieldDef] : []),
];

// Same group on every page; entities carry the same shape in their own `seo` column.
const seo: SectionDef = {
  label: "SEO",
  hint: "Leave empty to fall back to the page title and description. Schema markup, canonical and hreflang tags are generated automatically.",
  fields: [
    { kind: "text", name: "title", label: "Meta title", max: 70, hint: "Aim for under 60 characters.", help: seoHelp["seo.title"] },
    { kind: "textarea", name: "description", label: "Meta description", max: 200, hint: "Aim for 120–160 characters.", help: seoHelp["seo.description"] },
    { kind: "list", name: "keywords", label: "Keywords", help: seoHelp["seo.keywords"] },
    { kind: "media", name: "ogImage", label: "Social share image", hint: "1200×630.", help: seoHelp["seo.ogImage"] },
  ],
};

export type SectionDef = {
  label: string;
  hint?: string;
  fields: FieldDef[];
  /** Relationship editors rendered under the fields. The relation lives in its own table, never in this JSON. */
  relation?: "homeShowcase" | "mainPost" | "calculatorDestinations";
  /** rules that span several fields; returns { fieldName: message } for anything wrong */
  check?: (data: Record<string, unknown>) => Record<string, string>;
  adminOnly?: boolean;
};

export type PageDef = { label: string; group: "pages" | "shared"; path?: string; description: string; sections: Record<string, SectionDef> };

export const pages = {
  home: {
    label: "Home",
    group: "pages",
    path: "/",
    description: "Copy and composition of the homepage. Projects, posts, FAQs and partners are referenced, never copied.",
    sections: {
      hero: {
        label: "Hero",
        fields: [
          { kind: "text", name: "title", label: "Title", required: true },
          { kind: "textarea", name: "subtitle", label: "Subtitle", max: 600 },
          { kind: "media", name: "media", label: "Background image or video", accept: "image/*,video/mp4" },
        ],
      },
      about: {
        label: "About & stats",
        fields: [
          { kind: "textarea", name: "text", label: "About text", hint: GOLD },
          {
            kind: "items", name: "stats", label: "Stats", itemLabel: "Stat", maxItems: 6,
            fields: [
              { kind: "text", name: "value", label: "Value", required: true, hint: 'e.g. "50+"' },
              { kind: "text", name: "label", label: "Label", required: true },
            ],
          },
        ],
      },
      showcase: {
        label: "Projects showcase",
        hint: "Home owns which projects appear and in what order. The projects themselves are edited under Content → Projects.",
        fields: [{ kind: "text", name: "eyebrow", label: "Eyebrow" }],
        relation: "homeShowcase",
      },
      approach: {
        label: "Approach",
        fields: [
          { kind: "textarea", name: "heading", label: "Heading", hint: GOLD, max: 300 },
          { kind: "rich", basic: true, name: "description", label: "Description" },
          {
            kind: "items", name: "items", label: "Cards", itemLabel: "Card", maxItems: 6,
            fields: [
              { kind: "text", name: "title", label: "Title", required: true },
              { kind: "rich", basic: true, name: "description", label: "Description" },
              { kind: "media", name: "image", label: "Image" },
            ],
          },
        ],
      },
      feed: {
        label: "News feed",
        hint: "A rule, not a pick list: the newest published posts of the chosen types appear automatically.",
        fields: [
          { kind: "text", name: "heading", label: "Heading", hint: GOLD },
          { kind: "rich", basic: true, name: "description", label: "Description" },
          { kind: "choice", name: "categoryIds", label: "Show posts from", multiple: true, dynamic: "postCategories", options: [] },
          { kind: "number", name: "limit", label: "How many", min: 1, max: 12 },
        ],
      },
      faq: {
        label: "FAQ heading",
        hint: "Only the heading lives here. The questions are the shared list under Content → FAQs.",
        fields: [
          { kind: "text", name: "heading", label: "Heading", hint: GOLD },
          { kind: "rich", basic: true, name: "description", label: "Description" },
        ],
      },
      seo,
    },
  },
  about: {
    label: "About",
    group: "pages",
    path: "/about",
    description: "Company story. The partners marquee reads from Content → Partners.",
    sections: {
      hero: { label: "Hero", fields: hero() },
      whoWeAre: {
        label: "Who we are",
        fields: [
          { kind: "text", name: "eyebrow", label: "Eyebrow" },
          { kind: "textarea", name: "title", label: "Title", hint: GOLD, max: 400 },
          { kind: "rich", basic: true, name: "description", label: "Description" },
        ],
      },
      stats: {
        label: "Stats",
        fields: [
          {
            kind: "items", name: "items", label: "Stat cards", itemLabel: "Stat", maxItems: 6,
            fields: [
              { kind: "text", name: "value", label: "Value", required: true },
              { kind: "text", name: "label", label: "Label", required: true },
              { kind: "text", name: "caption", label: "Caption" },
              { kind: "media", name: "image", label: "Image" },
            ],
          },
        ],
      },
      statement: {
        label: "Statement",
        fields: [
          { kind: "textarea", name: "title", label: "Title", hint: GOLD, max: 400 },
          { kind: "rich", basic: true, name: "description", label: "Description" },
        ],
      },
      chairman: {
        label: "Chairman",
        fields: [
          { kind: "text", name: "eyebrow", label: "Eyebrow" },
          { kind: "text", name: "title", label: "Title" },
          { kind: "textarea", name: "message", label: "Message" },
          {
            kind: "items", name: "people", label: "People", itemLabel: "Person", maxItems: 6,
            fields: [
              { kind: "text", name: "name", label: "Name", required: true },
              { kind: "text", name: "credential", label: "Credential" },
              { kind: "media", name: "image", label: "Photo" },
            ],
          },
        ],
      },
      seo,
    },
  },
  projects: {
    label: "Projects page",
    group: "pages",
    path: "/projects",
    description: "Hero of the projects listing. Vision, mission and values shown below the list live under Shared → Company.",
    sections: {
      hero: { label: "Hero", fields: [...hero(false), { kind: "mediaList", name: "images", label: "Collage images" }] },
      seo,
    },
  },
  media: {
    label: "Media Center",
    group: "pages",
    path: "/media",
    description: "The one listing for every post — news, events, blogs and any category you add. The posts live under Content → Posts; their categories under Shared → Lookups.",
    sections: {
      hero: { label: "Hero", fields: hero() },
      main: {
        label: "Main item",
        hint: "Always shown first on page 1 of the Media Center. When a visitor filters by category, it stays first only if it belongs to that category. If empty — or the chosen post is unpublished — the latest published post takes its place.",
        fields: [],
        relation: "mainPost",
      },
      seo,
    },
  },
  careers: {
    label: "Careers",
    group: "pages",
    path: "/careers",
    description: "Careers page copy plus the info shared by every job. Jobs live under Content → Jobs.",
    sections: {
      hero: { label: "Hero", fields: hero() },
      discover: {
        label: "Discover",
        fields: [
          { kind: "textarea", name: "title", label: "Title", hint: GOLD, max: 400 },
          { kind: "rich", basic: true, name: "description", label: "Description" },
          { kind: "mediaList", name: "images", label: "Photo collage (4)" },
        ],
      },
      hiring: { label: "Hiring heading", fields: [{ kind: "text", name: "heading", label: "Heading", hint: GOLD }] },
      values: {
        label: "Values",
        fields: [
          { kind: "textarea", name: "title", label: "Title", hint: GOLD, max: 400 },
          { kind: "rich", basic: true, name: "description", label: "Description" },
          {
            kind: "items", name: "items", label: "Values", itemLabel: "Value", maxItems: 9,
            fields: [
              { kind: "text", name: "title", label: "Title", required: true },
              { kind: "rich", basic: true, name: "description", label: "Description" },
            ],
          },
        ],
      },
      jobInfo: {
        label: "Shared job info",
        hint: "Shown on every job page — edit once, applies to all jobs.",
        fields: [
          { kind: "list", name: "perks", label: "Perks & benefits" },
          { kind: "text", name: "workingHours", label: "Working hours" },
          { kind: "text", name: "workingDays", label: "Working days" },
          { kind: "textarea", name: "educationNote", label: "Education note" },
          { kind: "textarea", name: "closing", label: "Closing note" },
        ],
      },
      seo,
    },
  },
  contact: {
    label: "Contact",
    group: "pages",
    path: "/contact",
    description: "Contact page copy. Phone, email, address and socials live under Shared → Site settings.",
    sections: {
      hero: { label: "Hero", fields: hero() },
      form: {
        label: "Form",
        fields: [
          { kind: "textarea", name: "title", label: "Big title", max: 200 },
          { kind: "text", name: "cardTitle", label: "Form card title" },
          { kind: "media", name: "backgroundImage", label: "Section background" },
        ],
      },
      seo,
    },
  },
  calculator: {
    label: "Calculator",
    group: "pages",
    path: "/calculator",
    description: "Everything that drives the investment calculator: which projects it offers, the horizon choices, the default assumptions, plus its intro and legal disclaimer. Unit prices and rents live on each project's Units tab.",
    sections: {
      setup: {
        label: "Calculator setup",
        adminOnly: true,
        hint: "These defaults apply to every project in the calculator. A project can override the percentages and months on its own Units tab. Whenever you change a number, give the assumption set a new code and date — every lead records the code the visitor saw.",
        relation: "calculatorDestinations",
        fields: [
          {
            kind: "items", name: "horizons", label: "Horizon choices (years)", itemLabel: "Choice", maxItems: 8,
            help: "The holding periods a visitor can pick on the Horizon step, e.g. 3, 5, 7 and 10 years.",
            fields: [{ kind: "number", name: "years", label: "Years", min: 1, max: 40 }],
          },
          { kind: "number", name: "defaultHorizon", label: "Pre-selected horizon (years)", min: 1, max: 40, help: "The choice that is already selected when the visitor reaches the Horizon step. Must be one of the choices above." },
          { kind: "number", name: "occupancyPct", label: "Occupancy %", min: 0, max: 100 },
          { kind: "number", name: "appreciationPct", label: "Annual appreciation %", min: 0, max: 100 },
          { kind: "number", name: "deliveryMonth", label: "Delivery (months after booking)", min: 0, max: 240 },
          { kind: "number", name: "rentalStartMonth", label: "Rent starts (months after booking)", min: 0, max: 240 },
          { kind: "plain", name: "assumptionCode", label: "Assumption code", hint: 'e.g. "MRG-2026-Q3"' },
          { kind: "date", name: "effectiveDate", label: "Effective date" },
        ],
        check: (data) => {
          const errors: Record<string, string> = {};
          const horizons = (data.horizons as { years: number }[]).map((h) => h.years);
          if (horizons.length === 0) errors.horizons = "Add at least one horizon choice";
          if (new Set(horizons).size !== horizons.length) errors.horizons = "Each choice must be different";
          if (!horizons.includes(data.defaultHorizon as number)) errors.defaultHorizon = "Must be one of the horizon choices";
          if ((data.rentalStartMonth as number) < (data.deliveryMonth as number)) errors.rentalStartMonth = "Rent can't start before delivery";
          if (!(data.assumptionCode as string)) errors.assumptionCode = "Required";
          return errors;
        },
      },
      intro: {
        label: "Intro",
        fields: [
          { kind: "text", name: "eyebrow", label: "Eyebrow" },
          { kind: "text", name: "heading", label: "Heading", hint: GOLD },
          { kind: "textarea", name: "subtitle", label: "Subtitle", max: 600 },
        ],
      },
      disclaimer: {
        label: "Disclaimer",
        adminOnly: true,
        hint: "Legal text shown under every estimate. Use {date} where the effective date should appear.",
        fields: [{ kind: "textarea", name: "text", label: "Disclaimer", required: true, max: 3000 }],
      },
      seo,
    },
  },
  privacy: {
    label: "Privacy policy",
    group: "pages",
    path: "/privacy",
    description: "The policy the newsletter and contact forms link to.",
    sections: {
      content: {
        label: "Content",
        fields: [
          { kind: "text", name: "title", label: "Title", required: true },
          { kind: "rich", name: "body", label: "Body" },
        ],
      },
      seo,
    },
  },
  company: {
    label: "Company",
    group: "shared",
    description: "Company-level statements reused across pages (currently the Projects page).",
    sections: {
      vision: { label: "Vision", fields: [{ kind: "text", name: "title", label: "Title" }, { kind: "rich", basic: true, name: "description", label: "Description" }, { kind: "media", name: "image", label: "Image" }] },
      mission: { label: "Mission", fields: [{ kind: "text", name: "title", label: "Title" }, { kind: "rich", basic: true, name: "description", label: "Description" }, { kind: "media", name: "image", label: "Image" }] },
      banner: { label: "Banner", fields: [{ kind: "text", name: "eyebrow", label: "Eyebrow" }, { kind: "text", name: "title", label: "Title" }, { kind: "media", name: "image", label: "Image" }] },
      values: {
        label: "Values",
        fields: [
          { kind: "text", name: "heading", label: "Heading", hint: GOLD },
          {
            kind: "items", name: "items", label: "Values", itemLabel: "Value", maxItems: 9,
            fields: [{ kind: "text", name: "title", label: "Title", required: true }, { kind: "rich", basic: true, name: "description", label: "Description" }],
          },
        ],
      },
    },
  },
  settings: {
    label: "Site settings",
    group: "shared",
    description: "One source for contact details, socials and the footer — used by the nav, footer, contact page and structured data.",
    sections: {
      contact: {
        label: "Contact details",
        adminOnly: true,
        fields: [
          { kind: "plain", name: "phone", label: "Phone" },
          { kind: "plain", name: "whatsapp", label: "WhatsApp number", hint: "International format, digits only after +." },
          { kind: "plain", name: "email", label: "Email" },
          { kind: "text", name: "address", label: "Address" },
          { kind: "url", name: "mapUrl", label: "Google Maps link" },
        ],
      },
      socials: {
        label: "Social links",
        adminOnly: true,
        hint: "One list. The footer and contact page both read it, in this order.",
        fields: [
          {
            kind: "items", name: "items", label: "Profiles", itemLabel: "Profile", maxItems: 12,
            fields: [
              {
                kind: "choice", name: "platform", label: "Platform",
                options: ["facebook", "instagram", "linkedin", "x", "tiktok", "youtube", "whatsapp"].map((value) => ({ value, label: value })),
              },
              { kind: "url", name: "url", label: "URL" },
            ],
          },
        ],
      },
      footer: {
        label: "Footer",
        adminOnly: true,
        fields: [
          { kind: "textarea", name: "ctaHeading", label: "Call-to-action heading", max: 300 },
          { kind: "media", name: "ctaMedia", label: "Call-to-action background", accept: "image/*,video/mp4" },
          { kind: "textarea", name: "newsletterDisclaimer", label: "Newsletter disclaimer", max: 600, hint: "Wrap the policy link text in <link>…</link>." },
          { kind: "text", name: "copyright", label: "Copyright line", hint: "Use {year} for the current year." },
        ],
      },
      organization: {
        label: "Organization",
        adminOnly: true,
        hint: "Feeds the Organization structured data on every page.",
        fields: [
          { kind: "text", name: "legalName", label: "Legal name" },
          { kind: "media", name: "logo", label: "Logo" },
          { kind: "media", name: "shareImage", label: "Default share image", hint: "1200×630 JPG or PNG.", help: "The picture shown when a link to the website is shared on WhatsApp, Facebook, LinkedIn or X — used for any page that has no share image, cover or hero picture of its own (e.g. Calculator, Privacy policy)." },
          { kind: "textarea", name: "defaultDescription", label: "Default meta description", max: 200 },
        ],
      },
    },
  },
} satisfies Record<string, PageDef>;

export type PageKey = keyof typeof pages;
export const pageDefs: Record<string, PageDef> = pages;
export const getSection = (page: string, section: string) => pageDefs[page]?.sections[section];
