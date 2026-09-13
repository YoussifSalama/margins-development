"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { spring, zoomVariants } from "@/lib/motion";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

type Unit = { key: string; image: string; title: string };

export default function UnitsSlider({
  units,
  description,
  locale,
  headingLine1,
  headingLine2,
}: {
  units: Unit[];
  description: string;
  locale: string;
  headingLine1: string;
  headingLine2: string;
}) {
  return (
    <Carousel opts={{ direction: locale === "ar" ? "rtl" : "ltr", align: "start" }} className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] tracking-[2px]">
          {headingLine1} <span className="text-accent">{headingLine2}</span>
        </h2>
        <div className="hidden items-center gap-4 sm:flex">
          <CarouselPrevious variant="dark" aria-label={headingLine1} />
          <CarouselNext aria-label={headingLine2} />
        </div>
      </div>

      <CarouselContent className="-ml-4">
        {units.map((unit) => (
          <CarouselItem
            key={unit.key}
            className="w-[min(90vw,684px)] pl-4 sm:w-125 lg:w-171"
          >
            <motion.div
              initial="rest"
              whileHover="hover"
              style={{ aspectRatio: "873 / 705" }}
              className="relative w-full overflow-hidden rounded-lg"
            >
              <motion.div className="absolute inset-0" variants={zoomVariants} transition={spring}>
                <Image
                  src={unit.image}
                  alt={unit.title}
                  fill
                  draggable={false}
                  sizes="890px"
                  className="pointer-events-none object-cover"
                />
              </motion.div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2.5 bg-linear-to-b from-transparent to-black p-8 uppercase tracking-[-0.2px]">
                <p className="text-[32px] font-medium leading-[1.3] text-white">{unit.title}</p>
                <p className="text-xs leading-[1.3] font-normal normal-case text-white">{description}</p>
              </div>
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
