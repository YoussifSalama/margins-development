import Link from "next/link";
import PageShell from "@/components/cms/page-shell";
import { requireUser } from "@/server/auth/session";
import { pageDefs } from "@/lib/cms/pages";

export const metadata = { title: "Pages" };

export default async function PagesIndex() {
  await requireUser();
  const pages = Object.entries(pageDefs).filter(([, def]) => def.group === "pages");

  return (
    <PageShell
      eyebrow="Pages"
      title="Pages"
      description="Page-specific copy and composition. Anything reusable — projects, posts, jobs, FAQs, partners — is managed once under Content and referenced from here."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pages.map(([key, def]) => (
          <Link key={key} href={`/admin/pages/${key}`} className="flex flex-col gap-2 rounded-xl border bg-card p-5 transition-shadow hover:shadow-md">
            <p className="font-semibold">{def.label}</p>
            <p className="text-sm text-muted-foreground">{def.description}</p>
            <p className="mt-auto pt-2 text-xs text-muted-foreground">{Object.values(def.sections).map((section) => section.label).join(" · ")}</p>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
