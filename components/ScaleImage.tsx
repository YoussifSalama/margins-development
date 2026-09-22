"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useForwardInView } from "@/lib/useForwardInView";

const spring = { type: "spring", duration: 0.9, bounce: 0.45 } as const;

// Two independently-scaling layers, replaying on every forward scroll (useForwardInView):
// the frame (this element's own box, clipped via overflow-hidden) settles from oversized
// down to its real size, while the photo inside keeps scaling a beat longer — so the frame
// closes in and the image itself is still visibly zooming as it settles.
export default function ScaleImage({
  src,
  alt = "",
  sizes,
  delay = 0,
  className,
}: {
  src: string;
  alt?: string;
  sizes: string;
  delay?: number;
  className: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useForwardInView(ref, 0.2);

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 1.3 }}
      animate={shown ? { scale: 1 } : { scale: 1.3 }}
      transition={{ ...spring, delay }}
      className={`${className} overflow-hidden`}
    >
      <motion.div
        initial={{ scale: 1.5 }}
        animate={shown ? { scale: 1 } : { scale: 1.5 }}
        transition={{ ...spring, delay: delay + 0.08 }}
        className="absolute inset-0"
      >
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </motion.div>
    </motion.div>
  );
}
