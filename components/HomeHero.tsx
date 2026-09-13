"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Button from "@/components/Button";
import MediaBackground from "@/components/MediaBackground";
import { enterSpring, heroEnterVariants, heroEnterDelay } from "@/lib/motion";
import { useSplashDone } from "@/hooks/useSplashDone";

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
  const ready = useSplashDone();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const height = useTransform(scrollYProgress, [0, 0.5, 1], ["100dvh", "50dvh", "50dvh"]);

  return (
    <div ref={containerRef} className="relative h-dvh">
      <motion.section className="sticky top-0 bg-dark overflow-hidden" style={{ height }}>
        <MediaBackground src={media} className="h-full">
          <motion.div
            initial="hidden"
            animate={ready ? "visible" : "hidden"}
            variants={heroEnterVariants}
            transition={{ ...enterSpring, delay: heroEnterDelay }}
            className="flex h-full flex-col items-center justify-end gap-6 px-6 pb-20 text-center text-white"
          >
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
          </motion.div>
        </MediaBackground>
      </motion.section>
    </div>
  );
}
