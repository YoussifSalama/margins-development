"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "motion/react";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.25, delayChildren: 0.4 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

export default function AboutStats({
  aboutText,
  stats,
}: {
  aboutText: ReactNode;
  stats: { key: string; value: string; label: string }[];
}) {
  return (
    <>
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        className="mt-16 mx-auto max-w-7xl! text-center text-[28px] leading-[1.4] tracking-[-0.6px] text-foreground sm:mt-24 sm:text-[34px] lg:mt-36"
      >
        {aboutText}
      </motion.p>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={container}
        className="container mt-16 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.key} variants={fadeUp} className="text-center lg:text-left">
            <p className="text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-1px] text-foreground">{stat.value}</p>
            <p className="mt-2 text-[15px] text-muted">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
