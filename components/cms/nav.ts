import type { LucideIcon } from "lucide-react";
import {
  Building2, Newspaper, Briefcase, HelpCircle, Handshake, LayoutTemplate,
  Landmark, Settings, ListTree, Inbox, FileUser, MailPlus, Users, BookOpen, ScrollText,
} from "lucide-react";

export type NavItem = { label: string; href: string; icon: LucideIcon; description: string; adminOnly?: boolean };
export type NavGroup = { label: string; description: string; items: NavItem[] };

// Organised by management responsibility, not by the website's menu.
export const cmsNav: NavGroup[] = [
  {
    label: "Content",
    description: "The things the website is about. Each one is created once and reused on many pages.",
    items: [
      { label: "Projects", description: "Every development, with its story, location, units and calculator figures. The Projects page, project pages, Home showcase and calculator all read from here.", href: "/admin/content/projects", icon: Building2 },
      { label: "Posts", description: "Everything in the Media Center — news, events, blogs and any category you add. Write once, publish now or schedule for later.", href: "/admin/content/posts", icon: Newspaper },
      { label: "Jobs", description: "Open roles shown on the Careers page. Applications arrive in Inbox → Job applications.", href: "/admin/content/jobs", icon: Briefcase },
      { label: "FAQs", description: "One shared list of questions, shown on Home and on every project page.", href: "/admin/content/faqs", icon: HelpCircle },
      { label: "Partners", description: "The logos in the scrolling strip on Home and About.", href: "/admin/content/partners", icon: Handshake },
    ],
  },
  {
    label: "Pages",
    description: "How each page is worded and put together.",
    items: [{ label: "All pages", description: "The wording, pictures and SEO of each page — plus which projects Home shows and which post the Media Center pins first.", href: "/admin/pages", icon: LayoutTemplate }],
  },
  {
    label: "Shared",
    description: "Information used by several pages.",
    items: [
      { label: "Company", description: "Vision, mission and values. Written once, reused wherever the website shows them.", href: "/admin/shared/company", icon: Landmark },
      { label: "Site settings", description: "Phone, email, address, social links and the footer. Change here, updates everywhere.", href: "/admin/shared/settings", icon: Settings, adminOnly: true },
      { label: "Lookups", description: "The small shared lists other screens pick from: post categories, unit types and amenities.", href: "/admin/shared/lookups", icon: ListTree },
    ],
  },
  {
    label: "Inbox",
    description: "What visitors send through the website.",
    items: [
      { label: "Leads", description: "Messages from the contact form and requests sent from the calculator.", href: "/admin/inbox/leads", icon: Inbox },
      { label: "Job applications", description: "People who applied to a job, with their CV.", href: "/admin/inbox/applications", icon: FileUser },
      { label: "Subscribers", description: "Emails collected by the newsletter box in the footer.", href: "/admin/inbox/subscribers", icon: MailPlus },
    ],
  },
  {
    label: "Help",
    description: "Learn how the CMS works.",
    items: [{ label: "Guide", description: "What every area does and step-by-step instructions for common tasks.", href: "/admin/guide", icon: BookOpen }],
  },
  {
    label: "Admin",
    description: "Access to this CMS.",
    items: [
      { label: "Users", description: "Who can sign in to this CMS, and whether they are an admin or an editor.", href: "/admin/users", icon: Users, adminOnly: true },
      { label: "Audit log", description: "Who signed in, who changed users or calculator figures, what was deleted, and every CV download.", href: "/admin/audit", icon: ScrollText, adminOnly: true },
    ],
  },
];
