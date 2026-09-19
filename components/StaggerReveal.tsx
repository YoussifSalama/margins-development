"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "motion/react";
import { useForwardInView } from "@/lib/useForwardInView";

// Row/grid whose motion children (anything with hidden/visible variants, e.g.
// StatCard) reveal one after another, replayed on every forward scroll into view.
export default function StaggerReveal({
  children,
  className = "",
  stagger = 0.2,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useForwardInView(ref, 0.2);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={shown ? "visible" : "hidden"}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
