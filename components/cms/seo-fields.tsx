"use client";

import { SectionCard } from "./page-shell";
import { BilingualField } from "./fields";
import { BilingualListField } from "./list-fields";
import MediaField from "./media-field";

/** Same group on every page and every item. Structured data (JSON-LD) is generated from the content — nothing to type here. */
export default function SeoFields({ name = "seo", fallback }: { name?: string; fallback: string }) {
  return (
    <SectionCard title="Search & sharing" hint={`Leave empty to fall back to ${fallback}. Schema markup, canonical and hreflang tags are generated automatically.`}>
      <BilingualField name={`${name}.title`} label="Meta title" hint="Aim for under 60 characters." />
      <BilingualField name={`${name}.description`} label="Meta description" multiline rows={3} hint="Aim for 120–160 characters." />
      <BilingualListField name={`${name}.keywords`} label="Keywords" rows={4} />
      <MediaField name={`${name}.ogImage`} label="Social share image" hint="1200×630. Falls back to the cover image." />
    </SectionCard>
  );
}
