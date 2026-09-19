import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getProjectPage, getProjectSlugs } from "@/server/public/pages";
import { toMetadata } from "@/server/public/seo";
import { routing } from "@/i18n/routing";
import PageSeoScripts from "@/components/PageSeoScripts";
import ProjectHero from "@/components/ProjectHero";
import ProjectIntro from "@/components/ProjectIntro";
import ProjectStory from "@/components/ProjectStory";
import ProjectLocation from "@/components/ProjectLocation";
import ProjectUnits from "@/components/ProjectUnits";
import MoreProjects from "@/components/MoreProjects";
import ProjectFaq from "@/components/ProjectFaq";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  const payload = await getProjectPage(locale, slug);
  return payload ? toMetadata(payload.seo) : {};
}

// One payload (GET /api/pages/projects/<slug> returns the same): SEO with the RealEstateListing
// schema, site data, the project with ITS OWN story / places / amenities / units, the other
// projects and the shared FAQs.
export default async function ProjectDetail({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  const payload = await getProjectPage(locale, slug);
  if (!payload) notFound();
  const { project, more, faq } = payload.page;

  const t = await getTranslations({ locale, namespace: "projects" });
  const statusLabel = { planning: "Planning", under_construction: "Under Construction", completed: "Completed" }[project.facts.status];

  return (
    <div>
      <PageSeoScripts seo={payload.seo} />
      <ProjectHero
        name={project.name}
        image={project.heroMedia || project.image}
        tagline={project.tagline}
        ctaProjects={t("ctaOurProjects")}
        ctaAboutUs={t("ctaAboutUs")}
      />
      <div className="bg-white">
        <ProjectIntro name={project.name} description={project.description} />
        <ProjectStory
          locale={locale}
          name={project.name}
          blurb={project.summary}
          blocks={project.storyBlocks}
          facts={{ ...project.facts, status: t(`status.${statusLabel}`) }}
        />
      </div>
      <ProjectLocation locale={locale} project={project} />
      <ProjectUnits locale={locale} units={project.units} description={project.unitsDescription} />
      <div className="bg-dark">
        <MoreProjects locale={locale} projects={more} />
      </div>
      <ProjectFaq heading={faq.heading} description={faq.description} items={faq.items} />
    </div>
  );
}
