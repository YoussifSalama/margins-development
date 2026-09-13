import Image from "next/image";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { getRoleBySlug, getRoles, getCareersContent, type Role, type CareersContent } from "@/lib/careers";
import { routing } from "@/i18n/routing";
import BulletList from "@/components/BulletList";
import JobSidebar from "@/components/JobSidebar";
import Breadcrumb from "@/components/Breadcrumb";

// ponytail: Unsplash stand-in, same as Careers listing hero, until Margins' own photo lands
const heroImage =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80&auto=format&fit=crop";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getRoles(locale).map((r) => ({ locale, slug: r.slug }))
  );
}

export default async function JobDetail({
  params,
}: PageProps<"/[locale]/careers/[slug]">) {
  const { locale, slug } = await params;
  const role = getRoleBySlug(locale, slug);
  if (!role) notFound();

  return <JobDetailBody role={role} content={getCareersContent(locale)} />;
}

function JobDetailBody({ role, content }: { role: Role; content: CareersContent }) {
  const t = useTranslations("careers");

  return (
    <div className="relative isolate bg-dark text-white">
      <div className="absolute inset-x-0 top-0 -z-10 h-95 overflow-hidden sm:h-107.5 lg:h-131.5">
        <Image src={heroImage} alt="" fill sizes="100vw" priority className="object-cover" />
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
              <h1 className="font-heading text-[clamp(2rem,4vw+1rem,3.75rem)] leading-[1.09] text-accent">
                {role.title}
              </h1>

              <div className="flex flex-wrap gap-x-12 gap-y-4 border-b border-meta-border pt-2.5 pb-5.75">
                <div className="flex flex-col gap-1.5">
                  <p className="text-[14px] text-meta-label">{t("meta.location")}</p>
                  <p className="text-[16px]">{role.location}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-[14px] text-meta-label">{t("meta.date")}</p>
                  <p className="text-[16px]">{role.date}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-[14px] text-meta-label">{t("meta.jobType")}</p>
                  <p className="text-[16px]">{role.jobType}</p>
                </div>
              </div>

              <p className="mt-2 text-white/70">{role.intro}</p>

              <section>
                <h2 className="text-2xl font-semibold">{t("whatYouWillDo")}</h2>
                <div className="mt-6">
                  <BulletList items={role.responsibilities} />
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold">{t("requirements")}</h2>
                <div className="mt-6">
                  <BulletList items={role.requirements} />
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold">{t("educationalQualification")}</h2>
                <p className="mt-6 text-white/70">{content.educationNote}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold">{t("perksAndBenefits")}</h2>
                <div className="mt-6">
                  <BulletList items={content.perks} />
                </div>
              </section>

              <p className="mt-2 text-white/70">{content.closing}</p>
            </div>

            <div>
              <JobSidebar
                applyLabel={t("applyForJob")}
                facts={[
                  { label: t("facts.experience"), value: role.experience },
                  { label: t("facts.workingHours"), value: content.workingHours },
                  { label: t("facts.workingDays"), value: content.workingDays },
                  { label: t("facts.salary"), value: role.salary },
                  { label: t("facts.vacancy"), value: t("facts.vacanciesValue", { count: role.openings }) },
                  { label: t("facts.deadline"), value: role.deadline },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
