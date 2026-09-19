// SEED DATA ONLY — imported into the CMS by scripts/seed.mts on a fresh database.
// The website reads the CMS (server/public/pages.ts), never this file.
export type Status = "Planning" | "Under Construction" | "Completed";

export type Project = {
  slug: string;
  status: Status;
  image: string;
  name: string;
  location: string;
  summary: string;
  description: string;
  year: string;
  sector: string;
  size: string;
};

type Locale = "en" | "ar";

// ponytail: placeholder data, swap for CMS query once backend decided
const projectsByLocale: Record<Locale, Project[]> = {
  en: [
    {
      slug: "harbor-view-residences",
      status: "Under Construction",
      image: "/pages/projects/detail/story1-1.png",
      name: "Harbor View Residences",
      location: "North Coast",
      summary: "Waterfront residential community with private marina access.",
      description:
        "Harbor View Residences is a 120-unit waterfront development featuring private marina access, landscaped courtyards, and panoramic sea views. Delivery phase begins Q3 2027.",
      year: "2027",
      sector: "Residential Luxury",
      size: "4,800 sqft",
    },
    {
      slug: "meridian-business-district",
      status: "Planning",
      image: "/pages/projects/detail/story1-3.png",
      name: "Meridian Business District",
      location: "New Capital",
      summary: "Mixed-use commercial and office towers in the new capital core.",
      description:
        "A 40,000 sqm mixed-use development combining Grade-A office space, retail, and conference facilities at the heart of the new administrative capital.",
      year: "2028",
      sector: "Commercial",
      size: "40,000 sqm",
    },
    {
      slug: "willowbrook-villas",
      status: "Completed",
      image: "/pages/projects/detail/story2-2.png",
      name: "Willowbrook Villas",
      location: "October City",
      summary: "Gated villa community with green belts and community amenities.",
      description:
        "Willowbrook Villas offers 85 standalone villas across a fully gated community with parks, a clubhouse, and dedicated school zoning — fully delivered and handed over.",
      year: "2024",
      sector: "Residential Villas",
      size: "3,200 sqft",
    },
  ],
  ar: [
    {
      slug: "harbor-view-residences",
      status: "Under Construction",
      image: "/pages/projects/detail/story1-1.png",
      name: "هاربور فيو ريزيدنسز",
      location: "الساحل الشمالي",
      summary: "مجتمع سكني على الواجهة البحرية مع مرسى خاص لليخوت.",
      description:
        "هاربور فيو ريزيدنسز مشروع سكني على الواجهة البحرية يضم 120 وحدة، مع مرسى خاص، وباحات مشجّرة، وإطلالات بانورامية على البحر. تبدأ مرحلة التسليم في الربع الثالث من 2027.",
      year: "2027",
      sector: "سكني فاخر",
      size: "4,800 قدم مربع",
    },
    {
      slug: "meridian-business-district",
      status: "Planning",
      image: "/pages/projects/detail/story1-3.png",
      name: "ميريديان بيزنس ديستريكت",
      location: "العاصمة الإدارية الجديدة",
      summary: "أبراج مكتبية وتجارية متعددة الاستخدامات في قلب العاصمة الجديدة.",
      description:
        "مشروع متعدد الاستخدامات بمساحة 40 ألف متر مربع يجمع بين مكاتب إدارية من الفئة الأولى، ومساحات تجارية، وقاعات مؤتمرات، في قلب العاصمة الإدارية الجديدة.",
      year: "2028",
      sector: "تجاري",
      size: "40,000 متر مربع",
    },
    {
      slug: "willowbrook-villas",
      status: "Completed",
      image: "/pages/projects/detail/story2-2.png",
      name: "ويلوبروك فيلاز",
      location: "مدينة أكتوبر",
      summary: "مجتمع فيلات مسوّر بمساحات خضراء ومرافق مجتمعية.",
      description:
        "يضم ويلوبروك فيلاز 85 فيلا مستقلة داخل مجتمع مسوّر بالكامل، مع حدائق ونادٍ اجتماعي ومنطقة مدارس مخصصة — تم تسليمه بالكامل.",
      year: "2024",
      sector: "فيلات سكنية",
      size: "3,200 قدم مربع",
    },
  ],
};

export function getProjects(locale: string) {
  return projectsByLocale[locale as Locale] ?? projectsByLocale.en;
}

export function getProjectBySlug(locale: string, slug: string) {
  return getProjects(locale).find((p) => p.slug === slug);
}
