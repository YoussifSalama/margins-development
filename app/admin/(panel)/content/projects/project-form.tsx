"use client";

import { useFormContext, useWatch } from "react-hook-form";
import EntityForm, { SlugField } from "@/components/cms/entity-form";
import { SectionCard } from "@/components/cms/page-shell";
import { BilingualField, NumberField, SelectField } from "@/components/cms/fields";
import { MediaListField } from "@/components/cms/list-fields";
import MediaField from "@/components/cms/media-field";
import Repeater from "@/components/cms/repeater";
import SeoFields from "@/components/cms/seo-fields";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { emptyLocalized, type Localized } from "@/lib/schemas/common";
import { projectInput, type ProjectInput } from "@/lib/schemas/project";
import { deleteProject, saveProject } from "@/server/projects/actions";

type Option = { id: string; label: Localized };
export type CalculatorDefaults = { occupancyPct: number; appreciationPct: number; deliveryMonth: number; rentalStartMonth: number };

/** Live gross yield for one unit — the same figure the calculator's Unit Type step shows. */
function UnitYield({ path, defaults }: { path: string; defaults: CalculatorDefaults }) {
  const [price, rent, override] = useWatch({ name: [`${path}.avgPrice`, `${path}.annualGrossRent`, "investment.occupancyPct"] }) as (number | null)[];
  const occupancy = override ?? defaults.occupancyPct;
  if (!price || !rent) return <p className="text-xs text-muted-foreground">Add a price and a yearly rent to offer this unit in the calculator.</p>;
  return (
    <p className="text-xs text-muted-foreground">
      Gross yield shown to visitors: <strong className="text-foreground">{(((rent * (occupancy / 100)) / price) * 100).toFixed(1)}%</strong>
      {" "}= yearly rent × {occupancy}% occupancy ÷ price
    </p>
  );
}

function AmenityPicker({ amenities }: { amenities: Option[] }) {
  const { setValue } = useFormContext<ProjectInput>();
  const selected = useWatch({ name: "amenityIds" }) as string[];

  if (amenities.length === 0) return <p className="text-sm text-muted-foreground">No amenities defined yet — add them under Shared → Lookups.</p>;

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
      {amenities.map((amenity) => (
        <label key={amenity.id} className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
          <input
            type="checkbox"
            className="size-4 accent-[var(--gold)]"
            checked={selected.includes(amenity.id)}
            onChange={(e) =>
              setValue("amenityIds", e.target.checked ? [...selected, amenity.id] : selected.filter((id) => id !== amenity.id), { shouldDirty: true })
            }
          />
          {amenity.label.en}
        </label>
      ))}
    </div>
  );
}

export default function ProjectForm({
  id,
  values,
  slugLocked = false,
  unitTypes,
  amenities,
  calculatorDefaults,
  inCalculator = false,
}: {
  id?: string;
  values: ProjectInput;
  slugLocked?: boolean;
  unitTypes: Option[];
  amenities: Option[];
  calculatorDefaults: CalculatorDefaults;
  inCalculator?: boolean;
}) {
  return (
    <EntityForm<ProjectInput> noun="Project" basePath="/admin/content/projects" id={id} schema={projectInput} values={values} save={saveProject} remove={deleteProject}>
      <Tabs defaultValue="overview" className="gap-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="story">Story</TabsTrigger>
          <TabsTrigger value="location">Location & amenities</TabsTrigger>
          <TabsTrigger value="units">Units & calculator</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex flex-col gap-6">
          <SectionCard title="Identity">
            <BilingualField name="name" label="Name" />
            <SlugField source="name.en" locked={slugLocked} prefix="/projects/" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <SelectField name="status" label="Status" options={[{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }, { value: "archived", label: "Archived" }]} />
              <SelectField
                name="buildStatus"
                label="Construction status"
                options={[{ value: "planning", label: "Planning" }, { value: "under_construction", label: "Under construction" }, { value: "completed", label: "Completed" }]}
              />
              <NumberField name="year" label="Year" nullable />
            </div>
          </SectionCard>
          <SectionCard title="Facts & copy">
            <BilingualField name="location" label="Location" hint='Short label, e.g. "North Coast".' />
            <BilingualField name="sector" label="Sector" />
            <BilingualField name="sizeLabel" label="Size" hint='e.g. "40,000 sqm"' />
            <BilingualField name="tagline" label="Hero tagline" multiline rows={2} />
            <BilingualField name="summary" label="Summary" multiline hint="Cards, the story sidebar and the default meta description." />
            <BilingualField name="description" label="Description" multiline rows={5} />
          </SectionCard>
          <SectionCard title="Media">
            <MediaField name="coverImage" label="Cover image" hint="Required to publish. Used on cards, the Home showcase and social shares." />
            <MediaField name="heroMedia" label="Hero image or video" accept="image/*,video/mp4" hint="Falls back to the cover image." />
            <MediaListField name="gallery" label="Gallery" />
          </SectionCard>
        </TabsContent>

        <TabsContent value="story">
          <SectionCard title="Story blocks" hint="Each block is a heading, its paragraphs and a column of images.">
            <Repeater name="storyBlocks" itemLabel="Block" empty={{ heading: emptyLocalized, body: emptyLocalized, images: [] }}>
              {(path) => (
                <>
                  <BilingualField name={`${path}.heading`} label="Heading" />
                  <BilingualField name={`${path}.body`} label="Text" multiline rows={6} hint="Leave a blank line between paragraphs." />
                  <MediaListField name={`${path}.images`} label="Images" />
                </>
              )}
            </Repeater>
          </SectionCard>
        </TabsContent>

        <TabsContent value="location" className="flex flex-col gap-6">
          <SectionCard title="Location">
            <BilingualField name="locationDescription" label="Location description" multiline />
            <BilingualField name="address" label="Address" hint="Used for the map link and structured data." />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <NumberField name="lat" label="Latitude" nullable />
              <NumberField name="lng" label="Longitude" nullable />
            </div>
            <MediaField name="mapImage" label="Map image" />
          </SectionCard>
          <SectionCard title="Nearby places" hint="Grouped into the Transport / Education / Shopping / Food tabs on the project page.">
            <Repeater name="places" itemLabel="Place" empty={{ category: "transport", name: emptyLocalized, distanceKm: 0 }}>
              {(path) => (
                <>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <SelectField
                      name={`${path}.category`}
                      label="Category"
                      options={[{ value: "transport", label: "Transport" }, { value: "education", label: "Education" }, { value: "shopping", label: "Shopping" }, { value: "food", label: "Food" }]}
                    />
                    <NumberField name={`${path}.distanceKm`} label="Distance (km)" />
                  </div>
                  <BilingualField name={`${path}.name`} label="Name" />
                </>
              )}
            </Repeater>
          </SectionCard>
          <SectionCard title="Facilities">
            <BilingualField name="facilitiesDescription" label="Facilities description" multiline />
            <AmenityPicker amenities={amenities} />
          </SectionCard>
        </TabsContent>

        <TabsContent value="units" className="flex flex-col gap-6">
          <SectionCard title="Units" hint="One row per unit type: what the project page shows, plus the price, rent and costs the investment calculator uses.">
            <BilingualField name="unitsDescription" label="Units description" multiline />
            {unitTypes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No unit types defined yet — add them under Shared → Lookups.</p>
            ) : (
              <Repeater name="units" itemLabel="Unit" empty={{ unitTypeId: unitTypes[0].id, image: "", sizeRange: emptyLocalized, avgPrice: null, annualGrossRent: null, annualOpCosts: null }}>
                {(path) => (
                  <>
                    <SelectField name={`${path}.unitTypeId`} label="Unit type" options={unitTypes.map((type) => ({ value: type.id, label: type.label.en }))} />
                    <BilingualField name={`${path}.sizeRange`} label="Size range" hint='e.g. "75 – 100 m²"' />
                    <MediaField name={`${path}.image`} label="Image" />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <NumberField name={`${path}.avgPrice`} label="Average price (EGP)" nullable />
                      <NumberField name={`${path}.annualGrossRent`} label="Yearly rent (EGP)" nullable />
                      <NumberField name={`${path}.annualOpCosts`} label="Yearly running costs (EGP)" nullable />
                    </div>
                    <UnitYield path={path} defaults={calculatorDefaults} />
                  </>
                )}
              </Repeater>
            )}
          </SectionCard>

          <SectionCard
            title="Investment calculator"
            hint={
              inCalculator
                ? "This project is offered in the calculator. Leave a field empty to use the default from Pages → Calculator → Calculator setup; fill it only if this project differs."
                : "This project is not in the calculator yet — an admin adds it under Pages → Calculator → Calculator setup. You can still prepare its figures here."
            }
          >
            <BilingualField name="investment.phaseLabel" label="Phase label" hint='e.g. "Off-Plan · Phase 1". Shown on the project card in the calculator.' />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <NumberField name="investment.occupancyPct" label="Occupancy %" hint={`Default: ${calculatorDefaults.occupancyPct}%`} nullable />
              <NumberField name="investment.appreciationPct" label="Annual appreciation %" hint={`Default: ${calculatorDefaults.appreciationPct}%`} nullable />
              <NumberField name="investment.deliveryMonth" label="Delivery (month #)" hint={`Default: ${calculatorDefaults.deliveryMonth}`} nullable />
              <NumberField name="investment.rentalStartMonth" label="Rent starts (month #)" hint={`Default: ${calculatorDefaults.rentalStartMonth}`} nullable />
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="seo">
          <SeoFields fallback="the project name and summary" />
        </TabsContent>
      </Tabs>
    </EntityForm>
  );
}
