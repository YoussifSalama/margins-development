"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "motion/react";
import { fadeUpBounce } from "@/lib/motion";
import { useForwardInView } from "@/lib/useForwardInView";

// Self-triggering bouncy fade-up for one block (a card, a heading, a panel),
// replayed on every forward scroll into view. For several siblings that should
// cascade from one trigger use StaggerReveal; for cards in a grid give each its
// own Reveal with `delay` = column index so a row cascades as it scrolls in.
export default function Reveal({
  children,
  className = "",
  delay = 0,
  amount = 0.2,
  scale,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
  /** if set, the element also scales down from this value to 1 as it enters (e.g. a media card that starts oversized and settles into its frame) */
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useForwardInView(ref, amount);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={shown ? "visible" : "hidden"}
      // the variant carries its own transition, so the delay has to live inside it
      variants={{
        hidden: scale === undefined ? fadeUpBounce.hidden : { ...fadeUpBounce.hidden, scale },
        visible: { opacity: 1, y: 0, ...(scale === undefined ? {} : { scale: 1 }), transition: { type: "spring", duration: 0.9, bounce: 0.45, delay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
