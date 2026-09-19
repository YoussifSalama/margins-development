"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Variants,
} from "motion/react";
import { FiCheck } from "react-icons/fi";
import { fadeUpBounce, spring } from "@/lib/motion";
import type { Destination } from "@/lib/calculator";
import DestinationStep from "@/components/calculator/DestinationStep";
import UnitTypeStep from "@/components/calculator/UnitTypeStep";
import HorizonStep from "@/components/calculator/HorizonStep";
import PotentialStep from "@/components/calculator/PotentialStep";
import RequestStep from "@/components/calculator/RequestStep";

const STEP_KEYS = [
  "destination",
  "unitType",
  "horizon",
  "potential",
  "request",
] as const;

// steps slide in from the side you're heading to and leave the other way;
// custom = direction (1 forward, -1 back), already flipped for RTL
const stepVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: 48 * dir }),
  center: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", duration: 0.6, bounce: 0.2 },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: -48 * dir,
    transition: { duration: 0.2, ease: "easeIn" },
  }),
};

// Destinations, horizon choices and the default horizon all come from the CMS
// (Pages → Calculator → Calculator setup), loaded by the server page and passed in.
export default function InvestmentCalculator({
  destinations,
  horizons,
  defaultHorizon,
  disclaimer,
}: {
  destinations: Destination[];
  horizons: number[];
  defaultHorizon: number;
  disclaimer?: string;
}) {
  const locale = useLocale();
  const t = useTranslations("calculator");

  const [step, setStepRaw] = useState(0);
  const [dir, setDir] = useState(1);
  const [destinationSlug, setDestinationSlug] = useState<string | null>(null);
  const [unitTypeKey, setUnitTypeKey] = useState<string | null>(null);
  const [years, setYears] = useState(defaultHorizon);

  const destination =
    destinations.find((d) => d.slug === destinationSlug) ?? null;
  const unitType =
    destination?.unitTypes.find((u) => u.key === unitTypeKey) ?? null;

  // each step starts at the top of the wizard — the results → request hop otherwise lands mid-form
  const rootRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current)
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    mounted.current = true;
  }, [step]);

  function setStep(next: number) {
    setDir((next > step ? 1 : -1) * (locale === "ar" ? -1 : 1));
    setStepRaw(next);
  }

  function reset() {
    setStep(0);
    setDestinationSlug(null);
    setUnitTypeKey(null);
    setYears(defaultHorizon);
  }

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={rootRef}
        className="flex scroll-mt-28 flex-col items-center gap-12 sm:gap-16"
      >
        <motion.ol
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="flex flex-wrap items-center justify-center gap-x-2 gap-y-4 sm:gap-x-3"
        >
          {STEP_KEYS.map((key, i) => (
            <motion.li
              key={key}
              variants={fadeUpBounce}
              className="flex items-center gap-2 sm:gap-3"
            >
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ scale: i === step ? 1.15 : 1 }}
                  transition={spring}
                  className={`relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors duration-300 sm:size-9 ${
                    i <= step
                      ? "bg-accent text-white"
                      : "border border-border text-muted"
                  }`}
                >
                  {/* current node breathes: a ring keeps rippling out of it */}
                  {i === step && (
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-accent"
                      animate={{ scale: [1, 1.9], opacity: [0.45, 0] }}
                      transition={{
                        duration: 1.6,
                        ease: "easeOut",
                        repeat: Infinity,
                      }}
                    />
                  )}
                  {/* number ↔ check swap spins in */}
                  <motion.span
                    key={i < step ? "done" : "number"}
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={spring}
                    className="relative flex"
                  >
                    {i < step ? <FiCheck className="size-4" /> : i + 1}
                  </motion.span>
                </motion.span>
                <span
                  className={`text-sm ${i === step ? "font-semibold text-foreground" : "text-muted"}`}
                >
                  {t(`steps.${key}`)}
                </span>
              </div>
              {i < STEP_KEYS.length - 1 && (
                <span className="h-px w-6 bg-border sm:w-10">
                  <motion.span
                    initial={false}
                    animate={{ scaleX: i < step ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="block h-full origin-left bg-accent rtl:origin-right"
                  />
                </span>
              )}
            </motion.li>
          ))}
        </motion.ol>

        <div className="w-full overflow-x-clip">
          {/* no initial={false}: it would also mute the first-load stagger of the cards inside the step */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {step === 0 && (
                <DestinationStep
                  destinations={destinations}
                  onSelect={(slug) => {
                    setDestinationSlug(slug);
                    setStep(1);
                  }}
                />
              )}
              {step === 1 && destination && (
                <UnitTypeStep
                  destination={destination}
                  onSelect={(key) => {
                    setUnitTypeKey(key);
                    setStep(2);
                  }}
                  onBack={() => setStep(0)}
                />
              )}
              {step === 2 && destination && unitType && (
                <HorizonStep
                  destination={destination}
                  unitType={unitType}
                  years={years}
                  horizons={horizons}
                  onYearsChange={setYears}
                  onBack={() => setStep(1)}
                  onContinue={() => setStep(3)}
                />
              )}
              {step === 3 && destination && unitType && (
                <PotentialStep
                  destination={destination}
                  unitType={unitType}
                  years={years}
                  disclaimer={disclaimer}
                  onEdit={() => setStep(2)}
                  onStartOver={reset}
                  onRequest={() => setStep(4)}
                />
              )}
              {step === 4 && destination && unitType && (
                <RequestStep
                  destination={destination}
                  unitType={unitType}
                  years={years}
                  onBack={() => setStep(3)}
                  onStartOver={reset}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}
