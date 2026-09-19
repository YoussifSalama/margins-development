# Margins CMS

The CMS lives inside this Next.js app under `/admin`, and the public website reads everything
from it. `messages/*.json` holds UI strings only (button labels, form labels, step names) — plus
the starter copy the seed script imports on a fresh database.

## 1. Running it

```bash
# MongoDB must be running (locally: the system mongod on 127.0.0.1:27017)
npm run db:seed                  # import the site's current hardcoded content (add `-- --force` to wipe and re-import)
npm run admin:create -- you@example.com "Your Name" 'a-long-password' admin
npm run dev                      # → http://localhost:3000/admin
```

Environment (`.env.local`): `MONGODB_URI` (the database name is part of the URI, e.g.
`mongodb://127.0.0.1:27017/margins`), and for uploads `CLOUDFLARE_ACCESS_KEY_ID`,
`CLOUDFLARE_SECRET_ACCESS_KEY`, `CLOUDFLARE_S3_CLIENT_API` (the S3 endpoint), `CLOUDFLARE_BUCKET_NAME`,
optionally `CLOUDFLARE_PUBLIC_URL` (a public base URL for the bucket — without it files are streamed through `app/files/[...key]/route.ts`, CDN-cached for a year) and, later, `CLOUDFLARE_PRIVATE_BUCKET_NAME` for CVs.
Until these are set, every media field still accepts a pasted URL.

There are no migrations. Document shapes are the TypeScript types in `server/db/types.ts`;
indexes (unique slugs / emails / keys, session expiry) are created idempotently on first
connection by `server/db/index.ts`. Adding a field = add it to the type and the zod schema;
old documents simply don't have it yet, so read it as optional.

### Where things are

| Path | What |
|---|---|
| `server/db/types.ts` | The domain model as MongoDB documents. `_id` is a UUID string. One document per entity; only translatable fields are `{ en, ar }`. |
| `server/db/index.ts` | Connection, typed collections (`db.projects`, `db.posts`…), index setup, `withId` (`_id` → `id` so nothing outside `server/` knows the database). |
| `server/<domain>/queries.ts` · `actions.ts` | CMS reads / mutations. Every one re-checks the session. |
| `server/action.ts` | `defineAction`: session → role → zod → handler → field-level errors. |
| `server/auth/*` | scrypt passwords, DB sessions, login lockout. Roles: `admin`, `editor`. |
| `server/storage/*` | R2 presigned uploads (browser → R2 directly; Vercel's 4.5 MB body limit never applies). |
| `lib/schemas/*` | zod schemas shared by the client forms and the server functions. |
| `lib/cms/pages.ts` | Every page and its fixed, typed sections. Forms and validation are derived from it. |
| `lib/cms/help.ts` · `lib/cms/tours.ts` | Editor-facing help: the `?` tooltip text per field name, and the spotlight tours. The written guide is `/admin/guide`. |
| `components/cms/*` | Shared CMS UI: `BilingualField`, `MediaField`, `Repeater`, `EntityForm`, `ListManager`, `SectionForm`… |
| `app/admin/*` | Own root layout and stylesheet (`admin.css`) — the site's `globals.css` reuses shadcn's token names with different meanings, so the two are never loaded together. |

### Rules the model follows

- **Entities own content; pages own composition.** Home stores *which* projects it shows
  (`compositions.homeShowcase`: an ordered id array) and a *rule* for its news feed (types + limit). It never
  stores copies. The Media Center's pinned main item is `compositions.mainPost` (page-owned; cleared when the post is deleted).
- **Embed what is owned, reference what is shared.** A project embeds its story blocks, places,
  units and investment (nothing else points at them), so saving a project is one atomic write and
  no transactions are needed. Unit types, amenities, projects-on-Home and pinned posts are
  references by id.
- **No foreign keys, so the rules live in the actions.** Deleting a project pulls it from the Home
  showcase and nulls it on old leads; deleting a post clears the Media Center pin if it pointed at it; a post category in use can't be
  deleted, and deleting a free one drops it from the Home feed rule; deleting an
  amenity unticks it everywhere; a unit type in use can't be deleted; reads ignore ids that no
  longer resolve. Keep this list in mind when adding a new reference.
- **Page copy is typed JSON.** `pageSections` (`_id` = `<page>.<section>`) holds page copy only,
  validated by the section's schema. It is not a block engine: editors cannot add sections.
- **Post categories are data, not an enum.** News / Events / Blogs are rows in `postCategories`; editors add
  more under Shared → Lookups. The only thing code knows about a category is its `kind`
  (`news` · `article` · `event`): event kinds switch on the date/venue fields and the kind picks the
  structured-data type. Section fields that choose categories use `choice` with `dynamic: "postCategories"`.
- **Scheduling needs no cron.** Scheduled = `published` with a future `publishedAt`; public reads filter `publishedAt <= now()`.
- **Slugs** are shared by both languages and lock once an item has been live.
- **Calculator.** The website calculator is already connected to the CMS. The Calculator page owns
  *which* projects it offers (`compositions.calculator`, ordered ids) and the global setup
  (`pageSections` `calculator.setup`: horizon choices, default %, months, assumption code + date — admin only).
  Units carry their own price / rent / costs on the project; `project.investment` holds optional per-project
  overrides (null = use the default). `server/calculator/data.ts` assembles the inputs once for both the
  public read (`server/public/calculator.ts`, `unstable_cache`, tags `calculator` + `projects`) and the CMS preview,
  and both run the single formula in `lib/calculator.ts` (`computeEstimate`). Only published projects with a
  priced unit are offered. Leads recompute server-side from the same data and store a snapshot.
- **Rich text is sanitised on save** (`server/html.ts`), because the site will render it as HTML.
  Post bodies and the privacy policy use the full editor; every page *description* uses the basic one
  (bold, italic, lists, links) and is stored as HTML too. SEO meta descriptions stay plain text.

---

## 2. How the website gets its data

**One loader — and one GET endpoint — per page.** Each returns the whole page in a single response:

```jsonc
{
  "seo":  { "title", "description", "keywords", "canonical", "alternates", "image", "type", "jsonLd": [ { "@graph": [...] } ] },
  "site": { "brand", "logo", "contact": { phone, whatsapp, email, address, mapUrl }, "socials": [...], "footer": {...} },
  "page": { /* every section of that page, in one language, plain strings */ }
}
```

| Page | Endpoint | Loader (`server/public/pages.ts`) |
|---|---|---|
| Home | `GET /api/pages/home` | `getHomePage` |
| About | `GET /api/pages/about` | `getAboutPage` |
| Projects | `GET /api/pages/projects?page=&limit=` | `getProjectsPage` |
| Project | `GET /api/pages/projects/<slug>` | `getProjectPage` |
| Media Center | `GET /api/pages/media[/<category>]?page=&limit=` | `getMediaPage` |
| Post | `GET /api/pages/media/<category>/<slug>` | `getPostPage` |
| Careers | `GET /api/pages/careers` | `getCareersPage` |
| Job | `GET /api/pages/careers/<slug>` | `getJobPage` |
| Contact | `GET /api/pages/contact` | `getContactPage` |
| Calculator | `GET /api/pages/calculator` | `getCalculatorPage` |
| Privacy | `GET /api/pages/privacy` | `getPrivacyPage` |

All take `?locale=en|ar`. The route (`app/api/pages/[...path]/route.ts`) is a thin switch over the loaders; the
server components and `generateMetadata` call the **same loaders directly** — a Next.js app should not make an
HTTP request to itself — so the endpoint and the rendered page can never disagree.

- **SEO is generated, not typed.** `server/public/seo.ts` builds title / description / keywords / canonical /
  hreflang / Open Graph from the editor's SEO tab (falling back to the content), plus one JSON-LD `@graph`
  per page: `Organization`, `WebSite`, `WebPage`, `BreadcrumbList`, and per page type `AboutPage`,
  `ContactPage`, `CollectionPage` + `ItemList`, `RealEstateListing` + `Place`, `NewsArticle` / `BlogPosting` /
  `Event` (by the post category's kind), `JobPosting`, `FAQPage`, `WebApplication`. `toMetadata()` turns the
  payload's `seo` into Next metadata; `<PageSeoScripts>` renders the JSON-LD.
- **Site data** (contact, socials, footer) is in every payload. The layout — which can't receive a page's
  payload — reads the same data through `getSite()` for the nav and footer.
- **Localisation happens at this boundary.** `loadSections()` walks a page's field definitions and turns every
  `{ en, ar }` into one string; entities go through small DTO mappers. Components receive plain strings and the
  types in `lib/content.ts`; nothing in the website knows about MongoDB or language pairs.
- **Caching.** Loaders are wrapped in `unstable_cache` (shared across requests) + React `cache` (shared between
  `generateMetadata` and the page). Tags match what the CMS actions emit (`page:<key>`, `projects`, `posts`,
  `jobs`, `faqs`, `partners`, `calculator`); actions call `revalidateTag(tag, { expire: 0 })`, so the very next
  request after a save is fresh. Payloads must stay JSON-safe (ISO strings, no `Date`).
- **Published-only.** Projects `status = published`, posts `published` with `publishedAt <= now`, jobs `open`,
  FAQs `published`. Detail loaders return `null` otherwise → the page 404s.
- **Rich text** (`<RichText>`) renders descriptions and article bodies; `<Gold>` renders the `<gold>…</gold>` +
  line-break convention headings use. Post bodies get ids on their `<h2>`s server-side for the table of contents.
- **Seed data** lives in `scripts/seed-data/*.ts` (old hardcoded content) and is only read by `scripts/seed.mts`.

### Forms (the only unauthenticated writes) — `server/inbox/public.ts`
| Form | Server function | Lands in |
|---|---|---|
| Contact page | `submitContactLead` | Inbox → Leads (`source: contact`, optional unit type) |
| Calculator "request a tailored illustration" | `submitCalculatorLead` | Inbox → Leads (`source: calculator`, project + a snapshot recomputed server-side) |
| Footer newsletter | `subscribeNewsletter` | Inbox → Subscribers (upsert — subscribing twice is a success and never reveals membership) |
| Job page "Apply" | `signCvUpload` → browser PUTs the CV to R2 → `submitApplication` | Inbox → Job applications (status, one-minute signed CV download, delete removes the file too) |

CV flow: the upload link is for one server-chosen key, with type (PDF/DOC/DOCX) and size (≤ 5 MB) inside the signature; the
browser gets an HMAC token for that key, so an applicant can only attach the file they uploaded; on submit the server
re-reads the stored object (exists, size, type) and checks the job is still open before writing anything.

Every one: zod validation, a hidden honeypot field, and a per-IP budget of 5 per 10 minutes
(`server/rate-limit.ts`: counters in the `rateLimits` collection, expired by a TTL index). Ids coming from the
visitor (unit type, project) are only stored if they resolve.

### Sitemap and robots
`app/sitemap.ts` is generated from the CMS (static pages, published projects, categories that have a live post,
live posts, open jobs) × both languages with hreflang alternates; `app/robots.ts` allows everything except
`/admin` and `/api/`. Both use `NEXT_PUBLIC_SITE_URL`.

### Security model (what the code enforces)
- **Auth.** scrypt N=2^17 with the cost stored in the hash (older hashes verify and are upgraded on login). Sessions are
  hashed in the DB; cookie is `__Host-session` (httpOnly, Secure, SameSite=Lax) in production. Login is *throttled*, not
  locked (per IP, per email+IP, per email) so nobody can lock the admin out, and the message never reveals whether an
  account exists. Changing your own password needs the current one and signs out every other session.
- **Authorisation** lives inside every action/query (`defineAction`, `requireUser`, `requireAdmin` → 404 for editors).
  Calculator figures (unit prices, per-project overrides) are admin-only **on the server** — an editor's values are ignored.
- **Audit log** (`server/audit.ts`, Admin → Audit log, kept 400 days): sign-ins, failed sign-ins, user changes, admin-only
  sections, calculator figures (before → after), deletions, every CV download.
- **HTML.** Only fields of kind `rich` are ever rendered as HTML; they are sanitised on save **and again on read**
  (`server/public/core.ts`). Plain-text props stay text (`HomeHero.description` vs `descriptionHtml`).
- **URLs.** Links: `https://`, `mailto:`, `tel:` only (`safeUrl`). Media: a site path or `https://`, no quotes/parens;
  on the way out `media()` drops any host the site isn't configured to show, so one bad link can't crash `next/image`.
- **Public endpoints.** Loader arguments are normalised before they become cache keys (locale, page 1–500, page size from a
  fixed list, slug-shaped strings only) — malformed input answers "not found" with no query and no cache entry.
- **Rate limiting** trusts only platform-set IP headers (`x-vercel-forwarded-for`, `x-real-ip`); otherwise all visitors
  share one bucket (fails closed).
- **Uploads.** CVs: link for one server-chosen key in `cv/tmp/`, token signed with `APP_SECRET`; on submit the server checks
  size, type and the file's first bytes, moves it to `cv/<year>/`, and rejects + deletes anything else. Abandoned uploads are
  swept after a day; a site-wide hourly cap limits how many links can be issued.
- **Headers** (`next.config.ts`): CSP (no foreign scripts, `frame-ancestors 'none'`, uploads only to R2), X-Frame-Options,
  nosniff, Referrer-Policy, Permissions-Policy, HSTS, COOP; no `x-powered-by`; `/admin` is `no-store` + `noindex`.
- **Seed.** `--force` refuses to wipe a non-local database without `--yes-wipe-remote-database`.

### Needs you (can't be done from code)
- **Rotate the R2 API token**, and **change the default admin password** (Account → Change password).
- **`APP_SECRET`** (≥ 32 random characters) must be set in Vercel — CV uploads fail without it.
- **Private bucket for CVs** → `CLOUDFLARE_PRIVATE_BUCKET_NAME` (+ the same CORS). Until then CVs sit in the public media bucket.
- **Separate dev database and bucket** — `.env.local` currently points at the production cluster.
- **Atlas:** a DB user limited to `readWrite` on `margins`; network access is necessarily `0.0.0.0/0` for Vercel.
- Optional: TOTP for admins, an IP allowlist / Vercel protection on `/admin`, Turnstile on the public forms.

### Still to do
- **Create a private bucket for CVs** and set `CLOUDFLARE_PRIVATE_BUCKET_NAME` (its CORS must allow `PUT` from the site's origins, like the media bucket). Until then CVs are stored in the media bucket under `cv/` with 256-bit random keys — never linked publicly and blocked by `/files`, but that bucket has public access enabled.
- Draft preview (`draftMode`) from the CMS forms.
- Production: MongoDB Atlas (`MONGODB_URI`), the `CLOUDFLARE_*` variables and `NEXT_PUBLIC_SITE_URL` in Vercel;
  R2 CORS must allow the production origin.
