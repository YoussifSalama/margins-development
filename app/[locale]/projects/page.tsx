import { getTranslations } from "next-intl/server";
import { getProjects } from "@/lib/projects";
import ProjectCard from "@/components/ProjectCard";
import ProjectsHero from "@/components/ProjectsHero";
import Pagination from "@/components/Pagination";
import ProjectsExplore from "@/components/ProjectsExplore";

export const metadata = { title: "Projects — Margins" };

const DEFAULT_LIMIT = 4;

export default async function Projects({
  params,
  searchParams,
}: PageProps<"/[locale]/projects">) {
  const { locale } = await params;
  const { page: pageParam, limit: limitParam } = await searchParams;

  const t = await getTranslations({ locale, namespace: "projects" });
  const allProjects = getProjects(locale);

  const limit = Number(limitParam) || DEFAULT_LIMIT;
  const totalPages = Math.max(1, Math.ceil(allProjects.length / limit));
  const page = Math.min(Math.max(Number(pageParam) || 1, 1), totalPages);
  const projects = allProjects.slice((page - 1) * limit, page * limit);

  return (
    <div>
      <ProjectsHero
        title={t("heroTitle")}
        description={t("heroDescription")}
        current={t("heroTitle")}
      />
      <div className="container py-24">
        <div className="grid gap-x-16.75 gap-y-14 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              slug={project.slug}
              name={project.name}
              location={project.location}
              image={project.image}
            />
          ))}
        </div>
        <Pagination basePath="/projects" page={page} totalPages={totalPages} limit={limit} />
      </div>
      <ProjectsExplore locale={locale} />
    </div>
  );
}
