import PageShell from "@/components/cms/page-shell";
import { requireUser } from "@/server/auth/session";
import { emptyJob } from "@/lib/schemas/job";
import JobForm from "../job-form";

export const metadata = { title: "New job" };

export default async function NewJobPage() {
  await requireUser();
  return (
    <PageShell tour="entity" eyebrow="Jobs" title="New job" back={{ href: "/admin/content/jobs", label: "All jobs" }}>
      <JobForm values={emptyJob} />
    </PageShell>
  );
}
