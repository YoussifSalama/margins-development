import Reveal from "@/components/Reveal";
import { getTranslations } from "next-intl/server";
import UnitsSlider from "@/components/UnitsSlider";

// The units are the project's own (CMS → project → Units & calculator).
export default async function ProjectUnits({
  locale,
  units,
  description,
}: {
  locale: string;
  units: { key: string; title: string; image: string }[];
  description: string;
}) {
  const t = await getTranslations({ locale, namespace: "projects" });
  if (units.length === 0) return null;

  return (
    <section className="bg-dark pb-24 text-white">
      <div className="container">
        <Reveal amount={0.1}>
          <UnitsSlider
            units={units}
            description={description}
            locale={locale}
            headingLine1={t("unitsLine1")}
            headingLine2={t("unitsLine2")}
          />
        </Reveal>
      </div>
    </section>
  );
}
