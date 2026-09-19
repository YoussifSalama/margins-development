"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Button from "@/components/Button";
import MediaBackground from "@/components/MediaBackground";
import { enterSpring, heroEnterVariants, heroEnterDelay } from "@/lib/motion";
import { useSplashDone } from "@/hooks/useSplashDone";
import RichText from "@/components/RichText";
import Gold from "@/components/Gold";

export default function HomeHero({
  title,
  description,
  descriptionHtml,
  ctaProjects,
  ctaAbout,
  media,
  children,
}: {
  title: string;
  /** plain text — always rendered as text */
  description?: string;
  /** sanitised CMS rich text — the only way HTML gets in here */
  descriptionHtml?: string;
  ctaProjects?: string;
  ctaAbout?: string;
  media: string;
  // replaces the CTA row (inner pages pass their breadcrumb here)
  children?: ReactNode;
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
              <Gold text={title} />
            </h1>
            {/* `description` is plain text and is rendered as text. Only `descriptionHtml` — CMS rich text,
                sanitised on save AND again on read — may be rendered as HTML. */}
            {descriptionHtml ? (
              <RichText html={descriptionHtml} className="max-w-140 text-base leading-6 tracking-[-0.16px] text-white-80" />
            ) : (
              <p className="max-w-140 text-base leading-6 tracking-[-0.16px] text-white-80">{description}</p>
            )}
            {children ?? (
              <div className="mt-4 flex items-center gap-4">
                <Button href="/projects" variant="solid">
                  {ctaProjects}
                </Button>
                <Button href="/about" variant="ghost">
                  {ctaAbout}
                </Button>
              </div>
            )}
          </motion.div>
        </MediaBackground>
      </motion.section>
    </div>
  );
}
