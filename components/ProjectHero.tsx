import Image from "next/image";
import Button from "@/components/Button";

export default function ProjectHero({
  name,
  image,
  tagline,
  ctaProjects,
  ctaAboutUs,
}: {
  name: string;
  image: string;
  tagline: string;
  ctaProjects: string;
  ctaAboutUs: string;
}) {
  return (
    <section className="relative isolate flex min-h-125 items-end overflow-hidden bg-dark sm:min-h-160 lg:min-h-242">
      <Image src={image} alt={name} fill sizes="100vw" className="-z-10 object-cover" priority />

      <div className="container flex w-full flex-col gap-11.5 pb-12 sm:pb-16 lg:pb-24.75">
        <div className="flex flex-col items-end justify-between gap-10 lg:flex-row lg:items-end">
          <h1 className="font-heading text-[clamp(2.5rem,4vw+2rem,6rem)] uppercase leading-[1.05] tracking-[2px] text-white">
            {name}
          </h1>
          <div className="flex flex-col items-end gap-6 text-right text-white sm:max-w-md">
            <p className="text-base leading-6 tracking-[-0.16px]">{tagline}</p>
            <div className="flex items-center gap-4">
              <Button href="/projects" variant="solid">
                {ctaProjects}
              </Button>
              <Button href="/about" variant="ghost">
                {ctaAboutUs}
              </Button>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-hero-divider" />
      </div>
    </section>
  );
}
