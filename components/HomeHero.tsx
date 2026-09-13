import Button from "@/components/Button";
import MediaBackground from "@/components/MediaBackground";

export default function HomeHero({
  title,
  description,
  ctaProjects,
  ctaAbout,
  media,
}: {
  title: string;
  description: string;
  ctaProjects: string;
  ctaAbout: string;
  media: string;
}) {
  return (
    <section className="bg-dark">
      <MediaBackground src={media} className="min-h-160 sm:min-h-180 lg:min-h-199.5">
        <div className="flex min-h-160 flex-col items-center justify-end gap-6 px-6 pb-20 text-center text-white sm:min-h-180 lg:min-h-199.5">
          <h1 className="font-heading text-[clamp(2.5rem,4vw+2rem,3.5rem)] leading-[1.05] tracking-[2px]">
            {title}
          </h1>
          <p className="max-w-140 text-base leading-6 tracking-[-0.16px] text-white-80">{description}</p>
          <div className="mt-4 flex items-center gap-4">
            <Button href="/projects" variant="solid">
              {ctaProjects}
            </Button>
            <Button href="/about" variant="ghost">
              {ctaAbout}
            </Button>
          </div>
        </div>
      </MediaBackground>
    </section>
  );
}
