"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useForwardInView } from "@/lib/useForwardInView";

// Background layer that grows bottom → top with a springy settle each time its
// parent section is scrolled *forward* into view (10% visible). It resets only
// once the section has fully left below the viewport (user scrolled back above
// it), so coming back up from further down the page never replays it.
// Parent needs `relative isolate`; it gets data-revealed="true" once the layer is 20% up.
export default function RisingBackdrop({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // observe the parent: the layer itself is zero-height while scaled to 0
  const shown = useForwardInView(ref, 0.1, true);

  useEffect(() => {
    ref.current!.parentElement!.dataset.revealed = "false";
  }, []);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className={`absolute inset-0 -z-10 origin-bottom ${className}`}
      initial={{ scaleY: 0 }}
      animate={{ scaleY: shown ? 1 : 0 }}
      // .reveal-frame images inside the section open once the layer is 20% up (see globals.css)
      onUpdate={(v) => (ref.current!.parentElement!.dataset.revealed = String(Number(v.scaleY) >= 0.2))}
      transition={shown ? { type: "spring", duration: 3.5, bounce: 0.35 } : { duration: 0 }}
    />
  );
}
