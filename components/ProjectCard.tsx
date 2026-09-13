"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "motion/react";
import Image from "next/image";
import { spring, zoomVariants, accentTextVariants, lightTextVariants } from "@/lib/motion";

export default function ProjectCard({
  slug,
  name,
  location,
  image,
  dark = false,
}: {
  slug: string;
  name: string;
  location: string;
  image: string;
  dark?: boolean;
}) {
  return (
    <motion.div initial="rest" whileHover="hover">
      <Link href={`/projects/${slug}`} draggable={false} className="flex flex-col items-center gap-4">
        <div
          style={{ aspectRatio: "774 / 512" }}
          className="relative w-full overflow-hidden rounded-lg bg-surface"
        >
          <motion.div className="absolute inset-0" variants={zoomVariants} transition={spring}>
            <Image
              src={image}
              alt={name}
              fill
              draggable={false}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </div>
        <motion.p
          className={`text-2xl font-semibold tracking-[-0.2px] uppercase ${dark ? "text-white" : "text-card-ink"}`}
          variants={dark ? lightTextVariants : accentTextVariants}
          transition={{ duration: 0.2 }}
        >
          {name}
        </motion.p>
        <p className={`text-xs tracking-[-0.2px] uppercase ${dark ? "text-white/70" : "text-card-ink"}`}>
          {location}
        </p>
      </Link>
    </motion.div>
  );
}
