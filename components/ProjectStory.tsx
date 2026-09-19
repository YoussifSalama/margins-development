import Image from "next/image";
import * as motion from "motion/react-client";
import Reveal from "@/components/Reveal";
import StaggerReveal from "@/components/StaggerReveal";
import { fadeUpBounce } from "@/lib/motion";
import { getTranslations } from "next-intl/server";

type Facts = {
  year: string;
  location: string;
  sector: string;
  size: string;
  status: string;
};

export default async function ProjectStory({
  locale,
  name,
  blurb,
  facts,
  blocks,
}: {
  locale: string;
  name: string;
  blurb: string;
  facts: Facts;
  /** the project's own story blocks from the CMS (heading, paragraphs, a column of images) */
  blocks: { heading: string; paragraphs: string[]; images: string[] }[];
}) {
  const t = await getTranslations({ locale, namespace: "projects" });

  const rows: [string, string][] = [
    [t("facts.year"), facts.year],
    [t("facts.location"), facts.location],
    [t("facts.sector"), facts.sector],
    [t("facts.size"), facts.size],
    [t("facts.status"), facts.status],
  ];

  return (
    <section className="container grid gap-16 py-16 lg:grid-cols-[1fr_1.6fr]">
      <StaggerReveal
        stagger={0.1}
        className="flex flex-col gap-4.5 lg:sticky lg:top-32 lg:h-fit"
      >
        <motion.h2
          variants={fadeUpBounce}
          className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] tracking-[2px] text-foreground"
        >
          {name}
        </motion.h2>
        <motion.p
          variants={fadeUpBounce}
          className="max-w-md text-base leading-[1.4] text-story-text"
        >
          {blurb}
        </motion.p>

        <dl className="mt-8 flex flex-col gap-3">
          {rows.map(([label, value]) => (
            <motion.div
              key={label}
              variants={fadeUpBounce}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <dt className="text-sm font-medium uppercase tracking-[-0.42px] text-accent">
                  {label}
                </dt>
                <dd className="text-base font-medium tracking-[-0.64px] text-fact-value">
                  {value}
                </dd>
              </div>
              <div className="h-px w-full bg-fact-divider" />
            </motion.div>
          ))}
        </dl>
      </StaggerReveal>

      <div className="flex flex-col gap-10">
        {blocks.map((block, i) => (
          <div key={block.heading} className="flex flex-col gap-10">
            {i > 0 && <div className="h-px w-full bg-story-divider" />}
            <div className="flex flex-col gap-2">
              {block.images.map((src) => (
                <Reveal
                  key={src}
                  className="relative aspect-[3/2] w-full overflow-hidden rounded-xl"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="960px"
                    className="object-cover"
                  />
                </Reveal>
              ))}
            </div>
            <Reveal amount={0.4} className="flex flex-col">
              <h3 className="text-2xl font-medium tracking-[-1.3px] text-story-heading">
                {block.heading}
              </h3>
              {block.paragraphs.map((paragraph) => (
                <p key={paragraph} className="pt-5 text-base leading-[1.4] tracking-[-0.64px] text-story-text">
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
