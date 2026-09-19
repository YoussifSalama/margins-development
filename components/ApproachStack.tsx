"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionStyle, type MotionValue } from "motion/react";
import ApproachCard from "@/components/ApproachCard";

type Item = { number: number; title: string; description: string; image: string };

// ponytail: any card count works, but each card adds PEEK px to the stack and
// 0.0625 of shrink to the deepest one — past ~5 cards tighten both
const PEEK = 80; // px of each buried card left showing above the one on top of it
const STEP = 80; // dvh of scroll per card arrival
const DEPTH_COLORS = ["#fafafa", "#c3a462", "#1b2a3a"]; // front → 1 deep → 2+ deep (background, accent, navy)

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

function StackCard({
  item,
  index,
  count,
  progress,
}: {
  item: Item;
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  const last = count - 1;
  // arrival: 0 → 1 while this card slides up into place (card 0 is already there)
  const arrival = (v: number) => (index === 0 ? 1 : clamp(v * last - (index - 1), 0, 1));
  // depth: how many cards have landed on top of this one (fractional mid-arrival)
  const depth = useTransform(progress, (v) => clamp(v * last - index, 0, last - index));

  // card 1 starts peeking at the bottom of the screen (as in the static layout), the rest off-screen
  const y = useTransform(progress, (v) => `${(1 - arrival(v)) * (index === 1 ? 60 : 100)}vh`);
  const scale = useTransform(progress, (v) => 1 - 0.0625 * depth.get() - 0.035 * (1 - arrival(v)));
  const backgroundColor = useTransform(depth, [0, 1, 2], DEPTH_COLORS);

  return (
    <motion.div
      // explicit zIndex: once a card settles at y=0/scale=1 motion drops its transform,
      // and with it the stacking context that kept it above the cards it covers
      style={{ y, scale, backgroundColor, zIndex: index, "--peek": `${index * PEEK}px` } as MotionStyle}
      className="relative origin-top rounded-[24px] max-lg:transform-none! max-lg:bg-background! lg:col-start-1 lg:row-start-1 lg:mt-(--peek)"
    >
      <ApproachCard {...item} className="bg-transparent" />
    </motion.div>
  );
}

// Pinned section: intro + card stack hold still (lg+) while each card slides up
// over the previous one, which shrinks, recolors by depth and keeps a PEEK strip
// showing. Below lg it's a plain list — stacked column cards don't fit a phone screen.
export default function ApproachStack({ intro, items }: { intro: ReactNode; items: Item[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const runwayRef = useRef<HTMLDivElement>(null);
  // the runway's start meets the viewport bottom exactly when the stage pins,
  // and its end exactly when it releases — so progress spans the pinned scroll only
  const { scrollYProgress } = useScroll({ target: runwayRef, offset: ["start end", "end end"] });

  // Stage taller than the screen? Pin it by its bottom edge instead of its top
  // (negative sticky top), so the heading crops and the cards never do. CSS can't
  // express "100dvh - own height", hence the measurement.
  useLayoutEffect(() => {
    const stage = stageRef.current!;
    const update = () => (stage.style.top = `${Math.min(0, window.innerHeight - stage.offsetHeight)}px`);
    const ro = new ResizeObserver(update);
    ro.observe(stage);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="container">
      <div ref={stageRef} className="lg:sticky lg:flex lg:min-h-dvh lg:flex-col lg:justify-center">
        <div className="flex flex-col gap-16 lg:gap-24 lg:py-10">
          {intro}
          <div className="flex flex-col gap-8 lg:grid lg:items-start">
            {items.map((item, i) => (
              <StackCard key={item.number} item={item} index={i} count={items.length} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
      <div ref={runwayRef} className="max-lg:hidden" style={{ height: `${(items.length - 1) * STEP}dvh` }} />
    </div>
  );
}
