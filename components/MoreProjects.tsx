import Reveal from "@/components/Reveal";
import { getTranslations } from "next-intl/server";
import MoreProjectsSlider from "@/components/MoreProjectsSlider";

export default async function MoreProjects({
  locale,
  projects,
}: {
  locale: string;
  projects: { slug: string; name: string; location: string; image: string }[];
}) {
  const t = await getTranslations({ locale, namespace: "projects" });

  if (projects.length === 0) return null;

  return (
    <section className="rounded-t-2xl bg-background py-24">
      <div className="container">
        <Reveal amount={0.1}>
          <MoreProjectsSlider
            projects={projects}
            locale={locale}
            headingLine1={t("moreProjectsLine1")}
            headingLine2={t("moreProjectsLine2")}
          />
        </Reveal>
      </div>
    </section>
  );
}
