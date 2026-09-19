"use client";

import { useRef, type ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { useForwardInView } from "@/lib/useForwardInView";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.25, delayChildren: 0.4 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40, transition: { duration: 0 } }, // reset happens off-screen, keep it instant
  visible: { opacity: 1, y: 0, transition: { type: "spring", duration: 1.2, bounce: 0.45 } },
};

export default function AboutStats({
  aboutText,
  stats,
}: {
  aboutText: ReactNode;
  stats: { key: string; value: string; label: string }[];
}) {
  // replayed on every forward scroll into view, like the other section texts
  const textRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const textShown = useForwardInView(textRef, 0.4);
  const statsShown = useForwardInView(statsRef, 0.3);

  return (
    <>
      <motion.p
        ref={textRef}
        initial="hidden"
        animate={textShown ? "visible" : "hidden"}
        variants={fadeUp}
        className="mt-16 mx-auto max-w-7xl! text-center text-[28px] leading-[1.4] tracking-[-0.6px] text-foreground sm:mt-24 sm:text-[34px] lg:mt-36"
      >
        {aboutText}
      </motion.p>

      <motion.div
        ref={statsRef}
        initial="hidden"
        animate={statsShown ? "visible" : "hidden"}
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
