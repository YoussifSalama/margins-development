import { notFound } from "next/navigation";
import PageShell from "@/components/cms/page-shell";
import { requireUser } from "@/server/auth/session";
import StatusBadge from "@/components/cms/status-badge";
import { getProject } from "@/server/projects/queries";
import { listAmenities, listUnitTypes } from "@/server/lists/queries";
import { getCalculatorSetup } from "@/server/calculator/data";
import { getCalculatorSelection } from "@/server/pages/queries";
import { emptyLocalized, emptySeo } from "@/lib/schemas/common";
import ProjectForm from "../project-form";

export const metadata = { title: "Edit project" };

export default async function EditProjectPage({ params }: PageProps<"/admin/content/projects/[id]">) {
  const { id } = await params;
  const [data, unitTypes, amenities, calculatorDefaults, calculatorIds] = await Promise.all([
    getProject(id).catch(() => undefined),
    listUnitTypes(),
    listAmenities(),
    getCalculatorSetup(),
    getCalculatorSelection(),
  ]);
  if (!data) notFound();
  const { project, storyBlocks, places, amenityIds, units, investment } = data;

  return (
    <PageShell
      tour="entity"
      eyebrow="Projects"
      title={project.name.en}
      back={{ href: "/admin/content/projects", label: "All projects" }}
      actions={<StatusBadge status={project.status} />}
    >
      <ProjectForm
        id={project.id}
        slugLocked={project.status !== "draft"}
        calculatorDefaults={calculatorDefaults}
        canEditFigures={(await requireUser()).role === "admin"}
        inCalculator={calculatorIds.includes(project.id)}
        unitTypes={unitTypes.map((type) => ({ id: type.id, label: type.name }))}
        amenities={amenities.map((amenity) => ({ id: amenity.id, label: amenity.label }))}
        values={{
          slug: project.slug,
          status: project.status,
          buildStatus: project.buildStatus,
          year: project.year,
          name: project.name,
          location: project.location,
          tagline: project.tagline ?? emptyLocalized,
          summary: project.summary ?? emptyLocalized,
          description: project.description ?? emptyLocalized,
          sector: project.sector ?? emptyLocalized,
          sizeLabel: project.sizeLabel ?? emptyLocalized,
          locationDescription: project.locationDescription ?? emptyLocalized,
          facilitiesDescription: project.facilitiesDescription ?? emptyLocalized,
          unitsDescription: project.unitsDescription ?? emptyLocalized,
          address: project.address ?? emptyLocalized,
          coverImage: project.coverImage ?? "",
          heroMedia: project.heroMedia ?? "",
          mapImage: project.mapImage ?? "",
          gallery: project.gallery,
          lat: project.lat,
          lng: project.lng,
          storyBlocks: storyBlocks.map(({ heading, body, images }) => ({ heading, body, images })),
          places: places.map(({ category, name, distanceKm }) => ({ category, name, distanceKm })),
          amenityIds,
          units: units.map((unit) => ({
            unitTypeId: unit.unitTypeId,
            image: unit.image ?? "",
            sizeRange: unit.sizeRange ?? emptyLocalized,
            avgPrice: unit.avgPrice,
            annualGrossRent: unit.annualGrossRent,
            annualOpCosts: unit.annualOpCosts,
          })),
          investment: {
            phaseLabel: investment?.phaseLabel ?? emptyLocalized,
            occupancyPct: investment?.occupancyPct ?? null,
            appreciationPct: investment?.appreciationPct ?? null,
            deliveryMonth: investment?.deliveryMonth ?? null,
            rentalStartMonth: investment?.rentalStartMonth ?? null,
          },
          seo: project.seo ?? emptySeo,
        }}
      />

      <div className="h-16" />
    </PageShell>
  );
}
