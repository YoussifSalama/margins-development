"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "motion/react";
import Image from "next/image";
import { spring, zoomVariants, cardTextVariants } from "@/lib/motion";

export default function PostCard({
  slug,
  category,
  title,
  date,
  image,
  base = "news",
}: {
  slug: string;
  category: string;
  title: string;
  date: string;
  image: string;
  base?: "news" | "blogs";
}) {
  return (
    <motion.div initial="rest" whileHover="hover" className="flex flex-col gap-4">
      <Link href={`/${base}/${slug}`} className="flex flex-col gap-4">
        <div className="relative aspect-774/512 overflow-hidden rounded-[10px]">
          <motion.div className="absolute inset-0" variants={zoomVariants} transition={spring}>
            <Image
              src={image}
              alt={title}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="rounded-lg object-cover"
            />
          </motion.div>
        </div>
        <span className="inline-flex h-[27px] w-fit items-center justify-center rounded-full bg-accent px-2.75 text-[11px] font-medium text-black">
          {category}
        </span>
        <motion.h3
          className="text-[24px] leading-[26px] font-semibold tracking-[-0.2px] uppercase"
          variants={cardTextVariants}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.h3>
        <p className="text-[12px] leading-[15.6px] tracking-[-0.2px] text-card-ink uppercase">{date}</p>
      </Link>
    </motion.div>
  );
}
