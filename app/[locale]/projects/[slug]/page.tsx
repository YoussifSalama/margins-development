import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getProjectBySlug, getProjects } from "@/lib/projects";
import { routing } from "@/i18n/routing";
import ProjectHero from "@/components/ProjectHero";
import ProjectIntro from "@/components/ProjectIntro";
import ProjectStory from "@/components/ProjectStory";
import ProjectLocation from "@/components/ProjectLocation";
import ProjectUnits from "@/components/ProjectUnits";
import MoreProjects from "@/components/MoreProjects";
import ProjectFaq from "@/components/ProjectFaq";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getProjects(locale).map((p) => ({ locale, slug: p.slug }))
  );
}

export default async function ProjectDetail({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  const project = getProjectBySlug(locale, slug);
  if (!project) notFound();

  const t = await getTranslations({ locale, namespace: "projects" });

  return (
    <div>
      <ProjectHero
        name={project.name}
        image={project.image}
        tagline={t("heroDescription")}
        ctaProjects={t("ctaOurProjects")}
        ctaAboutUs={t("ctaAboutUs")}
      />
      <div className="bg-white">
        <ProjectIntro name={project.name} description={project.description} />
        <ProjectStory
          locale={locale}
          name={project.name}
          blurb={project.summary}
          facts={{
            year: project.year,
            location: project.location,
            sector: project.sector,
            size: project.size,
            status: t(`status.${project.status}`),
          }}
        />
      </div>
      <ProjectLocation locale={locale} location={project.location} />
      <ProjectUnits locale={locale} />
      <div className="bg-dark">
        <MoreProjects locale={locale} currentSlug={project.slug} />
      </div>
      <ProjectFaq locale={locale} />
    </div>
  );
}
