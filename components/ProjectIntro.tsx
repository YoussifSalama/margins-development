import * as motion from "motion/react-client";
import ScaleImage from "@/components/ScaleImage";
import StaggerReveal from "@/components/StaggerReveal";
import { fadeUpBounce } from "@/lib/motion";

export default function ProjectIntro({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <section className="container flex flex-col items-center gap-10 py-24 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
      <ScaleImage
        src="/pages/projects/detail/intro-left.png"
        sizes="(min-width: 1280px) 450px, 224px"
        className="relative aspect-112.25/121 w-56 shrink-0 rounded-lg max-lg:hidden xl:w-112.25"
      />

      <StaggerReveal className="flex max-w-xl flex-col items-center gap-6 text-center">
        <motion.h2
          variants={fadeUpBounce}
          className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] tracking-[2px] text-foreground"
        >
          {name}
        </motion.h2>
        <motion.p
          variants={fadeUpBounce}
          className="text-lg leading-[1.4] text-body"
        >
          {description}
        </motion.p>
      </StaggerReveal>

      <ScaleImage
        src="/pages/projects/detail/intro-right.png"
        sizes="(min-width: 1280px) 410px, 192px"
        delay={0.2}
        className="relative aspect-102.5/131 w-48 shrink-0 rounded-lg max-lg:hidden xl:w-102.5"
      />
    </section>
  );
}
