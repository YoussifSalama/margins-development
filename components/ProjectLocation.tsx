import { getTranslations } from "next-intl/server";
import LocationInteractive from "@/components/LocationInteractive";

const pillKeys = ["transport", "education", "shopping", "food"] as const;

const featureKeys = [
  "backYard",
  "garage",
  "frontYard",
  "swimmingPool",
  "kitchen",
  "mediaRoom",
  "gym",
  "laundry",
  "kitchen2",
  "mediaRoom2",
  "electricity",
  "ventilation",
  "centralAir",
  "naturalGas",
  "wifi",
  "washerDryer",
  "smokeDetectors",
  "fireplace",
] as const;

type PlaceItem = { name: string; distance: string };

export default async function ProjectLocation({
  locale,
  location,
}: {
  locale: string;
  location: string;
}) {
  const t = await getTranslations({ locale, namespace: "projects" });

  const categories = pillKeys.map((key) => ({
    key,
    label: t(`amenities.${key}`),
    places: t.raw(`places.categories.${key}`) as PlaceItem[],
  }));

  const features = featureKeys.map((key) => ({ key, label: t(`features.${key}`) }));

  const openMapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  return (
    <section className="rounded-t-2xl bg-dark py-24 text-white">
      <div className="container">
        <LocationInteractive
          locationLine1={t("locationLine1")}
          locationLine2={t("locationLine2")}
          locationDescription={t("locationDescription")}
          facilitiesLine1={t("facilitiesLine1")}
          facilitiesLine2={t("facilitiesLine2")}
          facilitiesDescription={t("facilitiesDescription")}
          categories={categories}
          features={features}
          openMapHref={openMapHref}
          openMapLabel={t("openMap")}
        />
      </div>
    </section>
  );
}
