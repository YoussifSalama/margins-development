import Link from "next/link";
import PageShell, { SectionCard } from "@/components/cms/page-shell";
import { TourButton } from "@/components/cms/tour";
import { requireUser } from "@/server/auth/session";
import { cmsNav } from "@/components/cms/nav";

export const metadata = { title: "Guide" };

// Flip to true (and delete the banner below) when docs/CMS.md part 2 is done.
const SITE_CONNECTED = true;

const ideas: [string, string][] = [
  ["Content is written once", "A project, post, job, FAQ or partner lives in one place under Content. The website reuses it everywhere it is needed — the Projects page, the project's own page, the Home showcase and the calculator all read the same project. You never edit the same thing twice."],
  ["Pages choose, they don't copy", "Under Pages you edit each page's own wording and pictures. When a page shows content — Home's projects, a listing's first post — it only picks from what already exists. Deleting or unpublishing the original removes it from those pages automatically."],
  ["Always two languages", "Every text box has English on the left and Arabic on the right. You can save a draft half-finished, but you can't publish until the required fields are filled in both languages. Web addresses, numbers, dates and pictures are shared by both languages."],
  ["Draft → Published → Archived", "New items start as a Draft, visible only here. Published puts them on the website. Archived takes them off again without deleting anything. For posts, a publish date in the future means Scheduled: it goes live by itself at that time."],
  ["Web addresses lock", "The slug (the end of the web address) fills itself from the English title. Once an item has been live it locks, so links people already shared — and Google — keep working."],
  ["Every page and item has SEO", "The SEO tab holds the title, description and keywords for search engines in both languages, plus the picture used when the link is shared. Leave it empty and sensible defaults are used. The technical markup for Google is generated for you."],
  ["Pictures and files", "Click Upload to send a file, or paste a link. Large pictures are fine up to 10 MB, videos up to 60 MB (MP4)."],
  ["Admins and editors", "Editors manage content, pages and the inbox. Admins can also manage users, site settings, the calculator's setup (destinations, horizons, default assumptions) and its legal disclaimer, and can delete inbox items."],
];

const recipes: { id: string; title: string; steps: string[]; note?: string }[] = [
  {
    id: "add-project",
    title: "Add a project",
    steps: [
      "Content → Projects → New project.",
      "Overview tab: name (both languages), click into URL slug to fill it, then location, facts, summary, description and a cover image.",
      "Story tab: add blocks — a heading, text and a column of pictures each. Use the arrows to reorder.",
      "Location & amenities tab: description, address, nearby places (choose the tab each belongs to) and tick the facilities.",
      "Units tab: add one row per unit type with its size range and picture.",
      "Set Status to Published and press Save. If something is missing the field turns red — check every tab.",
    ],
    note: "Unit types and amenities come from Shared → Lookups. Add a missing one there first.",
  },
  {
    id: "home-showcase",
    title: "Choose which projects Home shows",
    steps: ["Pages → Home → Projects showcase.", "Use “Add a project…” to pick from existing projects, and the arrows to order them.", "Press Save showcase."],
    note: "A picked project that is still a Draft is skipped on the website until you publish it.",
  },
  {
    id: "calculator",
    title: "Set up the investment calculator",
    steps: [
      "On each project: Content → Projects → open it → Units & calculator tab. Give every unit a size range, an average price, a yearly rent and yearly running costs. The gross yield visitors will see appears under the unit as you type.",
      "Still on that tab, the Investment calculator box is optional: fill a percentage or month only if this project differs from the defaults, and add a phase label.",
      "Make sure the project is Published, then Save.",
      "Admins: Pages → Calculator → Calculator setup. Set the horizon choices, the pre-selected horizon, the default percentages and months, and the assumption code and date. Save section.",
      "Under Destinations, pick the projects the calculator offers and order them. Save destinations.",
      "Check the Preview at the bottom: it lists every project and unit with the figures visitors will get, and flags anything not ready (a draft project, a unit without a price).",
    ],
    note: "Whenever you change a number — a default, an override or a unit price — also change the assumption code and date in Calculator setup. Every calculator lead records the code and the exact figures the visitor saw. “How each figure is calculated” under the preview explains every formula.",
  },
  {
    id: "post",
    title: "Publish or schedule a post (news, event, blog…)",
    steps: [
      "Content → Posts → New post. Choose the Category first — it decides which Media Center tab the post appears under.",
      "Write the title, click into URL slug, add the excerpt and the body. Use the Heading button for sections: they become the table of contents.",
      "Event categories only: open the Event details tab and enter the start date and venue.",
      "Media tab: add the cover image (required to publish) and any gallery pictures.",
      "Status → Published. Leave Publish date empty to go live now, or pick a future date to schedule it. Save.",
    ],
  },
  {
    id: "main-item",
    title: "Pin the first (main) item of the Media Center",
    steps: ["Pages → Media Center → Main item.", "Choose a published post, or leave it on “Automatic — latest published”.", "Press Save main item."],
    note: "The main item always appears first on page 1. When a visitor filters by category it stays first only if it belongs to that category. If the pinned post is later unpublished or deleted, the latest post takes its place by itself.",
  },
  {
    id: "category",
    title: "Add a new kind of post (a Media Center tab)",
    steps: [
      "Shared → Lookups → Post categories → Add category.",
      "Enter the name in both languages, a key (it appears in the web address) and the kind. Choose Event if its posts need a date and venue.",
      "Use the arrows to set the tab order. The new category is now available in the post form and in Home → News feed.",
    ],
    note: "A category can't be deleted while posts still use it — move those posts to another category first.",
  },
  {
    id: "job",
    title: "Open a job and review applications",
    steps: [
      "Content → Jobs → New job. Fill in Details and Description, set Status to Open, Save.",
      "Perks, working hours and the closing note are shared by all jobs: Pages → Careers → Shared job info.",
      "Visitors apply on the job page itself (name, email, phone, cover note and a CV as PDF / DOC / DOCX up to 5 MB). Applications arrive in Inbox → Job applications — also reachable from the number in the Jobs list. Download the CV (the link works for one minute) and set the status as you go.",
      "When the role is filled, set the job's Status to Closed.",
    ],
  },
  {
    id: "page-copy",
    title: "Change the wording or pictures of a page",
    steps: ["Pages → pick the page → pick the part (tab).", "Edit, then press Save section before moving to another tab.", "Use “View on site” to check the result."],
    note: "To highlight words in gold in a heading, wrap them like this: <gold>these words</gold>.",
  },
  {
    id: "settings",
    title: "Update the phone number, address or social links (admins)",
    steps: ["Shared → Site settings → Contact details or Social links.", "Edit and press Save section. The footer, Contact page and search-engine data all update together."],
  },
  {
    id: "faq-partner",
    title: "Add an FAQ or a partner",
    steps: ["Content → FAQs (or Partners) → Add.", "Fill in both languages and Save.", "Use the arrows to set the order. It is the same order on the website."],
  },
  {
    id: "leads",
    title: "Handle messages from the website",
    steps: ["Inbox → Leads. Unread messages are bold.", "Open one to read it — calculator requests also show exactly what the visitor was shown.", "Press Archive when it has been dealt with. Archived leads stay under the Archived view."],
  },
  {
    id: "users",
    title: "Add a colleague or reset a password (admins)",
    steps: ["Admin → Users → Add user. Choose Editor unless they need to manage users, settings or calculator figures.", "To reset a password, edit the user and type a new one — they are signed out everywhere.", "To change your own password, click your name at the bottom of the sidebar."],
  },
];

const problems: [string, string][] = [
  ["I can't publish — a field is red", "Publishing needs the required text in both English and Arabic, and a cover image. Check every tab: the red field may be on a tab you're not looking at."],
  ["I published it but can't find it on the website", "Check the badge: Scheduled means it is waiting for its publish date. For a project on Home, check it is picked in Pages → Home → Projects showcase. For the calculator, the project must be published, picked under Pages → Calculator → Calculator setup, and have a unit with a price and a rent — the preview there shows what is missing."],
  ["The URL slug is greyed out", "The page has been live, so its address is locked to keep existing links working. Create a new item if you truly need a different address."],
  ["“This unit type is used by a project”", "A lookup can't be deleted while a project still uses it. Remove it from the project's Units tab first."],
  ["“Too many attempts” when signing in", "Five wrong passwords lock the account for 15 minutes. An admin can reset your password to unlock it straight away."],
  ["Upload fails", "Check the file type (JPG, PNG, WebP, AVIF, MP4 or PDF) and size. If every upload fails, file storage may not be set up yet — you can paste a picture link instead."],
];

export default async function GuidePage() {
  const user = await requireUser();
  const areas = cmsNav.filter((group) => group.label !== "Help" && (user.role === "admin" || group.items.some((item) => !item.adminOnly)));

  return (
    <PageShell
      eyebrow="Help"
      title="Guide"
      description="How the CMS works, what every area is for, and step-by-step instructions for common tasks."
      actions={<TourButton tour="shell" label="Replay the welcome tour" />}
    >
      {!SITE_CONNECTED && (
        <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Heads-up:</strong> the public website is not reading from the CMS yet, so what you publish here won&apos;t change the live site until that connection is switched on. You can safely prepare all content in the meantime.
        </p>
      )}

      <nav className="flex flex-wrap gap-2 text-sm">
        {[["#ideas", "How it works"], ["#areas", "What each area does"], ["#howto", "How do I…"], ["#problems", "Something's not working"]].map(([href, label]) => (
          <a key={href} href={href} className="rounded-full border bg-card px-3 py-1.5 font-medium hover:bg-muted">{label}</a>
        ))}
      </nav>

      <section id="ideas" className="scroll-mt-6">
        <SectionCard title="How it works" hint="Eight ideas explain almost everything in the CMS.">
          <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
            {ideas.map(([title, text], index) => (
              <div key={title}>
                <p className="text-sm font-semibold"><span className="me-2 text-gold">{index + 1}</span>{title}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      <section id="areas" className="scroll-mt-6">
        <SectionCard title="What each area does" hint="The same groups as the sidebar. Click a name to go there.">
          {areas.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">{group.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
              <dl className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                {group.items.filter((item) => user.role === "admin" || !item.adminOnly).map((item) => (
                  <div key={item.href} className="rounded-lg border bg-background p-3">
                    <dt><Link href={item.href} className="flex items-center gap-2 text-sm font-semibold hover:underline"><item.icon className="size-4 text-gold" />{item.label}</Link></dt>
                    <dd className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </SectionCard>
      </section>

      <section id="howto" className="scroll-mt-6">
        <SectionCard title="How do I…" hint="Click a task to open its steps.">
          <div className="flex flex-col divide-y">
            {recipes.map((recipe) => (
              <details key={recipe.id} id={recipe.id} className="group py-3">
                <summary className="cursor-pointer list-none text-sm font-semibold marker:hidden hover:text-gold">
                  <span className="me-2 inline-block transition-transform group-open:rotate-90">›</span>
                  {recipe.title}
                </summary>
                <ol className="mt-3 list-decimal space-y-1.5 ps-9 text-sm leading-6 text-muted-foreground">
                  {recipe.steps.map((step) => <li key={step}>{step}</li>)}
                </ol>
                {recipe.note && <p className="mt-3 ms-5 rounded-md bg-muted px-3 py-2 text-sm leading-6">{recipe.note}</p>}
              </details>
            ))}
          </div>
        </SectionCard>
      </section>

      <section id="problems" className="scroll-mt-6">
        <SectionCard title="Something's not working">
          <dl className="flex flex-col gap-4">
            {problems.map(([question, answer]) => (
              <div key={question}>
                <dt className="text-sm font-semibold">{question}</dt>
                <dd className="mt-1 text-sm leading-6 text-muted-foreground">{answer}</dd>
              </div>
            ))}
          </dl>
        </SectionCard>
      </section>
    </PageShell>
  );
}
