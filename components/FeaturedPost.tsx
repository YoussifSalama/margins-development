"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "motion/react";
import Image from "next/image";
import { spring, zoomVariants, accentTextVariants } from "@/lib/motion";

export default function FeaturedPost({
  href,
  category,
  title,
  excerpt,
  date,
  image,
}: {
  href: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}) {
  return (
    <motion.div initial="rest" whileHover="hover">
      <Link href={href} className="flex flex-col items-center gap-8 lg:flex-row">
        <div className="relative aspect-770/467 w-full shrink-0 overflow-hidden rounded-2xl lg:w-[48%]">
          <motion.div className="absolute inset-0" variants={zoomVariants} transition={spring}>
            <Image
              src={image}
              alt={title}
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </div>

        <div className="flex flex-1 flex-col gap-8">
          <div className="flex flex-col gap-4">
            <span className="inline-flex h-[27px] w-fit items-center justify-center rounded-full bg-accent px-2.75 text-[11px] font-medium text-black">
              {category}
            </span>
            <motion.h2
              className="font-heading text-[40px] leading-[48px] tracking-[-1.6px]"
              variants={accentTextVariants}
              transition={{ duration: 0.2 }}
            >
              {title}
            </motion.h2>
          </div>
          <p className="text-[16px] leading-6 tracking-[-0.16px] text-foreground/70">{excerpt}</p>
          <p className="text-[12px] leading-[15.6px] tracking-[-0.2px] text-card-ink uppercase">{date}</p>
        </div>
      </Link>
    </motion.div>
  );
}
