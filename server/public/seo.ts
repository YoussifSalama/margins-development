import "server-only";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import type { Locale, PageSeo, Site } from "@/lib/content";

// Everything a page needs for search engines, generated from the content. Editors only ever
// type a title / description / keywords; tags, canonical, hreflang and structured data are built here.

const abs = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);
const localePath = (locale: string, path: string, query = "") => `/${locale}${path === "/" ? "" : path}${query}`;
// og:image must be a picture — a hero can be an MP4, which social networks ignore
const isImage = (url: string | null | undefined): url is string => Boolean(url) && !/\.(mp4|webm|mov)(\?|$)/i.test(url!);
const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

type StoredSeo = { title?: string; description?: string; keywords?: string[]; ogImage?: string | null };

export function buildSeo(input: {
  locale: Locale;
  site: Site;
  /** locale-less path: "/", "/media/news" */
  path: string;
  query?: string;
  stored: StoredSeo | null | undefined;
  /** used when the editor left the SEO tab empty */
  fallback: { title: string; description: string; image?: string | null };
  type?: "website" | "article";
  /** "Home › Media Center › News": name + locale-less path, after Home */
  breadcrumb?: { name: string; path: string }[];
  /** page-specific schema.org objects (Article, Event, JobPosting, FAQPage…) */
  jsonLd?: (Record<string, unknown> | null)[];
}): PageSeo {
  const { locale, site, path, query = "", stored, fallback } = input;
  const isHome = path === "/";
  const pageTitle = stored?.title || fallback.title;
  const title = isHome ? pageTitle || site.brand : `${pageTitle} — ${site.brand}`;
  const description = (stored?.description || text(fallback.description)).slice(0, 300);
  // editor's share image → the page's own picture (cover / hero) → the site-wide default
  const image = [stored?.ogImage, fallback.image, site.shareImage].find(isImage) ?? null;
  const canonical = localePath(locale, path, query);

  const organization = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: site.brand,
    url: SITE_URL,
    logo: abs(site.logo),
    sameAs: site.socials.map((social) => social.url),
    ...(site.contact.phone || site.contact.email
      ? { contactPoint: { "@type": "ContactPoint", contactType: "sales", telephone: site.contact.phone || undefined, email: site.contact.email || undefined, availableLanguage: ["en", "ar"] } }
      : {}),
    ...(site.contact.address ? { address: { "@type": "PostalAddress", streetAddress: site.contact.address, addressCountry: "EG" } } : {}),
  };

  const trail = [{ name: site.brand, path: "/" }, ...(input.breadcrumb ?? [])];
  const graph: Record<string, unknown>[] = [
    organization,
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: site.brand, url: SITE_URL, inLanguage: locale, publisher: { "@id": `${SITE_URL}/#organization` } },
    {
      "@type": "WebPage",
      "@id": `${abs(canonical)}#webpage`,
      url: abs(canonical),
      name: title,
      description,
      inLanguage: locale,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      ...(image ? { primaryImageOfPage: abs(image) } : {}),
    },
    ...(trail.length > 1
      ? [{
          "@type": "BreadcrumbList",
          itemListElement: trail.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, name: crumb.name, item: abs(localePath(locale, crumb.path)) })),
        }]
      : []),
    ...(input.jsonLd ?? []).filter((item): item is Record<string, unknown> => item !== null),
  ];

  return {
    title,
    description,
    keywords: stored?.keywords ?? [],
    canonical,
    alternates: {
      ...Object.fromEntries(routing.locales.map((l) => [l, localePath(l, path, query)])),
      "x-default": localePath(routing.defaultLocale, path, query),
    },
    image,
    siteName: site.brand,
    locale,
    type: input.type ?? "website",
    // one @graph so the entities can reference each other by @id
    jsonLd: [{ "@context": "https://schema.org", "@graph": graph }],
  };
}

/** PageSeo → Next's Metadata (title, description, keywords, canonical, hreflang, Open Graph, Twitter). */
export function toMetadata(seo: PageSeo): Metadata {
  return {
    title: { absolute: seo.title },
    description: seo.description,
    keywords: seo.keywords.length ? seo.keywords : undefined,
    alternates: { canonical: seo.canonical, languages: seo.alternates },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonical,
      type: seo.type,
      siteName: seo.siteName,
      locale: seo.locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: seo.locale === "ar" ? ["en_US"] : ["ar_EG"],
      images: seo.image ? [{ url: seo.image, alt: seo.title }] : undefined,
    },
    twitter: { card: seo.image ? "summary_large_image" : "summary", title: seo.title, description: seo.description, images: seo.image ? [seo.image] : undefined },
  };
}

// ─── schema.org builders for page-specific entities ──────────────────────────

const org = { "@id": `${SITE_URL}/#organization` };

export const schema = {
  pageType: (type: "AboutPage" | "ContactPage" | "CollectionPage", locale: string, path: string) => ({ "@type": type, url: abs(localePath(locale, path)), isPartOf: { "@id": `${SITE_URL}/#website` } }),

  itemList: (locale: string, items: { name: string; path: string }[]) =>
    items.length ? { "@type": "ItemList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, url: abs(localePath(locale, item.path)) })) } : null,

  faq: (items: { question: string; answer: string }[]) =>
    items.length
      ? { "@type": "FAQPage", mainEntity: items.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }
      : null,

  project: (locale: string, p: { name: string; slug: string; description: string; image: string; address: string; lat: number | null; lng: number | null; amenities: string[] }) => ({
    "@type": "RealEstateListing",
    name: p.name,
    url: abs(localePath(locale, `/projects/${p.slug}`)),
    description: text(p.description),
    image: p.image ? abs(p.image) : undefined,
    provider: org,
    about: {
      "@type": ["Place", "Residence"],
      name: p.name,
      ...(p.address ? { address: { "@type": "PostalAddress", streetAddress: p.address, addressCountry: "EG" } } : {}),
      ...(p.lat !== null && p.lng !== null ? { geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lng } } : {}),
      ...(p.amenities.length ? { amenityFeature: p.amenities.map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })) } : {}),
    },
  }),

  /** NewsArticle / BlogPosting / Event, decided by the post category's kind */
  post: (locale: string, p: {
    kind: "news" | "article" | "event"; path: string; title: string; description: string; image: string; author: string;
    publishedAt: string; updatedAt: string; startsAt: string | null; endsAt: string | null; venue: string; registrationUrl: string | null;
  }) => {
    const url = abs(localePath(locale, p.path));
    if (p.kind === "event" && p.startsAt) {
      return {
        "@type": "Event",
        name: p.title,
        description: text(p.description),
        image: p.image ? [abs(p.image)] : undefined,
        startDate: p.startsAt,
        endDate: p.endsAt ?? undefined,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: { "@type": "Place", name: p.venue, address: p.venue },
        organizer: org,
        url,
        ...(p.registrationUrl ? { offers: { "@type": "Offer", url: p.registrationUrl, availability: "https://schema.org/InStock" } } : {}),
      };
    }
    return {
      "@type": p.kind === "news" ? "NewsArticle" : "BlogPosting",
      headline: p.title.slice(0, 110),
      description: text(p.description),
      image: p.image ? [abs(p.image)] : undefined,
      datePublished: p.publishedAt,
      dateModified: p.updatedAt,
      author: p.author ? { "@type": "Organization", name: p.author } : org,
      publisher: org,
      mainEntityOfPage: url,
      inLanguage: locale,
    };
  },

  job: (locale: string, j: {
    slug: string; title: string; description: string; employmentType: string; postedAt: string | null; deadline: string | null;
    location: string; salaryMin: number | null; salaryMax: number | null; currency: string; openings: number;
  }) => ({
    "@type": "JobPosting",
    title: j.title,
    description: j.description,
    datePosted: j.postedAt ?? undefined,
    validThrough: j.deadline ?? undefined,
    employmentType: j.employmentType.toUpperCase(),
    hiringOrganization: org,
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: j.location, addressCountry: "EG" } },
    totalJobOpenings: j.openings,
    url: abs(localePath(locale, `/careers/${j.slug}`)),
    ...(j.salaryMin !== null || j.salaryMax !== null
      ? { baseSalary: { "@type": "MonetaryAmount", currency: j.currency, value: { "@type": "QuantitativeValue", minValue: j.salaryMin ?? undefined, maxValue: j.salaryMax ?? undefined, unitText: "MONTH" } } }
      : {}),
  }),

  calculator: (locale: string, name: string) => ({
    "@type": "WebApplication",
    name,
    url: abs(localePath(locale, "/calculator")),
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: 0, priceCurrency: "EGP" },
    provider: org,
  }),
};
