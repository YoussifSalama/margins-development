"use client";

import Image from "next/image";
import { motion, type Variants } from "motion/react";

// Driven by a parent StaggerReveal: the card fades up, then its value → label →
// caption fade up one after another inside it.
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, transition: { duration: 0 } }, // reset happens off-screen, keep it instant
  visible: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.9, bounce: 0.45 } },
};
const card: Variants = {
  hidden: fadeUp.hidden,
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", duration: 0.9, bounce: 0.45, delayChildren: 0.25, staggerChildren: 0.15 },
  },
};

export default function StatCard({
  value,
  label,
  caption,
  image,
}: {
  value: string;
  label: string;
  caption: string;
  image: string;
}) {
  return (
    <motion.div
      variants={card}
      className="relative isolate flex aspect-518/292 flex-col justify-between overflow-hidden rounded-[19px] bg-dark p-5 text-white sm:p-6 lg:p-8.75"
    >
      {/* ponytail: placeholder bg (bg-dark) shows through — swap in real photo + per-card tint once provided */}
      <Image src={image} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="-z-10 object-cover opacity-60" />
      <div>
        <motion.p
          variants={fadeUp}
          className="text-[clamp(1.75rem,6vw,4.1875rem)] leading-[1.05] font-bold tracking-[-1px]"
        >
          {value}
        </motion.p>
        <motion.p variants={fadeUp} className="mt-1 text-[15px] sm:text-[18px] leading-5 font-medium tracking-[-0.36px]">
          {label}
        </motion.p>
      </div>
      <motion.p variants={fadeUp} className="text-[14px] sm:text-[16px] leading-6 font-semibold tracking-[-0.96px]">
        {caption}
      </motion.p>
    </motion.div>
  );
}
