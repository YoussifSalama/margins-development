"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import VerticalMarquee from "@/components/VerticalMarquee";
import Breadcrumb from "@/components/Breadcrumb";
import { enterSpring, heroEnterVariants, heroEnterDelay } from "@/lib/motion";
import { useSplashDone } from "@/hooks/useSplashDone";
import Gold from "@/components/Gold";
import RichText from "@/components/RichText";

// fallbacks until a collage is uploaded in the CMS (Pages → Projects page → Hero)
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
  images = [],
}: {
  title: string;
  description: string;
  current: string;
  /** CMS collage: first half scrolls up on the left, second half down on the right */
  images?: string[];
}) {
  const ready = useSplashDone();
  // same scroll-shrink as HomeHero: pinned, 100dvh → 50dvh over the first half screen of scroll
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const height = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["100dvh", "50dvh", "50dvh"],
  );

  return (
    <div ref={containerRef} className="relative h-dvh">
      <motion.section
        style={{ height }}
        className="sticky top-0 isolate flex items-center justify-center overflow-hidden bg-dark py-10"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-52.75 bg-linear-to-b from-dark to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-63.5 bg-linear-to-t from-dark to-transparent"
        />

        <div className="absolute inset-y-0 left-23.5 -z-10 hidden lg:block">
          <VerticalMarquee images={images.length > 1 ? images.slice(0, Math.ceil(images.length / 2)) : leftImages} direction="up" />
        </div>
        <div className="absolute inset-y-0 right-23.5 -z-10 hidden lg:block">
          <VerticalMarquee images={images.length > 1 ? images.slice(Math.ceil(images.length / 2)) : rightImages} direction="down" />
        </div>

        <motion.div
          initial="hidden"
          animate={ready ? "visible" : "hidden"}
          variants={heroEnterVariants}
          transition={{ ...enterSpring, delay: heroEnterDelay }}
          className="flex flex-col items-center gap-10 px-6 text-center text-white sm:gap-16 lg:gap-20"
        >
          <div className="flex flex-col items-center gap-5">
            <h1 className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] tracking-[2px]">
              <Gold text={title} />
            </h1>
            <RichText html={description} className="max-w-lg text-[16px] leading-6 tracking-[-0.16px]" />
          </div>
          <Breadcrumb items={[{ label: current }]} />
        </motion.div>
      </motion.section>
    </div>
  );
}
