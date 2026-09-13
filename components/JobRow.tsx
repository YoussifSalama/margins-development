"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { FiPlus } from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import { spring, lightTextVariants } from "@/lib/motion";

export default function JobRow({
  index,
  slug,
  title,
  openings,
  summary,
}: {
  index: number;
  slug: string;
  title: string;
  openings: number;
  summary: string;
}) {
  const t = useTranslations("careers");
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10">
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        initial="rest"
        whileHover="hover"
        className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-2 py-8 text-start"
      >
        <div className="flex items-center gap-6">
          <span className="text-sm text-white/40">{String(index).padStart(2, "0")}</span>
          <motion.h3 className="text-2xl text-white" variants={lightTextVariants} transition={{ duration: 0.2 }}>
            {title}
          </motion.h3>
        </div>
        <div className="flex items-center gap-10">
          <span className="text-sm text-accent/70">
            ({String(openings).padStart(2, "0")} {t("openRoles")})
          </span>
          <motion.span
            aria-hidden
            animate={{ rotate: open ? 45 : 0 }}
            transition={spring}
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-accent text-accent"
          >
            <FiPlus className="size-4" />
          </motion.span>
        </div>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-6 pb-8 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-2xl text-white/60">{summary}</p>
              <Link
                href={`/careers/${slug}`}
                className="shrink-0 text-sm font-medium text-white underline hover:text-accent"
              >
                {t("apply")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
