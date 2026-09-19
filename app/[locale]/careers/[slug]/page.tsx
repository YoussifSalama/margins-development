import * as motion from "motion/react-client";
import Reveal from "@/components/Reveal";
import StaggerReveal from "@/components/StaggerReveal";
import { fadeUpBounce } from "@/lib/motion";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { getJobPage, getJobSlugs } from "@/server/public/pages";
import { toMetadata } from "@/server/public/seo";
import type { JobPage } from "@/lib/content";
import PageSeoScripts from "@/components/PageSeoScripts";
import { routing } from "@/i18n/routing";
import BulletList from "@/components/BulletList";
import JobSidebar from "@/components/JobSidebar";
import JobApplyForm from "@/components/JobApplyForm";
import Breadcrumb from "@/components/Breadcrumb";

// ponytail: Unsplash stand-in, same as Careers listing hero, until Margins' own photo lands
const heroImage =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80&auto=format&fit=crop";

export async function generateStaticParams() {
  const slugs = await getJobSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/careers/[slug]">) {
  const { locale, slug } = await params;
  const payload = await getJobPage(locale, slug);
  return payload ? toMetadata(payload.seo) : {};
}

// One payload (GET /api/pages/careers/<slug> returns the same): SEO with the JobPosting schema,
// site data, the job, and the info shared by every job (perks, hours…).
export default async function JobDetail({
  params,
}: PageProps<"/[locale]/careers/[slug]">) {
  const { locale, slug } = await params;
  const payload = await getJobPage(locale, slug);
  if (!payload) notFound();

  return (
    <>
      <PageSeoScripts seo={payload.seo} />
      <JobDetailBody role={payload.page.job} content={payload.page.jobInfo} image={payload.page.heroImage} />
      <section id="apply" className="scroll-mt-24 bg-dark px-6 pb-24">
        <div className="container">
          <JobApplyForm jobSlug={payload.page.job.slug} jobTitle={payload.page.job.title} />
        </div>
      </section>
    </>
  );
}

function JobDetailBody({
  role,
  content,
  image,
}: {
  role: JobPage["job"];
  content: JobPage["jobInfo"];
  image: string;
}) {
  const t = useTranslations("careers");

  return (
    <div className="relative isolate bg-dark text-white">
      <div className="absolute inset-x-0 top-0 -z-10 h-95 overflow-hidden sm:h-107.5 lg:h-131.5">
        <Image
          src={image || heroImage}
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-dark-overlay-90" />
      </div>

      <div className="px-6 pt-53 pb-24 sm:pt-65 lg:pt-77">
        <div className="container">
          <Breadcrumb
            items={[
              { label: t("title"), href: "/careers" },
              { label: role.title },
            ]}
          />

          <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="flex flex-col gap-5">
              <StaggerReveal stagger={0.12} className="flex flex-col gap-5">
                <motion.h1
                  variants={fadeUpBounce}
                  className="font-heading text-[clamp(2rem,4vw+1rem,3.75rem)] leading-[1.09] text-accent"
                >
                  {role.title}
                </motion.h1>

                <motion.div
                  variants={fadeUpBounce}
                  className="flex flex-wrap gap-x-12 gap-y-4 border-b border-meta-border pt-2.5 pb-5.75"
                >
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[14px] text-meta-label">
                      {t("meta.location")}
                    </p>
                    <p className="text-[16px]">{role.location}</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[14px] text-meta-label">
                      {t("meta.date")}
                    </p>
                    <p className="text-[16px]">{role.date}</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[14px] text-meta-label">
                      {t("meta.jobType")}
                    </p>
                    <p className="text-[16px]">{role.jobType}</p>
                  </div>
                </motion.div>

                <motion.p
                  variants={fadeUpBounce}
                  className="mt-2 text-white/70"
                >
                  {role.intro}
                </motion.p>
              </StaggerReveal>

              <Reveal>
                <section>
                  <h2 className="text-2xl font-semibold">
                    {t("whatYouWillDo")}
                  </h2>
                  <div className="mt-6">
                    <BulletList items={role.responsibilities} />
                  </div>
                </section>
              </Reveal>

              <Reveal>
                <section>
                  <h2 className="text-2xl font-semibold">
                    {t("requirements")}
                  </h2>
                  <div className="mt-6">
                    <BulletList items={role.requirements} />
                  </div>
                </section>
              </Reveal>

              <Reveal>
                <section>
                  <h2 className="text-2xl font-semibold">
                    {t("educationalQualification")}
                  </h2>
                  <p className="mt-6 text-white/70">{content.educationNote}</p>
                </section>
              </Reveal>

              <Reveal>
                <section>
                  <h2 className="text-2xl font-semibold">
                    {t("perksAndBenefits")}
                  </h2>
                  <div className="mt-6">
                    <BulletList items={content.perks} />
                  </div>
                </section>
              </Reveal>

              <p className="mt-2 text-white/70">{content.closing}</p>
            </div>

            <Reveal delay={0.3}>
              <JobSidebar
                applyLabel={t("applyForJob")}
                facts={[
                  { label: t("facts.experience"), value: role.experience },
                  {
                    label: t("facts.workingHours"),
                    value: content.workingHours,
                  },
                  { label: t("facts.workingDays"), value: content.workingDays },
                  { label: t("facts.salary"), value: role.salary },
                  {
                    label: t("facts.vacancy"),
                    value: t("facts.vacanciesValue", { count: role.openings }),
                  },
                  { label: t("facts.deadline"), value: role.deadline },
                ]}
              />
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
