import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";
import { SectionCard } from "@/components/cms/page-shell";

// One card per block of the public website. `shot` is /public/guide/<shot>.jpg (a screenshot of that
// block on the live site). `edit` lists where it is controlled from. Retake the screenshots when the design changes.
type Edit = [label: string, href: string];
type Block = { shot: string; title: string; edit: Edit[]; note?: string };
type Page = { label: string; url: string; intro?: string; blocks: Block[] };

const pages: Page[] = [
  {
    label: "Home", url: "/",
    blocks: [
      { shot: "home-hero", title: "Top banner", edit: [["Pages → Home → Hero", "/admin/pages/home/hero"]], note: "Title, subtitle and the background picture or video." },
      { shot: "home-partners", title: "Scrolling partner logos", edit: [["Content → Partners", "/admin/content/partners"]] },
      { shot: "home-about", title: "About text and numbers", edit: [["Pages → Home → About & stats", "/admin/pages/home/about"]] },
      { shot: "home-showcase", title: "Projects showcase", edit: [["Pages → Home → Projects showcase", "/admin/pages/home/showcase"], ["Content → Projects", "/admin/content/projects"]], note: "Pick which projects appear here. The projects themselves are edited under Content." },
      { shot: "home-approach", title: "Our approach cards", edit: [["Pages → Home → Approach", "/admin/pages/home/approach"]] },
      { shot: "home-feed", title: "Latest news", edit: [["Pages → Home → News feed", "/admin/pages/home/feed"], ["Content → Posts", "/admin/content/posts"]], note: "Choose the categories to show. The posts come from Content → Posts." },
      { shot: "home-faq", title: "Questions", edit: [["Pages → Home → FAQ heading", "/admin/pages/home/faq"], ["Content → FAQs", "/admin/content/faqs"]], note: "Heading here, the questions themselves under Content → FAQs." },
      { shot: "home-footer", title: "Footer (every page)", edit: [["Shared → Site settings", "/admin/shared/settings"]], note: "Address, social links. Admins only." },
    ],
  },
  {
    label: "About", url: "/about",
    blocks: [
      { shot: "about-hero", title: "Top banner", edit: [["Pages → About → Hero", "/admin/pages/about/hero"]] },
      { shot: "about-whoWeAre", title: "Who we are", edit: [["Pages → About → Who we are", "/admin/pages/about/whoWeAre"]] },
      { shot: "about-stats", title: "Stat cards", edit: [["Pages → About → Stats", "/admin/pages/about/stats"]] },
      { shot: "about-statement", title: "Statement", edit: [["Pages → About → Statement", "/admin/pages/about/statement"]] },
      { shot: "about-chairman", title: "Message from the chairman", edit: [["Pages → About → Chairman", "/admin/pages/about/chairman"]] },
    ],
  },
  {
    label: "Projects", url: "/projects",
    blocks: [
      { shot: "projects-hero", title: "Top banner", edit: [["Pages → Projects page → Hero", "/admin/pages/projects/hero"]] },
      { shot: "projects-list", title: "Project cards", edit: [["Content → Projects", "/admin/content/projects"]], note: "Add, edit, publish or reorder projects here. Each card opens the project's own page." },
      { shot: "projects-vision", title: "Vision, mission and values", edit: [["Shared → Company", "/admin/shared/company"]] },
    ],
  },
  {
    label: "Media Center", url: "/media",
    blocks: [
      { shot: "media-hero", title: "Top banner", edit: [["Pages → Media Center → Hero", "/admin/pages/media/hero"]] },
      { shot: "media-main", title: "Main (first) item", edit: [["Pages → Media Center → Main item", "/admin/pages/media/main"]] },
      { shot: "media-posts", title: "Posts list and category tabs", edit: [["Content → Posts", "/admin/content/posts"], ["Shared → Lookups (categories)", "/admin/shared/lookups"]] },
    ],
  },
  {
    label: "Careers", url: "/careers",
    blocks: [
      { shot: "careers-hero", title: "Top banner", edit: [["Pages → Careers → Hero", "/admin/pages/careers/hero"]] },
      { shot: "careers-discover", title: "Intro and photo collage", edit: [["Pages → Careers → Discover", "/admin/pages/careers/discover"]] },
      { shot: "careers-hiring", title: "Open jobs", edit: [["Pages → Careers → Hiring heading", "/admin/pages/careers/hiring"], ["Content → Jobs", "/admin/content/jobs"]], note: "Applications arrive in Inbox → Job applications." },
      { shot: "careers-values", title: "Our values", edit: [["Pages → Careers → Values", "/admin/pages/careers/values"]] },
    ],
  },
  {
    label: "Contact", url: "/contact",
    blocks: [
      { shot: "contact-hero", title: "Top banner", edit: [["Pages → Contact → Hero", "/admin/pages/contact/hero"]] },
      { shot: "contact-form", title: "Contact form and details", edit: [["Pages → Contact → Form", "/admin/pages/contact/form"], ["Shared → Site settings", "/admin/shared/settings"]], note: "Messages sent from this form arrive in Inbox → Leads." },
    ],
  },
  {
    label: "Calculator", url: "/calculator",
    blocks: [
      { shot: "calculator-intro", title: "Intro", edit: [["Pages → Calculator → Intro", "/admin/pages/calculator/intro"]] },
      { shot: "calculator-setup", title: "Destinations and figures", edit: [["Pages → Calculator → Calculator setup", "/admin/pages/calculator/setup"], ["Content → Projects (units & prices)", "/admin/content/projects"]], note: "Admins only. See “Set up the investment calculator” below." },
    ],
  },
  {
    label: "Single project", url: "/projects/lusail-residence",
    intro: "Every project has its own page with this same layout. Open a project under Content → Projects; the tab named on each card holds that block.",
    blocks: [
      { shot: "project-hero", title: "Top banner and key facts", edit: [["Projects → open one → Overview tab", "/admin/content/projects"]], note: "Name, location, summary and cover image." },
      { shot: "project-intro", title: "Intro and description", edit: [["Projects → open one → Overview tab", "/admin/content/projects"]] },
      { shot: "project-story", title: "Story blocks", edit: [["Projects → open one → Story tab", "/admin/content/projects"]], note: "Headings, text and picture columns. Use the arrows to reorder." },
      { shot: "project-location", title: "Location and facilities", edit: [["Projects → open one → Location & amenities tab", "/admin/content/projects"], ["Shared → Lookups (amenities)", "/admin/shared/lookups"]] },
      { shot: "project-units", title: "Unit types", edit: [["Projects → open one → Units & calculator tab", "/admin/content/projects"], ["Shared → Lookups (unit types)", "/admin/shared/lookups"]] },
      { shot: "project-faq", title: "Questions", edit: [["Content → FAQs", "/admin/content/faqs"]], note: "The same list is shown on Home and on every project page." },
    ],
  },
  {
    label: "Single post", url: "/media/news/sheraton-residences-launch",
    intro: "News, events and blogs all use this page. Open a post under Content → Posts; the tab named on each card holds that block.",
    blocks: [
      { shot: "post-hero", title: "Title, date and cover", edit: [["Posts → open one → Content tab", "/admin/content/posts"], ["Posts → open one → Media tab", "/admin/content/posts"]], note: "Cover image is required to publish." },
      { shot: "post-body", title: "Article body", edit: [["Posts → open one → Content tab", "/admin/content/posts"]], note: "Headings you add become the table of contents." },
      { shot: "post-event", title: "Event posts: date and venue", edit: [["Posts → open an event → Event details tab", "/admin/content/posts"]], note: "Only categories of kind Event have this tab." },
      { shot: "post-related", title: "Related posts", edit: [], note: "Automatic: the newest published posts. Nothing to edit." },
    ],
  },
  {
    label: "Single job", url: "/careers/sales-manager",
    intro: "Every job has its own page. Open a job under Content → Jobs.",
    blocks: [
      { shot: "job-hero", title: "Job title and summary", edit: [["Jobs → open one → Details", "/admin/content/jobs"]] },
      { shot: "job-details", title: "Description and requirements", edit: [["Jobs → open one → Description", "/admin/content/jobs"]] },
      { shot: "job-perks", title: "Perks, hours and closing note", edit: [["Pages → Careers → Shared job info", "/admin/pages/careers/jobInfo"]], note: "Written once and shown on every job." },
      { shot: "job-apply", title: "Application form", edit: [["Inbox → Job applications", "/admin/inbox/applications"]], note: "The form is automatic. Applications and CVs arrive in the inbox." },
    ],
  },
];

export default function SiteMap({ siteUrl }: { siteUrl: string }) {
  return (
    <SectionCard title="Find it on the website" hint="Each picture is a block of the real website. Click an orange button to open the screen that controls it.">
      <nav className="flex flex-wrap gap-2 text-sm">
        {pages.map((page) => (
          <a key={page.url} href={`#site-${page.label.replace(/ /g, "-")}`} className="rounded-full border bg-background px-3 py-1 font-medium hover:bg-muted">{page.label}</a>
        ))}
      </nav>
      {pages.map((page) => (
        <div key={page.url} id={`site-${page.label.replace(/ /g, "-")}`} className="scroll-mt-6">
          <div className="flex items-center justify-between gap-3 border-b pb-2">
            <p className="text-sm font-semibold">{page.label} page</p>
            <a href={siteUrl + page.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:underline">
              Open on website <ExternalLink className="size-3" />
            </a>
          </div>
          {page.intro && <p className="mt-3 text-sm leading-6 text-muted-foreground">{page.intro}</p>}
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {page.blocks.map((block) => (
              <figure key={block.shot} className="flex flex-col overflow-hidden rounded-lg border bg-background">
                <Image src={`/guide/${block.shot}.jpg`} alt={`${page.label}: ${block.title}`} width={1280} height={720} className="aspect-video w-full border-b object-cover object-top" />
                <figcaption className="flex flex-1 flex-col gap-2 p-3">
                  <p className="text-sm font-semibold">{block.title}</p>
                  {block.note && <p className="text-sm leading-6 text-muted-foreground">{block.note}</p>}
                  <div className="mt-auto flex flex-wrap gap-2 pt-1">
                    {block.edit.length === 0 && <span className="text-xs font-medium text-muted-foreground">Automatic</span>}
                    {block.edit.map(([label, href]) => (
                      <Link key={href} href={href} className="inline-flex items-center gap-1.5 rounded-md bg-gold/15 px-2.5 py-1.5 text-xs font-medium hover:bg-gold/30">
                        <Pencil className="size-3" />{label}
                      </Link>
                    ))}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ))}
    </SectionCard>
  );
}
