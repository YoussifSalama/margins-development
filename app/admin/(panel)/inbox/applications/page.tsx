import PageShell from "@/components/cms/page-shell";
import FilterTabs from "@/components/cms/filter-tabs";
import { ActionButton, OpenLinkButton, StatusSelect } from "@/components/cms/row-actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireUser } from "@/server/auth/session";
import { listApplications } from "@/server/inbox/queries";
import { deleteApplication, getCvUrl, setApplicationStatus } from "@/server/inbox/actions";
import { APPLICATION_STATUSES } from "@/lib/schemas/inbox";
import { formatDateTime } from "@/lib/dates";

export const metadata = { title: "Job applications" };

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export default async function ApplicationsPage({ searchParams }: PageProps<"/admin/inbox/applications">) {
  const sp = await searchParams;
  const job = one(sp.job);
  const status = one(sp.status);
  const [user, applications] = await Promise.all([requireUser(), listApplications({ job, status })]);

  return (
    <PageShell tour="inbox" eyebrow="Inbox" title="Job applications" description="CVs are stored privately. Download links expire after one minute.">
      <FilterTabs
        basePath="/admin/inbox/applications"
        param="status"
        active={status}
        keep={{ job }}
        options={[{ label: "All" }, ...APPLICATION_STATUSES.map((value) => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }))]}
      />
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Applicant</TableHead><TableHead>Job</TableHead><TableHead>Received</TableHead><TableHead>Status</TableHead><TableHead /></TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 && <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No applications.</TableCell></TableRow>}
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  <p className="font-medium">{application.name}</p>
                  <p className="text-sm text-muted-foreground">{application.email}{application.phone && ` · ${application.phone}`}</p>
                  {application.note && <p dir="auto" className="mt-1 max-w-md text-sm whitespace-pre-wrap">{application.note}</p>}
                </TableCell>
                <TableCell className="text-sm">{application.jobTitle}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDateTime(application.createdAt)}</TableCell>
                <TableCell>
                  <StatusSelect value={application.status} options={APPLICATION_STATUSES} onChange={async (next) => { "use server"; return setApplicationStatus({ id: application.id, status: next as (typeof APPLICATION_STATUSES)[number] }); }} />
                </TableCell>
                <TableCell className="space-x-2 text-end">
                  <OpenLinkButton getUrl={getCvUrl.bind(null, application.id)}>Download CV</OpenLinkButton>
                  {user.role === "admin" && (
                    <ActionButton action={deleteApplication.bind(null, application.id)} confirm="Permanently delete this application?" variant="ghost" className="text-destructive">Delete</ActionButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageShell>
  );
}
