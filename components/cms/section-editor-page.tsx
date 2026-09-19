import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { withDefaults } from "@/lib/cms/fields";
import { pageDefs } from "@/lib/cms/pages";
import { requireUser } from "@/server/auth/session";
import { getCalculatorSelection, getHomeShowcase, getMainPost, getSectionData } from "@/server/pages/queries";
import { listProjectOptions } from "@/server/projects/queries";
import { listPostCategories } from "@/server/posts/queries";
import { formatDateTime } from "@/lib/dates";
import PageShell from "./page-shell";
import SectionForm from "./section-form";
import { CalculatorDestinationsPicker, MainPostPicker, ShowcasePicker } from "./relation-editors";
import CalculatorPreview from "./calculator-preview";
import { Explain } from "./help-hint";

const base = (group: "pages" | "shared", page: string) => `/admin/${group}/${page}`;

/** Shared by /admin/pages/* and /admin/shared/*: section tabs + one form per section. */
export default async function SectionEditorPage({ group, page, section }: { group: "pages" | "shared"; page: string; section?: string }) {
  const def = pageDefs[page];
  if (!def || def.group !== group) notFound();
  if (!section) redirect(`${base(group, page)}/${Object.keys(def.sections)[0]}`);
  const sectionDef = def.sections[section];
  if (!sectionDef) notFound();

  const [user, stored] = await Promise.all([requireUser(), getSectionData(page, section)]);
  const needsCategories = sectionDef.fields.some((field) => field.kind === "choice" && field.dynamic === "postCategories");
  const dynamic = needsCategories ? { postCategories: (await listPostCategories()).map((c) => ({ value: c.id, label: c.name.en })) } : {};

  return (
    <PageShell
      tour="section"
      eyebrow={group === "pages" ? "Pages" : "Shared"}
      title={def.label}
      description={def.description}
      back={group === "pages" ? { href: "/admin/pages", label: "All pages" } : undefined}
      actions={
        def.path && (
          <Link href={def.path} target="_blank" data-tour="view-site" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            View on site <ExternalLink className="size-3.5" />
          </Link>
        )
      }
    >
      <nav data-tour="section-tabs" className="flex flex-wrap gap-1 rounded-lg border bg-card p-1">
        {Object.entries(def.sections).map(([key, item]) => (
          <Explain key={key} text={item.hint ?? `Edit the “${item.label}” part of ${def.label}. Each part is saved on its own.`} side="bottom">
          <Link
            href={`${base(group, page)}/${key}`}
            className={cn("rounded-md px-3 py-1.5 text-sm font-medium", key === section ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}
          >
            {item.label}
          </Link>
          </Explain>
        ))}
      </nav>

      {/* key: a fresh form per section, never stale values from the previous tab */}
      <SectionForm
        key={`${page}.${section}`}
        page={page}
        section={section}
        values={withDefaults(sectionDef.fields, stored?.data)}
        readOnly={sectionDef.adminOnly && user.role !== "admin"}
        dynamic={dynamic}
      />
      {sectionDef.fields.length === 0 && sectionDef.hint && <p className="text-sm text-muted-foreground">{sectionDef.hint}</p>}

      {sectionDef.relation === "homeShowcase" && <ShowcasePicker selected={await getHomeShowcase()} options={await listProjectOptions()} />}
      {sectionDef.relation === "mainPost" && <MainPost />}
      {sectionDef.relation === "calculatorDestinations" && <CalculatorDestinations isAdmin={user.role === "admin"} />}

      {stored && <p className="text-xs text-muted-foreground">Last saved {formatDateTime(stored.updatedAt)}</p>}
    </PageShell>
  );
}

async function CalculatorDestinations({ isAdmin }: { isAdmin: boolean }) {
  const [ids, options] = await Promise.all([getCalculatorSelection(), listProjectOptions()]);
  const selected = ids.flatMap((id) => options.filter((option) => option.id === id));
  return (
    <>
      {isAdmin && <CalculatorDestinationsPicker selected={selected} options={options} />}
      <CalculatorPreview />
    </>
  );
}

async function MainPost() {
  const { postId, options } = await getMainPost();
  return <MainPostPicker postId={postId} options={options} />;
}
