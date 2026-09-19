import { z } from "zod";
import { emptyLocalized, emptyLocalizedList, emptySeo, localized, localizedList, localizedOptional, seo, slug } from "./common";

export const JOB_STATUSES = ["draft", "open", "closed"] as const;
export const EMPLOYMENT_TYPES = ["full_time", "part_time", "contract", "internship"] as const;

const dateOrEmpty = z.union([z.literal(""), z.iso.date()]);
const moneyOrNull = z.number().int().nonnegative().nullable();

export const jobInput = z
  .object({
    slug,
    status: z.enum(JOB_STATUSES),
    employmentType: z.enum(EMPLOYMENT_TYPES),
    openings: z.number().int().min(1, "At least 1"),
    postedAt: dateOrEmpty,
    deadline: dateOrEmpty,
    // structured salary feeds JobPosting schema; the label is what visitors read
    salaryMin: moneyOrNull,
    salaryMax: moneyOrNull,
    currency: z.string().trim().length(3, "3-letter code, e.g. EGP").toUpperCase(),
    title: localized(160),
    summary: localizedOptional(600),
    intro: localizedOptional(2000),
    location: localizedOptional(160),
    jobTypeLabel: localizedOptional(120),
    experience: localizedOptional(120),
    salaryLabel: localizedOptional(120),
    responsibilities: localizedList(),
    requirements: localizedList(),
    seo,
  })
  .superRefine((job, ctx) => {
    if (job.salaryMin !== null && job.salaryMax !== null && job.salaryMax < job.salaryMin) {
      ctx.addIssue({ code: "custom", path: ["salaryMax"], message: "Must be at least the minimum" });
    }
    if (job.status !== "open") return;
    for (const key of ["summary", "intro", "location"] as const) {
      if (!job[key].en || !job[key].ar) {
        ctx.addIssue({ code: "custom", path: [key, job[key].en ? "ar" : "en"], message: "Required in both languages to open the job" });
      }
    }
  });

export type JobInput = z.infer<typeof jobInput>;

export const emptyJob: JobInput = {
  slug: "",
  status: "draft",
  employmentType: "full_time",
  openings: 1,
  postedAt: "",
  deadline: "",
  salaryMin: null,
  salaryMax: null,
  currency: "EGP",
  title: emptyLocalized,
  summary: emptyLocalized,
  intro: emptyLocalized,
  location: emptyLocalized,
  jobTypeLabel: emptyLocalized,
  experience: emptyLocalized,
  salaryLabel: emptyLocalized,
  responsibilities: emptyLocalizedList,
  requirements: emptyLocalizedList,
  seo: emptySeo,
};
