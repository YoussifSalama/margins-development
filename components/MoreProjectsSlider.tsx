"use client";

import ProjectCard from "@/components/ProjectCard";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

type Project = { slug: string; name: string; location: string; image: string };

export default function MoreProjectsSlider({
  projects,
  locale,
  headingLine1,
  headingLine2,
}: {
  projects: Project[];
  locale: string;
  headingLine1: string;
  headingLine2: string;
}) {
  return (
    <Carousel opts={{ direction: locale === "ar" ? "rtl" : "ltr", align: "start" }} className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] tracking-[2px] text-foreground">
          {headingLine1} <span className="text-accent">{headingLine2}</span>
        </h2>
        <div className="hidden items-center gap-4 sm:flex">
          <CarouselPrevious variant="light" aria-label={headingLine1} />
          <CarouselNext aria-label={headingLine2} />
        </div>
      </div>

      <CarouselContent className="-ml-8">
        {projects.map((project) => (
          <CarouselItem key={project.slug} className="w-[min(85vw,480px)] pl-8 sm:w-125 lg:w-171">
            <ProjectCard
              slug={project.slug}
              name={project.name}
              location={project.location}
              image={project.image}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
