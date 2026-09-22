"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion, useScroll, useTransform } from "motion/react";
import Button from "@/components/Button";
import { heroEnterDelay } from "@/lib/motion";
import { useSplashDone } from "@/hooks/useSplashDone";

const isVideo = (src: string) => /\.(mp4|webm)(\?|$)/i.test(src);

function Media({ src, name, priority }: { src: string; name: string; priority?: boolean }) {
  return isVideo(src) ? (
    <video src={src} autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover" />
  ) : (
    <Image src={src} alt={name} fill sizes="(min-width: 1024px) 60vw, 90vw" className="object-cover" priority={priority} />
  );
}

// One-shot intro: ONE flex row (real CSS `gap`, so spacing can't drift) carries the hero card
// and up to this many gallery shots, sliding in together as a single train. The hero card is
// always the train's back car — first in the row for LTR, so the row's resting offset is
// tuned to land IT (not the row's own midpoint) dead-center; mirrored via scaleX for RTL.
// Once it holds, it hands off to a separate fullscreen element via a shared `layoutId` — the
// standard "card grows into a fullscreen view" transition, which survives moving to a
// different parent (unlike a plain `layout` resize on a single persisting element).
const FILLER_MAX = 4;
const CARD_W = 1078; // design spec — literal px, not scaled
const CARD_H = 543;
const GAP = 32;
const TRAIN_DURATION = 1.4;
const HOLD = 0.35;
const EXPAND = 0.9;

export default function ProjectHero({
  name,
  heroMedia,
  gallery,
  tagline,
  ctaProjects,
  ctaAboutUs,
}: {
  name: string;
  heroMedia: string;
  gallery: string[];
  tagline: string;
  ctaProjects: string;
  ctaAboutUs: string;
}) {
  const ready = useSplashDone();
  const rtl = useLocale() === "ar";
  const fillers = gallery.slice(0, FILLER_MAX);
  const [phase, setPhase] = useState<"intro" | "growing" | "filled">("intro");

  // same pinned scroll-shrink as HomeHero/ProjectsHero: sticky, 100dvh → 50dvh over the
  // first half screen of scroll, so the rounded section below slides up over it.
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const sectionHeight = useTransform(scrollYProgress, [0, 0.5, 1], ["100dvh", "50dvh", "50dvh"]);

  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => setPhase("growing"), (heroEnterDelay + TRAIN_DURATION + HOLD) * 1000);
    return () => clearTimeout(timer);
  }, [ready]);

  // The row is flex-centered as a whole; shifting it by half the fillers' combined width
  // (+gaps) puts the FIRST child (hero) — not the row's own midpoint — at dead center.
  const restX = (fillers.length * (CARD_W + GAP)) / 2;
  // an extra 100vw (not a fixed px) guarantees the train starts fully off-screen no matter
  // how wide the monitor is — a fixed px offset could still be partly visible on a wide one.
  const fromX = `calc(${restX}px - 100vw)`;

  return (
    <div ref={containerRef} className="relative h-dvh">
      <motion.section style={{ height: sectionHeight }} className="sticky top-0 isolate flex items-end overflow-hidden bg-dark">
        {phase !== "filled" && (
          <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden" style={{ transform: rtl ? "scaleX(-1)" : undefined }}>
            <motion.div
              initial={{ x: fromX }}
              animate={ready ? { x: restX } : { x: fromX }}
              transition={{ duration: TRAIN_DURATION, delay: heroEnterDelay, ease: "easeOut" }}
              className="flex"
              style={{ gap: GAP }}
            >
              {phase === "intro" && (
                <motion.div layoutId="hero-media" className="relative shrink-0 overflow-hidden" style={{ width: CARD_W, height: CARD_H }}>
                  <div style={{ transform: rtl ? "scaleX(-1)" : undefined, position: "absolute", inset: 0 }}>
                    <Media src={heroMedia} name={name} priority />
                  </div>
                </motion.div>
              )}
              {fillers.map((src) => (
                <div key={src} className="relative hidden shrink-0 overflow-hidden md:block" style={{ width: CARD_W, height: CARD_H }}>
                  <div style={{ transform: rtl ? "scaleX(-1)" : undefined, position: "absolute", inset: 0 }}>
                    <Media src={src} name="" />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        )}

        {phase !== "intro" && (
          <motion.div
            layoutId="hero-media"
            transition={{ duration: EXPAND, ease: [0.22, 1, 0.36, 1] }}
            onLayoutAnimationComplete={() => phase === "growing" && setPhase("filled")}
            className="absolute inset-0 -z-10"
          >
            <Media src={heroMedia} name={name} priority />
          </motion.div>
        )}

        <div className="container flex w-full flex-col gap-11.5 pb-12 sm:pb-16 lg:pb-24.75">
          <div className="flex flex-col items-end justify-between gap-10 lg:flex-row lg:items-end">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ type: "spring", duration: 0.9, bounce: 0.3, delay: heroEnterDelay }}
              className="font-heading text-[clamp(2.5rem,4vw+2rem,6rem)] uppercase leading-[1.05] tracking-[2px] text-white"
            >
              {name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={phase === "filled" ? { opacity: 1, y: 0 } : {}}
              transition={{ type: "spring", duration: 0.9, bounce: 0.3 }}
              className="flex flex-col items-end gap-6 text-right text-white sm:max-w-md"
            >
              <p className="text-base leading-6 tracking-[-0.16px]">{tagline}</p>
              <div className="flex items-center gap-4">
                <Button href="/projects" variant="solid">
                  {ctaProjects}
                </Button>
                <Button href="/about" variant="ghost">
                  {ctaAboutUs}
                </Button>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={phase === "filled" ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-px w-full bg-hero-divider"
          />
        </div>
      </motion.section>
    </div>
  );
}
