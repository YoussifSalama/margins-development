import { notFound } from "next/navigation";
import PageShell from "@/components/cms/page-shell";
import StatusBadge from "@/components/cms/status-badge";
import { getJob } from "@/server/jobs/queries";
import { emptyLocalized, emptyLocalizedList, emptySeo } from "@/lib/schemas/common";
import JobForm from "../job-form";

export const metadata = { title: "Edit job" };

export default async function EditJobPage({ params }: PageProps<"/admin/content/jobs/[id]">) {
  const { id } = await params;
  const job = await getJob(id).catch(() => undefined);
  if (!job) notFound();

  return (
    <PageShell tour="entity" eyebrow="Jobs" title={job.title.en} back={{ href: "/admin/content/jobs", label: "All jobs" }} actions={<StatusBadge status={job.status} />}>
      <JobForm
        id={job.id}
        slugLocked={Boolean(job.postedAt)}
        values={{
          slug: job.slug,
          status: job.status,
          employmentType: job.employmentType,
          openings: job.openings,
          postedAt: job.postedAt ?? "",
          deadline: job.deadline ?? "",
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          currency: job.currency,
          title: job.title,
          summary: job.summary ?? emptyLocalized,
          intro: job.intro ?? emptyLocalized,
          location: job.location ?? emptyLocalized,
          jobTypeLabel: job.jobTypeLabel ?? emptyLocalized,
          experience: job.experience ?? emptyLocalized,
          salaryLabel: job.salaryLabel ?? emptyLocalized,
          responsibilities: job.responsibilities ?? emptyLocalizedList,
          requirements: job.requirements ?? emptyLocalizedList,
          seo: job.seo ?? emptySeo,
        }}
      />
    </PageShell>
  );
}
