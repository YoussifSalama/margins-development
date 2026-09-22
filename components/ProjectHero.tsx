"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
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

// One-shot intro: up to this many gallery shots walk in left-to-right (decorative, md+
// only — cramped on a phone screen), landing beside the hero media, which arrives last,
// centers, holds, then grows to fill the section. Card slot width drives their spacing.
const FILLER_MAX = 4;
const CARD_ASPECT = 1078 / 543; // design spec, ~1.985:1
const CARD_W = "min(34vw, 560px)";
const SLIDE_FROM = -140; // px — how far each card travels into place
const STAGGER = 0.2;
const CARD_ENTER = 0.6;
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
  const fillers = gallery.slice(0, FILLER_MAX);
  const [phase, setPhase] = useState<"intro" | "growing" | "filled">("intro");

  useEffect(() => {
    if (!ready) return;
    const heroHoldMs = (heroEnterDelay + fillers.length * STAGGER + CARD_ENTER + HOLD) * 1000;
    const timer = setTimeout(() => setPhase("growing"), heroHoldMs);
    return () => clearTimeout(timer);
  }, [ready, fillers.length]);

  return (
    <section className="relative isolate flex min-h-125 items-end overflow-hidden bg-dark sm:min-h-160 lg:min-h-242">
      {/* filmstrip row — real flex `gap` for spacing (no hand-rolled offsets). Fillers fade
          out once the hero media starts growing; the hero card is the last row item, then
          breaks out to `absolute inset-0` and grows to fill the section (Motion's `layout`
          animates that resize automatically). */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center gap-6 md:gap-10">
        {fillers.map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, x: SLIDE_FROM }}
            animate={ready ? { opacity: phase === "intro" ? 1 : 0, x: 0 } : { opacity: 0, x: SLIDE_FROM }}
            transition={{ duration: phase === "intro" ? CARD_ENTER : 0.3, delay: phase === "intro" ? heroEnterDelay + i * STAGGER : 0, ease: "easeOut" }}
            className="relative hidden shrink-0 overflow-hidden md:block"
            style={{ width: CARD_W, aspectRatio: CARD_ASPECT }}
          >
            <Media src={src} name="" />
          </motion.div>
        ))}

        <motion.div
          layout
          initial={{ opacity: 0, x: SLIDE_FROM }}
          animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: SLIDE_FROM }}
          transition={{
            opacity: { duration: CARD_ENTER, delay: heroEnterDelay + fillers.length * STAGGER },
            x: { duration: CARD_ENTER, delay: heroEnterDelay + fillers.length * STAGGER, ease: "easeOut" },
            layout: { duration: EXPAND, ease: [0.22, 1, 0.36, 1] },
          }}
          onLayoutAnimationComplete={() => phase === "growing" && setPhase("filled")}
          style={phase === "intro" ? { width: CARD_W, aspectRatio: CARD_ASPECT } : undefined}
          className={phase === "intro" ? "relative shrink-0 overflow-hidden" : "absolute inset-0"}
        >
          <Media src={heroMedia} name={name} priority />
        </motion.div>
      </div>

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
    </section>
  );
}
