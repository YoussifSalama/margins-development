"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { FiPlus } from "react-icons/fi";
import { spring } from "@/lib/motion";
import { useForwardInView } from "@/lib/useForwardInView";
import RichText from "@/components/RichText";

// heading → description, then the items one after another, each fading up on every forward scroll into view
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, transition: { duration: 0 } }, // reset happens off-screen, keep it instant
  visible: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.9, bounce: 0.45 } },
};

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
  const headRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const headShown = useForwardInView(headRef, 0.2);
  const listShown = useForwardInView(listRef, 0.2);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-12">
      <motion.div
        ref={headRef}
        initial="hidden"
        animate={headShown ? "visible" : "hidden"}
        variants={stagger}
        className="flex flex-col items-center gap-4 text-center"
      >
        <motion.h2
          variants={fadeUp}
          className="font-heading text-[40px] leading-[1.15] tracking-[-0.8px] text-foreground"
        >
          {heading}
        </motion.h2>
        {/* div, not p: the CMS description is rich text and may contain its own paragraphs */}
        <motion.div variants={fadeUp} className="max-w-xl text-base text-muted">
          <RichText html={description} />
        </motion.div>
      </motion.div>

      <motion.div
        ref={listRef}
        initial="hidden"
        animate={listShown ? "visible" : "hidden"}
        variants={stagger}
        className="flex flex-col gap-3"
      >
        {items.map((item, i) => {
          const open = i === openIndex;
          return (
            <motion.div key={item.question} variants={fadeUp} className="rounded-[10px] bg-faq-item px-6">
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
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
