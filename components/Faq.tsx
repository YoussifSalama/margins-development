"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiPlus } from "react-icons/fi";
import { spring } from "@/lib/motion";

export type FaqItem = { question: string; answer: string };

export default function Faq({
  heading,
  description,
  items,
}: {
  heading: ReactNode;
  description: string;
  items: FaqItem[];
}) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="font-heading text-[40px] leading-[1.15] tracking-[-0.8px] text-foreground">{heading}</h2>
        <p className="max-w-xl text-base text-muted">{description}</p>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item, i) => {
          const open = i === openIndex;
          return (
            <div key={item.question} className="rounded-[10px] bg-faq-item px-6">
              <motion.button
                type="button"
                onClick={() => setOpenIndex(open ? -1 : i)}
                aria-expanded={open}
                initial="rest"
                whileHover="hover"
                className="flex w-full items-center justify-between gap-6 py-5 text-start"
              >
                <h3 className="text-lg font-medium text-foreground">{item.question}</h3>
                <motion.span
                  aria-hidden
                  animate={{ rotate: open ? 45 : 0 }}
                  transition={spring}
                  className="flex size-6 shrink-0 items-center justify-center text-foreground"
                >
                  <FiPlus className="size-4.5" />
                </motion.span>
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
                    <p className="pb-6 text-muted">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
