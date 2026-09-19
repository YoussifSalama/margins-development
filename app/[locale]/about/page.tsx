import { getAboutPage } from "@/server/public/pages";
import { toMetadata } from "@/server/public/seo";
import PageSeoScripts from "@/components/PageSeoScripts";
import RichText from "@/components/RichText";
import Gold from "@/components/Gold";
import * as motion from "motion/react-client";
import PageHero from "@/components/PageHero";
import Marquee from "@/components/Marquee";
import StatCard from "@/components/StatCard";
import StaggerReveal from "@/components/StaggerReveal";
import ChairmanCard from "@/components/ChairmanCard";


// ponytail: Unsplash stand-ins (real estate exteriors) until Margins' own photos land
const heroImage =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80&auto=format&fit=crop";

const statImages = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80&auto=format&fit=crop",
];

const chairmanImages = [
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80&auto=format&fit=crop",
];


// children of a StaggerReveal: fade up in turn (hidden snaps back instantly, off-screen)
const fadeUp = {
  hidden: { opacity: 0, y: 24, transition: { duration: 0 } },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", duration: 0.9, bounce: 0.45 },
  },
} as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/about">) {
  return toMetadata((await getAboutPage((await params).locale)).seo);
}

// One payload (GET /api/pages/about returns the same): SEO, site data and every section.
export default async function About({ params }: PageProps<"/[locale]/about">) {
  const { seo, page } = await getAboutPage((await params).locale);
  const { hero, partners, whoWeAre, stats, statement, chairman } = page;

  return (
    <div className="bg-dark">
      <PageSeoScripts seo={seo} />
      <PageHero title={hero.title} description={hero.description} current={hero.title} image={hero.image || heroImage} />
      {/* bg-dark shows through the rounded top corners — it matches the hero's bottom gradient,
         so the section starts fully below the first screen yet the corners still read */}
      <div className="bg-dark">
        <section className="rounded-t-4xl bg-background pt-8 pb-16 sm:rounded-t-[48px]">
          <Marquee items={partners.map((partner) => ({ label: partner.name, src: partner.logo ?? undefined, alt: partner.name }))} />

          <StaggerReveal className="container mt-16 grid grid-cols-1 gap-x-16 gap-y-6 sm:mt-24 md:grid-cols-[200px_1fr] lg:mt-36">
            <motion.p
              variants={fadeUp}
              className="font-eyebrow text-[14px] leading-[18.2px] tracking-[-0.84px] text-eyebrow md:sticky md:top-24 md:self-start"
            >
              {whoWeAre.eyebrow}
            </motion.p>
            <div>
              <motion.h2
                variants={fadeUp}
                className="text-[30px] font-medium leading-[36px] tracking-[-0.6px] text-foreground"
              >
                <Gold text={whoWeAre.title} />
              </motion.h2>
              <motion.div variants={fadeUp} className="mt-6 text-[18px] leading-[25.2px] text-body">
                <RichText html={whoWeAre.description} />
              </motion.div>
            </div>
          </StaggerReveal>

          <StaggerReveal className="container mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} value={stat.value} label={stat.label} caption={stat.caption} image={stat.image || statImages[i % statImages.length]} />
            ))}
          </StaggerReveal>

          <div className="container mt-24 grid grid-cols-1 gap-x-16 md:grid-cols-[200px_1fr]">
            <div />
            <StaggerReveal>
              <motion.h2
                variants={fadeUp}
                className="text-[30px] font-medium leading-[36px] tracking-[-0.6px] text-title-ink"
              >
                <Gold text={statement.title} />
              </motion.h2>
              <motion.div variants={fadeUp} className="mt-6 text-[18px] leading-[25.2px] text-body">
                <RichText html={statement.description} />
              </motion.div>
            </StaggerReveal>
          </div>

          <div className="container mt-24 grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-3">
            <StaggerReveal className="md:sticky md:top-24 md:self-start">
              <motion.h2
                variants={fadeUp}
                className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] font-light tracking-[2px] text-black"
              >
                {chairman.eyebrow}
                <br />
                <span className="text-accent uppercase">
                  {chairman.title}
                </span>
              </motion.h2>
            </StaggerReveal>
            <div className="flex flex-col gap-16 col-span-2">
              {chairman.people.map((person, i) => (
                <ChairmanCard
                  key={person.name}
                  image={person.image || chairmanImages[i % chairmanImages.length]}
                  name={person.name}
                  credential={person.credential}
                  description={chairman.message}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
