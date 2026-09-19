"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { fadeUpBounce } from "@/lib/motion";
import { FiArrowRight } from "react-icons/fi";
import type { Destination } from "@/lib/calculator";

export default function DestinationStep({
  destinations,
  onSelect,
}: {
  destinations: Destination[];
  onSelect: (slug: string) => void;
}) {
  const t = useTranslations("calculator.destinationStep");

  return (
    <div className="flex flex-col items-center gap-10">
      <h2 className="text-2xl font-semibold text-foreground">{t("heading")}</h2>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.08, delayChildren: 0.15 },
          },
        }}
        className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {destinations.map((d) => (
          <motion.button
            variants={fadeUpBounce}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            key={d.slug}
            type="button"
            onClick={() => onSelect(d.slug)}
            className="group flex flex-col overflow-hidden rounded-2xl bg-background text-start ring-1 ring-border transition hover:shadow-lg"
          >
            <div className="relative aspect-4/3 w-full overflow-hidden">
              <Image
                src={d.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute start-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm">
                {d.phaseLabel}
              </span>
            </div>
            <div className="flex flex-col gap-1 p-6">
              <h3 className="font-heading text-xl text-foreground">{d.name}</h3>
              <p className="text-sm text-muted">{d.location}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium tracking-wide text-muted uppercase">
                  {t("select")}
                </span>
                <span className="flex size-9 items-center justify-center rounded-full bg-accent text-white">
                  <FiArrowRight className="size-4 rtl:rotate-180" />
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
