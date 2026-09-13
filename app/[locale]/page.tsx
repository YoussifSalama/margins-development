import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getProjects } from "@/lib/projects";
import ProjectCard from "@/components/ProjectCard";

export default function Home() {
  const t = useTranslations("home");
  const locale = useLocale();
  const projects = getProjects(locale);

  return (
    <div className="flex flex-col">
      <section className="container py-24">
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">{t("subtitle")}</p>
        <Link
          href="/projects"
          className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground"
        >
          {t("cta")}
        </Link>
      </section>

      <section className="border-t border-border">
        <div className="container py-16">
          <h2 className="text-2xl font-semibold tracking-tight">{t("featured")}</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
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
        </div>
      </section>
    </div>
  );
}
