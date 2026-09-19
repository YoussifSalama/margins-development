"use client";

import { useRef } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion, type Variants } from "motion/react";
import { useForwardInView } from "@/lib/useForwardInView";

// Replayed on every forward scroll into view: the photo wipes open from half
// width *and* half height (anchored to its bottom/end corner), then name →
// credential → description fade up with a bounce.
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, transition: { duration: 0 } }, // reset happens off-screen, keep it instant
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", duration: 0.9, bounce: 0.45 },
  },
};
// clip-path, not width/height, so the name and description beside it don't reflow
const wipe = (rtl: boolean): Variants => ({
  hidden: {
    clipPath: rtl
      ? "inset(50% 50% 0% 0% round 6px)"
      : "inset(50% 0% 0% 50% round 6px)",
    transition: { duration: 0 },
  },
  visible: {
    clipPath: "inset(0% 0% 0% 0% round 6px)",
    transition: { duration: 0.8, ease: "easeInOut" },
  },
});

export default function ChairmanCard({
  image,
  name,
  credential,
  description,
}: {
  image: string;
  name: string;
  credential: string;
  description: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useForwardInView(ref, 0.2);
  // the photo is tall: it waits until most of it is on screen, otherwise the
  // height half of the wipe plays out below the fold and only the width is seen
  const photoRef = useRef<HTMLDivElement>(null);
  const photoShown = useForwardInView(photoRef, 0.7);
  const rtl = useLocale() === "ar";

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={shown ? "visible" : "hidden"}
      variants={stagger}
      className="flex flex-col gap-14.25 lg:flex-row"
    >
      <div className="w-full max-w-[433.36px]">
        {/* observed on an unclipped wrapper: the observer counts the photo's own clip-path,
           so the quarter-size photo could never report 70% visible itself */}
        <div ref={photoRef}>
          <motion.div
            variants={wipe(rtl)}
            animate={photoShown ? "visible" : "hidden"}
            className="relative aspect-[433.36/545] w-full overflow-hidden rounded-md"
          >
            <Image
              src={image}
              alt={name}
              fill
              sizes="(min-width: 1024px) 433px, 100vw"
              className="object-cover"
            />
          </motion.div>
        </div>
        <motion.p
          variants={fadeUp}
          className="mt-6.5 text-center text-[24px] leading-7 font-semibold tracking-[-0.32px] text-black"
        >
          {name}
        </motion.p>
        <motion.p
          variants={fadeUp}
          className="mt-3.25 text-center text-[20px] leading-7 tracking-[-0.32px] text-dark"
        >
          {credential}
        </motion.p>
      </div>
      <motion.p
        variants={fadeUp}
        className="max-w-md text-[20px] leading-7 tracking-[-0.32px] text-black"
      >
        {description}
      </motion.p>
    </motion.div>
  );
}

