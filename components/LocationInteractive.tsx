"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { FiTruck, FiBookOpen, FiShoppingBag, FiCoffee, FiMapPin, FiCheckCircle } from "react-icons/fi";
import Button from "@/components/Button";
import { spring, shiftVariants, lightTextVariants } from "@/lib/motion";

const icons = { transport: FiTruck, education: FiBookOpen, shopping: FiShoppingBag, food: FiCoffee };

type PlaceItem = { name: string; distance: string };
type Category = { key: keyof typeof icons; label: string; places: PlaceItem[] };
type Feature = { key: string; label: string };

export default function LocationInteractive({
  locationLine1,
  locationLine2,
  locationDescription,
  facilitiesLine1,
  facilitiesLine2,
  facilitiesDescription,
  categories,
  features,
  openMapHref,
  openMapLabel,
}: {
  locationLine1: string;
  locationLine2: string;
  locationDescription: string;
  facilitiesLine1: string;
  facilitiesLine2: string;
  facilitiesDescription: string;
  categories: Category[];
  features: Feature[];
  openMapHref: string;
  openMapLabel: string;
}) {
  const [active, setActive] = useState(0);
  const activeCategory = categories[active];

  return (
    <div className="grid gap-16 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] tracking-[2px]">
            {locationLine1} <span className="text-accent">{locationLine2}</span>
          </h2>
          <p className="mt-2 text-base text-story-text">{locationDescription}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((category, i) => {
            const Icon = icons[category.key];
            const isActive = i === active;
            return (
              <motion.button
                key={category.key}
                type="button"
                onClick={() => setActive(i)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={spring}
                className={`flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent text-dark"
                    : "border border-white-10 text-pill-muted hover:border-accent hover:text-accent"
                }`}
              >
                <Icon className="size-4" />
                {category.label}
              </motion.button>
            );
          })}
        </div>

        <div className="relative aspect-919/315 w-full overflow-hidden rounded-lg">
          <Image src="/pages/projects/location/map.png" alt="" fill sizes="920px" className="object-cover" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory.key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 gap-x-11 gap-y-6 text-base tracking-[-0.32px] sm:grid-cols-2 lg:grid-cols-3"
          >
            {activeCategory.places.map((place) => (
              <motion.div
                key={place.name}
                initial="rest"
                whileHover="hover"
                className="flex flex-col gap-2"
              >
                <motion.p variants={shiftVariants} transition={spring}>
                  {place.name}
                </motion.p>
                <p className="font-bold text-accent">{place.distance}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <Button
          as="anchor"
          href={openMapHref}
          target="_blank"
          rel="noopener noreferrer"
          variant="solid"
          className="w-full"
        >
          <FiMapPin className="me-2 size-4" />
          {openMapLabel}
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] tracking-[2px]">
            {facilitiesLine1} <span className="text-accent">{facilitiesLine2}</span>
          </h2>
          <p className="mt-2 text-base text-story-text">{facilitiesDescription}</p>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-4">
          {features.map((feature) => (
            <motion.div
              key={feature.key}
              initial="rest"
              whileHover="hover"
              className="flex items-center gap-3"
            >
              <motion.span variants={{ rest: { scale: 1 }, hover: { scale: 1.15 } }} transition={spring}>
                <FiCheckCircle className="size-6 text-accent" />
              </motion.span>
              <motion.p variants={lightTextVariants} transition={{ duration: 0.2 }} className="text-xl tracking-[-0.4px]">
                {feature.label}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
