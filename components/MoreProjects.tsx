import { getTranslations } from "next-intl/server";
import { getProjects } from "@/lib/projects";
import MoreProjectsSlider from "@/components/MoreProjectsSlider";

export default async function MoreProjects({
  locale,
  currentSlug,
}: {
  locale: string;
  currentSlug: string;
}) {
  const t = await getTranslations({ locale, namespace: "projects" });
  const projects = getProjects(locale).filter((p) => p.slug !== currentSlug);

  if (projects.length === 0) return null;

  return (
    <section className="rounded-t-2xl bg-background py-24">
      <div className="container">
        <MoreProjectsSlider
          projects={projects}
          locale={locale}
          headingLine1={t("moreProjectsLine1")}
          headingLine2={t("moreProjectsLine2")}
        />
      </div>
    </section>
  );
}
