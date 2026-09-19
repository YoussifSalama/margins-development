import Image from "next/image";
import { getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";
import Reveal from "@/components/Reveal";
import StaggerReveal from "@/components/StaggerReveal";
import { fadeUpBounce } from "@/lib/motion";
import type { Company } from "@/lib/content";
import RichText from "@/components/RichText";
import Gold from "@/components/Gold";

// `company` = Shared → Company in the CMS (vision, mission, banner, values) — part of the projects page payload
export default async function ProjectsExplore({ locale, company }: { locale: string; company: Company }) {
  const t = await getTranslations({ locale, namespace: "projects" });
  const { vision, mission, banner, values } = company;

  return (
    <section className="rounded-t-2xl bg-dark py-24 text-white">
      <div className="container flex flex-col gap-10">
        <Reveal>
          <h2 className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] tracking-[2px]">
            {t("exploreLine1")}
            <br />
            <span className="text-accent uppercase">{t("exploreLine2")}</span>
          </h2>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal className="flex min-h-64 flex-col justify-between gap-10 border border-white-10 p-8.5 sm:min-h-80 lg:col-span-2 lg:min-h-103">
            <p className="font-heading text-4xl tracking-[-0.56px] text-accent">
              {vision.title}
            </p>
            <RichText html={vision.description} className="text-lg leading-[1.45] text-panel-text" />
          </Reveal>
          <Reveal className="flex min-h-64 items-center justify-center border border-white-10 p-8.5 sm:min-h-80 lg:min-h-103">
            <div className="relative aspect-408/318 w-full max-w-102">
              <Image
                src={vision.image || "/pages/projects/explore/floorplan-1.png"}
                alt=""
                fill
                sizes="(min-width: 1024px) 408px, 40vw"
                className="object-contain"
              />
            </div>
          </Reveal>

          <Reveal className="flex min-h-64 items-center justify-center border border-white-10 p-8.5 sm:min-h-80 lg:order-3 lg:min-h-103">
            <div className="relative aspect-408/318 w-full max-w-102">
              <Image
                src={mission.image || "/pages/projects/explore/floorplan-2.png"}
                alt=""
                fill
                sizes="(min-width: 1024px) 408px, 40vw"
                className="object-contain"
              />
            </div>
          </Reveal>
          <Reveal className="flex min-h-64 flex-col justify-between gap-10 border border-white-10 p-8.5 sm:min-h-80 lg:order-4 lg:col-span-2 lg:min-h-103">
            <p className="font-heading text-4xl tracking-[-0.56px] text-accent">
              {mission.title}
            </p>
            <RichText html={mission.description} className="text-lg leading-[1.45] text-panel-text" />
          </Reveal>
        </div>
      </div>

      <div className="relative mt-24 h-90 w-full overflow-hidden sm:h-110 lg:h-137">
        <Image
          src={banner.image || "/pages/projects/explore/banner.png"}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-banner-grad-start to-banner-grad-end opacity-79" />
        <StaggerReveal className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
          <motion.p
            variants={fadeUpBounce}
            className="text-sm font-medium tracking-[-0.84px]"
          >
            {banner.eyebrow}
          </motion.p>
          <motion.p
            variants={fadeUpBounce}
            className="text-[clamp(2.5rem,6vw,80px)] leading-tight tracking-[-3.2px]"
          >
            {banner.title}
          </motion.p>
        </StaggerReveal>
      </div>

      <div className="container mt-24 grid gap-10 lg:grid-cols-2">
        <Reveal className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] tracking-[2px]">
            <Gold text={values.heading} className="text-accent uppercase" />
          </h2>
        </Reveal>

        <div className="flex flex-col">
          {values.items.map((value) => (
            <Reveal
              key={value.title}
              amount={0.5}
              className="flex flex-col gap-3 border-b border-white-7 py-6 last:border-none"
            >
              <p className="font-heading text-2xl tracking-[-0.48px] text-accent">
                {value.title}
              </p>
              <RichText html={value.description} className="text-base leading-[1.5] text-value-text" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
