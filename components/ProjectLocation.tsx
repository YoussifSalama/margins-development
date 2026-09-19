import Reveal from "@/components/Reveal";
import { getTranslations } from "next-intl/server";
import LocationInteractive from "@/components/LocationInteractive";
import type { ProjectDetail } from "@/lib/content";

const pillKeys = ["transport", "education", "shopping", "food"] as const;

type PlaceItem = { name: string; distance: string };

// Places, amenities, descriptions and the map all belong to the project being viewed.
export default async function ProjectLocation({
  locale,
  project,
}: {
  locale: string;
  project: Pick<ProjectDetail, "placeCategories" | "amenities" | "locationDescription" | "facilitiesDescription" | "mapImage" | "mapUrl">;
}) {
  const t = await getTranslations({ locale, namespace: "projects" });

  // tab labels are UI strings; the places inside each tab are the project's own
  const categories = pillKeys
    .map((key) => ({ key, label: t(`amenities.${key}`), places: (project.placeCategories.find((c) => c.key === key)?.places ?? []) as PlaceItem[] }))
    .filter((category) => category.places.length > 0);
  const features = project.amenities;
  const openMapHref = project.mapUrl;

  return (
    <section className="rounded-t-2xl bg-dark py-24 text-white">
      <div className="container">
        <Reveal amount={0.1}>
          <LocationInteractive
            locationLine1={t("locationLine1")}
            locationLine2={t("locationLine2")}
            locationDescription={project.locationDescription}
            facilitiesLine1={t("facilitiesLine1")}
            facilitiesLine2={t("facilitiesLine2")}
            facilitiesDescription={project.facilitiesDescription}
            categories={categories}
            features={features}
            openMapHref={openMapHref}
            openMapLabel={t("openMap")}
            mapImage={project.mapImage}
          />
        </Reveal>
      </div>
    </section>
  );
}
