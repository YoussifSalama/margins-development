import VerticalMarquee from "@/components/VerticalMarquee";
import Breadcrumb from "@/components/Breadcrumb";

const leftImages = [
  "/pages/projects/hero/left-1.png",
  "/pages/projects/hero/left-2.png",
  "/pages/projects/hero/left-3.png",
  "/pages/projects/hero/left-4.png",
  "/pages/projects/hero/left-5.png",
];
const rightImages = [
  "/pages/projects/hero/right-1.png",
  "/pages/projects/hero/right-2.png",
  "/pages/projects/hero/right-3.png",
  "/pages/projects/hero/right-4.png",
  "/pages/projects/hero/right-5.png",
];

export default function ProjectsHero({
  title,
  description,
  current,
}: {
  title: string;
  description: string;
  current: string;
}) {
  return (
    <section className="relative isolate flex min-h-125 items-center justify-center overflow-hidden bg-dark py-10 sm:min-h-140 lg:min-h-173">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-52.75 bg-linear-to-b from-dark to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-63.5 bg-linear-to-t from-dark to-transparent"
      />

      <div className="absolute inset-y-0 left-23.5 -z-10 hidden lg:block">
        <VerticalMarquee images={leftImages} direction="up" />
      </div>
      <div className="absolute inset-y-0 right-23.5 -z-10 hidden lg:block">
        <VerticalMarquee images={rightImages} direction="down" />
      </div>

      <div className="flex flex-col items-center gap-10 px-6 text-center text-white sm:gap-16 lg:gap-20">
        <div className="flex flex-col items-center gap-5">
          <h1 className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] tracking-[2px]">{title}</h1>
          <p className="max-w-lg text-[16px] leading-6 tracking-[-0.16px]">{description}</p>
        </div>
        <Breadcrumb items={[{ label: current }]} />
      </div>
    </section>
  );
}
