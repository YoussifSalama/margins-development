"use client";

import { motion, useScroll, useTransform } from "motion/react";
// import Image from "next/image";

export type MarqueeItem = { label: string; src?: string; alt?: string };

function wrapPercent(v: number) {
  return (((v % 50) + 50) % 50) - 50;
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
  const track = [...items, ...items];
  const { scrollY } = useScroll();
  const sign = direction === "left" ? -1 : 1;
  const x = useTransform(scrollY, (latest) => `${wrapPercent(sign * latest * speed)}%`);

  return (
    <motion.div className="flex items-center" style={{ x }}>
      {track.map((item, i) => (
        <div key={i} className="flex items-center">
          {i > 0 && <span aria-hidden className="mx-8 h-8 w-px bg-divider/10" />}
          {/* words in use for now — image logos commented out, swap back when real partner logos land */}
          <div className="flex h-8 shrink-0 items-center justify-center whitespace-nowrap text-lg font-medium tracking-tight text-foreground">
            {/* <Image src={item.src} alt={item.alt} width={140} height={32} className="max-h-8 w-auto object-contain" /> */}
            {item.label}
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
