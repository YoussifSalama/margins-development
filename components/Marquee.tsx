"use client";

import { motion, useScroll, useTransform } from "motion/react";

export type MarqueeItem = { label: string; src?: string; alt?: string };

// the track is COPIES repeats of the list, so one repeat = 100/COPIES % and the loop wraps there
const COPIES = 6;
const PERIOD = 100 / COPIES;

function wrapPercent(v: number) {
  return (((v % PERIOD) + PERIOD) % PERIOD) - PERIOD;
}

function MarqueeRow({
  items,
  direction = "left",
  speed = 0.05,
}: {
  items: MarqueeItem[];
  direction?: "left" | "right";
  speed?: number;
}) {
  const track = Array.from({ length: COPIES }, () => items).flat();
  const { scrollY } = useScroll();
  const sign = direction === "left" ? -1 : 1;
  const x = useTransform(scrollY, (latest) => `${wrapPercent(sign * latest * speed * (2 / COPIES))}%`);

  return (
    <motion.div className="flex items-center" style={{ x }}>
      {track.map((item, i) => (
        <div key={i} className="flex items-center">
          {i > 0 && <span aria-hidden className="mx-8 h-8 w-px bg-divider/10" />}
          <div className="flex h-8 shrink-0 items-center justify-center whitespace-nowrap text-lg font-medium tracking-tight text-foreground">
            {item.src ? (
              // eslint-disable-next-line @next/next/no-img-element -- CMS logos, arbitrary host/size
              <img src={item.src} alt={item.alt ?? item.label} className="h-8 w-auto max-w-none shrink-0 object-contain" />
            ) : (
              item.label
            )}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export default function Marquee({
  items,
  mode = "single",
  speed = 0.05,
}: {
  items: MarqueeItem[];
  /** "single" — one row, one direction (default). "stacked" — two rows, opposite directions. */
  mode?: "single" | "stacked";
  speed?: number;
}) {
  return (
    <div className="relative mx-auto container overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-background to-transparent" />
      {mode === "stacked" ? (
        <div className="flex flex-col gap-6">
          <MarqueeRow items={items} direction="left" speed={speed} />
          <MarqueeRow items={items} direction="right" speed={speed} />
        </div>
      ) : (
        <MarqueeRow items={items} direction="left" speed={speed} />
      )}
    </div>
  );
}
