"use client";

import ListManager from "@/components/cms/list-manager";
import { BilingualField, Field, SelectField } from "@/components/cms/fields";
import { Badge } from "@/components/ui/badge";
import { amenityInput, postCategoryInput, unitTypeInput, type AmenityInput, type PostCategoryInput, type UnitTypeInput } from "@/lib/schemas/lists";
import { deletePostCategory, reorderPostCategories, savePostCategory } from "@/server/posts/actions";
import { emptyLocalized } from "@/lib/schemas/common";
import {
  deleteAmenity, deleteUnitType, reorderAmenities, reorderUnitTypes, saveAmenity, saveUnitType,
} from "@/server/lists/actions";

const Row = ({ label, code }: { label: { en: string; ar: string }; code: string }) => (
  <div className="flex items-center gap-3 text-sm">
    <span className="font-medium">{label.en}</span>
    <span dir="rtl" className="text-muted-foreground">{label.ar}</span>
    <code className="ms-auto rounded bg-muted px-1.5 py-0.5 text-xs">{code}</code>
  </div>
);

const keyHint = "Stable identifier used in code and URLs. Don't change it after it's in use.";

export function UnitTypesManager({ items }: { items: (UnitTypeInput & { id: string })[] }) {
  return (
    <ListManager<UnitTypeInput & { id: string }, UnitTypeInput>
      noun="Unit type"
      items={items}
      schema={unitTypeInput}
      empty={{ key: "", name: emptyLocalized }}
      toValues={({ key, name }) => ({ key, name })}
      renderRow={(item) => <Row label={item.name} code={item.key} />}
      fields={
        <>
          <BilingualField name="name" label="Name" />
          <Field name="key" label="Key" hint={keyHint} />
        </>
      }
      save={saveUnitType}
      remove={deleteUnitType}
      reorder={reorderUnitTypes}
    />
  );
}

export function AmenitiesManager({ items }: { items: (AmenityInput & { id: string })[] }) {
  return (
    <ListManager<AmenityInput & { id: string }, AmenityInput>
      noun="Amenity"
      items={items}
      schema={amenityInput}
      empty={{ key: "", label: emptyLocalized }}
      toValues={({ key, label }) => ({ key, label })}
      renderRow={(item) => <Row label={item.label} code={item.key} />}
      fields={
        <>
          <BilingualField name="label" label="Label" />
          <Field name="key" label="Key" hint={keyHint} />
        </>
      }
      save={saveAmenity}
      remove={deleteAmenity}
      reorder={reorderAmenities}
    />
  );
}

const kindLabels = { news: "News article", article: "Blog / article", event: "Event" } as const;

export function PostCategoriesManager({ items }: { items: (PostCategoryInput & { id: string })[] }) {
  return (
    <ListManager<PostCategoryInput & { id: string }, PostCategoryInput>
      noun="Category"
      items={items}
      schema={postCategoryInput}
      empty={{ key: "", name: emptyLocalized, kind: "news" }}
      toValues={({ key, name, kind }) => ({ key, name, kind })}
      renderRow={(item) => (
        <div className="flex items-center gap-3 text-sm">
          <span className="font-medium">{item.name.en}</span>
          <span dir="rtl" className="text-muted-foreground">{item.name.ar}</span>
          <Badge variant="secondary" className="ms-auto">{kindLabels[item.kind]}</Badge>
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{item.key}</code>
        </div>
      )}
      fields={
        <>
          <BilingualField name="name" label="Name" help="The tab label visitors see in the Media Center, and the label on each post card." />
          <Field name="key" label="Key" hint="Lowercase letters, numbers and dashes — e.g. press-releases." help="Part of the web address of this tab and of every post in it: /media/press-releases and /media/press-releases/<post>. Avoid changing it once it is in use — search engines have to re-learn every address under it." />
          <SelectField
            name="kind"
            label="Kind"
            options={Object.entries(kindLabels).map(([value, label]) => ({ value, label }))}
            help="Tells the website and search engines what posts in this category are. Choosing Event gives those posts a start date, venue and registration link."
          />
        </>
      }
      save={savePostCategory}
      remove={deletePostCategory}
      reorder={reorderPostCategories}
    />
  );
}
