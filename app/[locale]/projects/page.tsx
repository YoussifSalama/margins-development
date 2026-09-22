import { getProjectsPage } from "@/server/public/pages";
import { toMetadata } from "@/server/public/seo";
import PageSeoScripts from "@/components/PageSeoScripts";
import Reveal from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";
import ProjectsHero from "@/components/ProjectsHero";
import Pagination from "@/components/Pagination";
import ProjectsExplore from "@/components/ProjectsExplore";



export async function generateMetadata({ params, searchParams }: PageProps<"/[locale]/projects">) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  return toMetadata((await getProjectsPage(locale, Number(query.page) || undefined, Number(query.limit) || undefined)).seo);
}

export default async function Projects({
  params,
  searchParams,
}: PageProps<"/[locale]/projects">) {
  const { locale } = await params;
  const { page: pageParam, limit: limitParam } = await searchParams;

  // one payload: SEO, site data, hero, this page of projects, pagination and the company block
  const { seo, page } = await getProjectsPage(locale, Number(pageParam) || undefined, Number(limitParam) || undefined);
  const { hero, projects, pagination, company } = page;

  return (
    <div className="bg-dark">
      <PageSeoScripts seo={seo} />
      <ProjectsHero title={hero.title} description={hero.description} current={hero.title} images={hero.images} />
      {/* bg-dark shows through the rounded top corners — matches Home/About */}
      <section className="rounded-t-4xl bg-background py-24 sm:rounded-t-[48px]">
        <div className="container">
          <div className="grid gap-x-16.75 gap-y-14 lg:grid-cols-2">
            {projects.map((project, i) => (
              <Reveal key={project.slug} delay={(i % 2) * 0.12}>
                <ProjectCard
                  slug={project.slug}
                  name={project.name}
                  location={project.location}
                  image={project.image}
                />
              </Reveal>
            ))}
          </div>
          <Pagination
            basePath="/projects"
            page={pagination.page}
            totalPages={pagination.totalPages}
            limit={pagination.limit}
          />
        </div>
      </section>
      <ProjectsExplore locale={locale} company={company} />
    </div>
  );
}
