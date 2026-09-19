import Link from "next/link";
import { requireUser } from "@/server/auth/session";
import { db } from "@/server/db";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourButton } from "@/components/cms/tour";

export const metadata = { title: "Overview" };

export default async function AdminHome() {
  const user = await requireUser();

  const [projects, posts, jobs, leads, applications] = await Promise.all([
    db.projects.countDocuments(),
    db.posts.countDocuments(),
    db.jobs.countDocuments({ status: "open" }),
    db.leads.countDocuments({ readAt: null, archivedAt: null }),
    db.jobApplications.countDocuments({ status: "new" }),
  ]);

  const tiles = [
    { label: "Projects", value: projects, href: "/admin/content/projects" },
    { label: "Posts", value: posts, href: "/admin/content/posts" },
    { label: "Open jobs", value: jobs, href: "/admin/content/jobs" },
    { label: "Unread leads", value: leads, href: "/admin/inbox/leads" },
    { label: "New applications", value: applications, href: "/admin/inbox/applications" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">Overview</p>
        <h1 className="mt-1 text-2xl font-bold">Welcome back, {user.name.split(" ")[0]}</h1>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {tiles.map((tile) => (
          <Link key={tile.label} href={tile.href} className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-md">
            <p className="text-3xl font-bold tabular-nums">{tile.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{tile.label}</p>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-6">
        <div>
          <p className="font-semibold">New here?</p>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Take the one-minute tour of the CMS, or read the guide for step-by-step instructions. Every screen also has its own “Tour this page” button, and every field has a small ? to hover.
          </p>
        </div>
        <div className="flex gap-2">
          <TourButton tour="shell" label="Take the tour" />
          <Button asChild size="sm"><Link href="/admin/guide"><BookOpen className="size-4" />Open the guide</Link></Button>
        </div>
      </div>
    </div>
  );
}
