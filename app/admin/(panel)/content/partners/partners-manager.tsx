"use client";

import ListManager from "@/components/cms/list-manager";
import { BilingualField, Field } from "@/components/cms/fields";
import MediaField, { MediaPreview } from "@/components/cms/media-field";
import { partnerInput, type PartnerInput } from "@/lib/schemas/lists";
import { emptyLocalized } from "@/lib/schemas/common";
import { deletePartner, reorderPartners, savePartner } from "@/server/lists/actions";

type Partner = { id: string; name: PartnerInput["name"]; logo: string | null; url: string | null };

export default function PartnersManager({ items }: { items: Partner[] }) {
  return (
    <ListManager<Partner, PartnerInput>
      noun="Partner"
      items={items}
      schema={partnerInput}
      empty={{ name: emptyLocalized, logo: "", url: "" }}
      toValues={(partner) => ({ name: partner.name, logo: partner.logo ?? "", url: partner.url ?? "" })}
      renderRow={(partner) => (
        <div className="flex items-center gap-3">
          {partner.logo && <MediaPreview url={partner.logo} className="h-10 w-16 !object-contain" />}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{partner.name.en}</p>
            <p dir="rtl" className="truncate text-sm text-muted-foreground">{partner.name.ar}</p>
          </div>
        </div>
      )}
      fields={
        <>
          <BilingualField name="name" label="Name" />
          <MediaField name="logo" label="Logo" hint="Transparent PNG or WebP works best. Without a logo the name is shown as text." />
          <Field name="url" label="Website (optional)" />
        </>
      }
      save={savePartner}
      remove={deletePartner}
      reorder={reorderPartners}
    />
  );
}
