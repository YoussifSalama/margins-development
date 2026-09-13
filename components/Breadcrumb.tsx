"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { spring, lightTextVariants } from "@/lib/motion";

export type Crumb = { label: string; href?: string };

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  const t = useTranslations("nav");

  return (
    <div className="flex flex-wrap items-center gap-1 text-[16px] leading-[24px]">
      <motion.div initial="rest" whileHover="hover">
        <Link href="/">
          <motion.span variants={lightTextVariants} transition={{ duration: 0.2 }}>
            {t("home")}
          </motion.span>
        </Link>
      </motion.div>

      {items.map((item, i) => {
        const isLast = i === items.length - 1;

        if (item.href && !isLast) {
          return (
            <motion.div key={item.label} initial="rest" whileHover="hover">
              <Link href={item.href}>
                <motion.span
                  className="text-breadcrumb-mid"
                  variants={{ rest: { opacity: 1 }, hover: { opacity: 0.7 } }}
                  transition={spring}
                >
                  {" "}
                  / {item.label}
                </motion.span>
              </Link>
            </motion.div>
          );
        }

        return (
          <motion.span
            key={item.label}
            className="text-accent"
            initial={{ opacity: 1 }}
            whileHover={{ opacity: 0.75 }}
            transition={spring}
          >
            {" "}
            / {item.label}
          </motion.span>
        );
      })}
    </div>
  );
}
