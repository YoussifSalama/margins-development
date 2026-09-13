import Image from "next/image";
import { getTranslations } from "next-intl/server";

type Facts = {
  year: string;
  location: string;
  sector: string;
  size: string;
  status: string;
};

const storyImages = [
  ["/pages/projects/detail/story1-1.png", "/pages/projects/detail/story1-2.png", "/pages/projects/detail/story1-3.png"],
  ["/pages/projects/detail/story2-1.png", "/pages/projects/detail/story2-2.png", "/pages/projects/detail/story2-3.png"],
];

export default async function ProjectStory({
  locale,
  name,
  blurb,
  facts,
}: {
  locale: string;
  name: string;
  blurb: string;
  facts: Facts;
}) {
  const t = await getTranslations({ locale, namespace: "projects" });

  const rows: [string, string][] = [
    [t("facts.year"), facts.year],
    [t("facts.location"), facts.location],
    [t("facts.sector"), facts.sector],
    [t("facts.size"), facts.size],
    [t("facts.status"), facts.status],
  ];

  const blocks = [0, 1].map((i) => ({
    images: storyImages[i],
    heading: t(`story.block${i + 1}.heading`),
    p1: t(`story.block${i + 1}.p1`),
    p2: t(`story.block${i + 1}.p2`),
  }));

  return (
    <section className="container grid gap-16 py-16 lg:grid-cols-[1fr_1.6fr]">
      <div className="flex flex-col gap-4.5 lg:sticky lg:top-32 lg:h-fit">
        <h2 className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] tracking-[2px] text-foreground">{name}</h2>
        <p className="max-w-md text-base leading-[1.4] text-story-text">{blurb}</p>

        <dl className="mt-8 flex flex-col gap-3">
          {rows.map(([label, value]) => (
            <div key={label} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <dt className="text-sm font-medium uppercase tracking-[-0.42px] text-accent">{label}</dt>
                <dd className="text-base font-medium tracking-[-0.64px] text-fact-value">{value}</dd>
              </div>
              <div className="h-px w-full bg-fact-divider" />
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-col gap-10">
        {blocks.map((block, i) => (
          <div key={block.heading} className="flex flex-col gap-10">
            {i > 0 && <div className="h-px w-full bg-story-divider" />}
            <div className="flex flex-col gap-2">
              {block.images.map((src) => (
                <div key={src} className="relative aspect-[3/2] w-full overflow-hidden rounded-xl">
                  <Image src={src} alt="" fill sizes="960px" className="object-cover" />
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <h3 className="text-2xl font-medium tracking-[-1.3px] text-story-heading">{block.heading}</h3>
              <p className="pt-5 text-base leading-[1.4] tracking-[-0.64px] text-story-text">{block.p1}</p>
              <p className="pt-5 text-base leading-[1.4] tracking-[-0.64px] text-story-text">{block.p2}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
