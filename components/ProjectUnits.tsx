import { getTranslations } from "next-intl/server";
import UnitsSlider from "@/components/UnitsSlider";

const unitKeys = ["apartments", "residential", "commercial"] as const;
const unitImages: Record<(typeof unitKeys)[number], string> = {
  apartments: "/pages/projects/location/unit-1.jpg",
  residential: "/pages/projects/location/unit-2.jpg",
  commercial: "/pages/projects/location/unit-3.png",
};

export default async function ProjectUnits({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "projects" });

  const units = unitKeys.map((key) => ({
    key,
    image: unitImages[key],
    title: t(`units.${key}`),
  }));

  return (
    <section className="bg-dark pb-24 text-white">
      <div className="container">
        <UnitsSlider
          units={units}
          description={t("unitsDescription")}
          locale={locale}
          headingLine1={t("unitsLine1")}
          headingLine2={t("unitsLine2")}
        />
      </div>
    </section>
  );
}
