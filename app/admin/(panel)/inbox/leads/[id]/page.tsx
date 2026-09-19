import { notFound } from "next/navigation";
import PageShell, { SectionCard } from "@/components/cms/page-shell";
import { ActionButton } from "@/components/cms/row-actions";
import { requireUser } from "@/server/auth/session";
import { getLead } from "@/server/inbox/queries";
import { archiveLead, deleteLead } from "@/server/inbox/actions";
import { formatDateTime } from "@/lib/dates";

export const metadata = { title: "Lead" };

// { estimate: { roiPct: 57.7 } } → ["estimate · roiPct", "57.7"]; numbers rounded for reading
function flatten(value: unknown, prefix = ""): [string, string][] {
  if (value === null || typeof value !== "object") {
    const text = typeof value === "number" ? String(Math.round(value * 100) / 100) : String(value ?? "—");
    return [[prefix, text]];
  }
  return Object.entries(value).flatMap(([key, child]) => flatten(child, prefix ? `${prefix} · ${key}` : key));
}

export default async function LeadPage({ params }: PageProps<"/admin/inbox/leads/[id]">) {
  const { id } = await params;
  const [user, row] = await Promise.all([requireUser(), getLead(id).catch(() => undefined)]);
  if (!row) notFound();
  const { lead, project, unitType } = row;
  const archived = Boolean(lead.archivedAt);

  const facts: [string, string | null | undefined][] = [
    ["Email", lead.email], ["Phone", lead.phone], ["Source", lead.source], ["Language", lead.locale.toUpperCase()],
    ["Project", project?.en], ["Unit type", unitType?.en], ["Received", formatDateTime(lead.createdAt)],
  ];

  return (
    <PageShell
      eyebrow="Leads"
      title={lead.name}
      back={{ href: "/admin/inbox/leads", label: "All leads" }}
      actions={
        <>
          <ActionButton action={archiveLead.bind(null, { id: lead.id, archived: !archived })} success={archived ? "Moved to inbox" : "Archived"}>
            {archived ? "Move to inbox" : "Archive"}
          </ActionButton>
          {user.role === "admin" && (
            <ActionButton action={deleteLead.bind(null, lead.id)} confirm="Permanently delete this lead?" redirectTo="/admin/inbox/leads" variant="ghost" className="text-destructive">
              Delete
            </ActionButton>
          )}
        </>
      }
    >
      <SectionCard>
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {facts.filter(([, value]) => value).map(([label, value]) => (
            <div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="text-sm font-medium break-words">{value}</dd></div>
          ))}
        </dl>
        {lead.message && <p dir="auto" className="rounded-lg bg-muted p-4 text-sm leading-6 whitespace-pre-wrap">{lead.message}</p>}
      </SectionCard>

      {lead.snapshot != null && (
        <SectionCard title="Calculator snapshot" hint="Exactly what this visitor was shown — assumption code, inputs and results at the time.">
          <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {flatten(lead.snapshot).map(([label, value]) => (
              <div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="text-sm font-medium tabular-nums break-words">{value}</dd></div>
            ))}
          </dl>
        </SectionCard>
      )}
    </PageShell>
  );
}
