import Link from "next/link";
import { Plus } from "lucide-react";
import PageShell from "@/components/cms/page-shell";
import StatusBadge from "@/components/cms/status-badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listJobs } from "@/server/jobs/queries";

export const metadata = { title: "Jobs" };

export default async function JobsPage() {
  const jobs = await listJobs();

  return (
    <PageShell
      tour="list"
      eyebrow="Content"
      title="Jobs"
      description="Only open jobs appear on the Careers page. Perks, working hours and the closing note are shared by all jobs — edit them under Pages → Careers."
      actions={<Button asChild><Link href="/admin/content/jobs/new"><Plus className="size-4" />New job</Link></Button>}
    >
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Openings</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Applications</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 && <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No jobs yet.</TableCell></TableRow>}
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>
                  <Link href={`/admin/content/jobs/${job.id}`} className="block font-medium hover:underline">
                    {job.title.en}
                    <span dir="rtl" className="block text-start text-sm font-normal text-muted-foreground">{job.title.ar}</span>
                  </Link>
                </TableCell>
                <TableCell><StatusBadge status={job.status} /></TableCell>
                <TableCell className="tabular-nums">{job.openings}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{job.deadline ?? "—"}</TableCell>
                <TableCell>
                  <Link href={`/admin/inbox/applications?job=${job.id}`} className="tabular-nums hover:underline">{job.applications}</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageShell>
  );
}
