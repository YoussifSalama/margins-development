"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { fadeUpBounce } from "@/lib/motion";
import { FiArrowLeft } from "react-icons/fi";
import {
  getGrossYieldPct,
  formatEGPCompact,
  type Destination,
} from "@/lib/calculator";

export default function UnitTypeStep({
  destination,
  onSelect,
  onBack,
}: {
  destination: Destination;
  onSelect: (key: string) => void;
  onBack: () => void;
}) {
  const t = useTranslations("calculator.unitTypeStep");

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium tracking-wide text-accent uppercase"
      >
        <FiArrowLeft className="size-3.5 rtl:rotate-180" />
        {destination.name}
      </button>
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
        className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {destination.unitTypes.map((u) => (
          <motion.button
            variants={fadeUpBounce}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            key={u.key}
            type="button"
            onClick={() => onSelect(u.key)}
            className="flex flex-col gap-4 rounded-2xl bg-background p-6 text-start ring-1 ring-border transition hover:shadow-lg"
          >
            <div>
              <h3 className="font-heading text-lg text-foreground">{u.name}</h3>
              <p className="text-sm text-muted">{u.sizeRange}</p>
            </div>
            <div className="h-px w-full bg-border" />
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted">{t("avgPrice")}</span>
                <span className="font-semibold text-foreground">
                  {formatEGPCompact(u.avgPrice, 1)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">{t("estGrossYield")}</span>
                <span className="font-semibold text-accent">
                  {getGrossYieldPct(destination, u).toFixed(1)}%
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
