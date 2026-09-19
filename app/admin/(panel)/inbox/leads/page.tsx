import Link from "next/link";
import PageShell from "@/components/cms/page-shell";
import FilterTabs from "@/components/cms/filter-tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listLeads } from "@/server/inbox/queries";
import { formatDateTime } from "@/lib/dates";
import { cn } from "@/lib/utils";

export const metadata = { title: "Leads" };

export default async function LeadsPage({ searchParams }: PageProps<"/admin/inbox/leads">) {
  const view = (await searchParams).view === "archived" ? "archived" : "inbox";
  const leads = await listLeads(view);

  return (
    <PageShell tour="inbox" eyebrow="Inbox" title="Leads" description="Messages from the contact form and tailored-illustration requests from the calculator.">
      <FilterTabs basePath="/admin/inbox/leads" param="view" active={view === "archived" ? "archived" : undefined} options={[{ label: "Inbox" }, { value: "archived", label: "Archived" }]} />
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow><TableHead>From</TableHead><TableHead>Source</TableHead><TableHead>Project</TableHead><TableHead>Received</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 && <TableRow><TableCell colSpan={4} className="py-10 text-center text-muted-foreground">Nothing here.</TableCell></TableRow>}
            {leads.map((lead) => (
              <TableRow key={lead.id} className={cn(!lead.readAt && "font-semibold")}>
                <TableCell>
                  <Link href={`/admin/inbox/leads/${lead.id}`} className="block hover:underline">
                    {lead.name}
                    <span className="block text-sm font-normal text-muted-foreground">{lead.email}</span>
                  </Link>
                </TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{lead.source}</Badge></TableCell>
                <TableCell className="text-sm">{lead.project?.en ?? "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDateTime(lead.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageShell>
  );
}
