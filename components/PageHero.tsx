import HomeHero from "@/components/HomeHero";
import Breadcrumb, { type Crumb } from "@/components/Breadcrumb";

// Inner-page hero = the home hero (full screen, shrinks to half as you scroll,
// content springs in) with a breadcrumb where home has its CTAs.
export default function PageHero({
  title,
  description,
  current,
  crumbs,
  image,
}: {
  title: string;
  description: string;
  current: string;
  /** full trail after Home; defaults to just `current` */
  crumbs?: Crumb[];
  image: string;
}) {
  return (
    <HomeHero title={title} description={description} media={image}>
      <div className="mt-4">
        <Breadcrumb items={crumbs ?? [{ label: current }]} />
      </div>
    </HomeHero>
  );
}
