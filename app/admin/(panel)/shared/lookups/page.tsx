import PageShell, { SectionCard } from "@/components/cms/page-shell";
import { listAmenities, listUnitTypes } from "@/server/lists/queries";
import { listPostCategories } from "@/server/posts/queries";
import { AmenitiesManager, PostCategoriesManager, UnitTypesManager } from "./lookups-managers";

export const metadata = { title: "Lookups" };

export default async function LookupsPage() {
  const [unitTypes, amenities, postCategories] = await Promise.all([listUnitTypes(), listAmenities(), listPostCategories()]);
  return (
    <PageShell tour="simpleList" eyebrow="Shared" title="Lookups" description="Small shared lists that posts, projects, the calculator and the contact form pick from.">
      <SectionCard title="Post categories" hint="The tabs of the Media Center. Add as many as you need — News, Events, Blogs, Press releases… The order here is the order of the tabs.">
        <PostCategoriesManager items={postCategories} />
      </SectionCard>
      <SectionCard title="Unit types" hint="Used by project units, the investment calculator and the contact form dropdown.">
        <UnitTypesManager items={unitTypes} />
      </SectionCard>
      <SectionCard title="Amenities" hint="The facilities checklist projects choose from.">
        <AmenitiesManager items={amenities} />
      </SectionCard>
    </PageShell>
  );
}
