"use client";

import { useRef, type ReactNode } from "react";
import ResponsiveMedia from "@/components/ResponsiveMedia";
import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "@/i18n/navigation";
import { FiMapPin } from "react-icons/fi";

type ShowcaseProject = {
  image: string;
  /** phones and tablets (below 1024px) */
  mobileImage?: string;
  eyebrow: string;
  title: string;
  location: string;
  slug: string;
};

function ProjectRevealCard({
  project,
  direction,
  z,
}: {
  project: ShowcaseProject;
  direction: "btt" | "ltr" | "rtl";
  z: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const xFrom = direction === "rtl" ? "100%" : direction === "ltr" ? "-100%" : "0%";
  const x = useTransform(scrollYProgress, [0, 1], [xFrom, "0%"]);
  const y = useTransform(scrollYProgress, [0, 1], direction === "btt" ? ["100%", "0%"] : ["0%", "0%"]);

  return (
    <>
      <div ref={ref} className="h-dvh w-full" />
      <div className="pointer-events-none sticky top-0 h-dvh w-full overflow-hidden" style={{ zIndex: z, marginTop: "-100dvh" }}>
        <motion.div className="group pointer-events-auto absolute inset-0" style={{ x, y }}>
          <ResponsiveMedia src={project.image} mobileSrc={project.mobileImage} alt={project.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <Link href={`/projects/${project.slug}`} aria-label={project.title} className="absolute inset-0 z-10" />
          <div className="pointer-events-none relative flex h-full flex-col justify-end gap-2 px-6 pb-16 text-white sm:px-12 lg:px-20">
            <p className="text-[13px] tracking-[-0.13px] text-accent">{project.eyebrow}</p>
            <h3 className="font-heading decoration-accent underline-offset-8 transition-all group-hover:underline text-[clamp(1.75rem,3vw+1rem,2.75rem)] uppercase leading-[1.15] tracking-[1px]">
              {project.title}
            </h3>
            <p className="flex items-center gap-1.5 text-[14px] text-white-80">
              <FiMapPin className="size-4" />
              {project.location}
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}

const DIRECTION_CYCLE = ["btt", "ltr", "rtl"] as const;

export default function ProjectsShowcase({
  projects,
  children,
}: {
  projects: ShowcaseProject[];
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col">
      {projects.map((project, i) => (
        <ProjectRevealCard
          key={project.title}
          project={project}
          direction={DIRECTION_CYCLE[i % DIRECTION_CYCLE.length]}
          z={20 + i}
        />
      ))}
      {/* guarantees the last card's own dwell range has real scroll room after it,
         instead of borrowing however much the next page section happens to provide */}
      <div className="h-dvh w-full" />
      {/* children = the final card, always bottom-to-top. A btt reveal (y 100% → 0
         over 100dvh of scroll) is exactly what in-flow content does by itself, so
         no transform: the spacer above is its scroll slot (last project stays
         pinned under it), and it may be taller than the viewport. */}
      {children && (
        <div className="relative" style={{ zIndex: 20 + projects.length }}>
          {children}
        </div>
      )}
    </div>
  );
}
