import PageShell from "@/components/cms/page-shell";
import { listAmenities, listUnitTypes } from "@/server/lists/queries";
import { getCalculatorSetup } from "@/server/calculator/data";
import { emptyProject } from "@/lib/schemas/project";
import ProjectForm from "../project-form";

export const metadata = { title: "New project" };

export default async function NewProjectPage() {
  const [unitTypes, amenities, calculatorDefaults] = await Promise.all([listUnitTypes(), listAmenities(), getCalculatorSetup()]);
  return (
    <PageShell tour="entity" eyebrow="Projects" title="New project" back={{ href: "/admin/content/projects", label: "All projects" }}>
      <ProjectForm
        values={emptyProject}
        calculatorDefaults={calculatorDefaults}
        unitTypes={unitTypes.map((type) => ({ id: type.id, label: type.name }))}
        amenities={amenities.map((amenity) => ({ id: amenity.id, label: amenity.label }))}
      />
    </PageShell>
  );
}
