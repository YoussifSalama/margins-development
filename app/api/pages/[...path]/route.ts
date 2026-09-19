import {
  getAboutPage, getCalculatorPage, getCareersPage, getContactPage, getHomePage, getJobPage, getMediaPage, getPostPage,
  getPrivacyPage, getProjectPage, getProjectsPage,
} from "@/server/public/pages";

// ONE GET endpoint per page. Each returns the whole page in one response:
//   { seo: title / description / keywords / canonical / hreflang / image / JSON-LD,
//     site: contact details, social links, footer,
//     page: every section's content }
//
//   GET /api/pages/home                      ?locale=en|ar
//   GET /api/pages/about
//   GET /api/pages/projects                  ?page=&limit=
//   GET /api/pages/projects/<slug>
//   GET /api/pages/media                     ?page=&limit=
//   GET /api/pages/media/<category>          ?page=&limit=
//   GET /api/pages/media/<category>/<slug>
//   GET /api/pages/careers
//   GET /api/pages/careers/<slug>
//   GET /api/pages/contact
//   GET /api/pages/calculator
//   GET /api/pages/privacy
//
// The website's server components call the same loaders directly (no HTTP hop to itself),
// so this route and the rendered pages can never disagree.

export async function GET(request: Request, { params }: RouteContext<"/api/pages/[...path]">) {
  const [page, a, b, ...rest] = (await params).path;
  const query = new URL(request.url).searchParams;
  const locale = query.get("locale") === "ar" ? "ar" : "en";
  const number = (name: string) => Number(query.get(name)) || undefined;

  const load = () => {
    if (rest.length) return null;
    switch (page) {
      case "home": return a ? null : getHomePage(locale);
      case "about": return a ? null : getAboutPage(locale);
      case "contact": return a ? null : getContactPage(locale);
      case "calculator": return a ? null : getCalculatorPage(locale);
      case "privacy": return a ? null : getPrivacyPage(locale);
      case "projects": return b ? null : a ? getProjectPage(locale, a) : getProjectsPage(locale, number("page"), number("limit"));
      case "careers": return b ? null : a ? getJobPage(locale, a) : getCareersPage(locale);
      case "media": return b ? getPostPage(locale, b) : getMediaPage(locale, a, number("page"), number("limit"));
      default: return null;
    }
  };

  try {
    const payload = await load();
    if (!payload) return Response.json({ error: "Not found" }, { status: 404 });
    // a post lives under exactly one category
    if (page === "media" && b && "post" in payload.page && payload.page.post.category !== a) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(payload, { headers: { "cache-control": "public, s-maxage=60, stale-while-revalidate=300" } });
  } catch (error) {
    console.error("page endpoint failed:", error);
    return Response.json({ error: "Temporarily unavailable" }, { status: 503 });
  }
}
