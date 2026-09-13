import { useTranslations, useLocale } from "next-intl";
import { getPosts } from "@/lib/posts";
import HomeHero from "@/components/HomeHero";
import Marquee from "@/components/Marquee";
import ApproachCard from "@/components/ApproachCard";
import AboutStats from "@/components/AboutStats";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import Splash from "@/components/Splash";
import NewsEventsSlide from "@/components/NewsEventsSlide";
import Faq from "@/components/Faq";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

// ponytail: placeholder words until real partner logos land (same stand-ins as about/page.tsx)
const partnerWords = [
  { label: "Crimson Bay™" },
  { label: "Loom & Ledger™" },
  { label: "Orbitale Net™" },
  { label: "Meridian Capital™" },
  { label: "Silverline Holdings™" },
  { label: "Northgate Partners™" },
  { label: "Aurelia Group™" },
  { label: "Bluepeak Ventures™" },
  { label: "Ironwood Estates™" },
  { label: "Solstice Realty™" },
  { label: "Harborstone™" },
  { label: "Vantage Point Co.™" },
];

// ponytail: Unsplash stand-ins (real estate interiors/exteriors) until Margins' own photos land
const approachImages = [
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=80&auto=format&fit=crop",
];

// ponytail: Unsplash stand-ins until real renders for these 4 projects land
const showcaseImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80&auto=format&fit=crop",
];

export default function Home() {
  const t = useTranslations("home");
  const tProjects = useTranslations("projects");
  const locale = useLocale();
  const posts = getPosts(locale);
  const newsSlides = [posts.slice(0, 4), posts.slice(4, 8)].filter((slide) => slide.length > 0);

  return (
    <div className="flex flex-col">
      <Splash />
      <HomeHero
        title={t("title")}
        description={t("subtitle")}
        ctaProjects={t("ctaProjects")}
        ctaAbout={t("ctaAbout")}
        media="/pages/home/hero.png"
      />

      <div className="relative">
        <section className="sticky top-0 z-0 flex flex-col bg-background pt-8 pb-16">
          <Marquee items={partnerWords} />

          <AboutStats
            aboutText={t.rich("aboutText", {
              gold: (chunks) => <span className="text-accent">{chunks}</span>,
            })}
            stats={(["properties", "teams", "transactions", "highestValue"] as const).map((key) => ({
              key,
              value: t(`stats.${key}.value`),
              label: t(`stats.${key}.label`),
            }))}
          />
        </section>

        <section>
          {(() => {
            const showcaseProjects = t
              .raw("projectsShowcase.items")
              .map((item: { title: string; location: string }, i: number) => ({
                ...item,
                eyebrow: t("projectsShowcase.eyebrow"),
                image: showcaseImages[i],
              }));

            return <ProjectsShowcase projects={showcaseProjects} />;
          })()}
        </section>
      </div>

      <section className="bg-dark py-24 lg:py-32">
        <div className="container flex flex-col gap-16 lg:gap-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-24">
            <h2 className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.15] text-white">
              <span className="block">{t("approach.headingLine1")}</span>
              <span className="block text-accent">{t("approach.headingLine2")}</span>
              <span className="block">{t("approach.headingLine3")}</span>
            </h2>
            <div className="flex flex-col gap-6 text-[16px] leading-6 text-white/70">
              <p>{t("approach.description1")}</p>
              <p>{t("approach.description2")}</p>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:gap-10">
            {(["humanCentered", "globalStandards", "designInnovation"] as const).map((key, i) => (
              <ApproachCard
                key={key}
                number={i + 1}
                title={t(`approach.items.${key}.title`)}
                description={t(`approach.items.${key}.description`)}
                image={approachImages[i]}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background pt-16">
        <Carousel opts={{ direction: locale === "ar" ? "rtl" : "ltr" }} className="container flex flex-col gap-10">
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-[clamp(1.75rem,3vw+1rem,2.5rem)] text-foreground">
                {t("newsEvents.headingLine1")} <span className="text-accent">{t("newsEvents.headingLine2")}</span>
              </h2>
              <p className="max-w-md text-[15px] text-muted">{t("newsEvents.description")}</p>
            </div>
            <div className="hidden items-center gap-4 sm:flex">
              <CarouselPrevious variant="light" aria-label={t("newsEvents.headingLine1")} />
              <CarouselNext className="bg-dark" aria-label={t("newsEvents.headingLine2")} />
            </div>
          </div>

          <CarouselContent>
            {newsSlides.map((slide, i) => (
              <CarouselItem key={i} className="w-full">
                <NewsEventsSlide posts={slide} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      <section className="bg-background pt-[195px] pb-24">
        <div className="container">
          <Faq
            heading={tProjects.rich("faqHeading", { gold: (chunks) => <span className="text-accent">{chunks}</span> })}
            description={tProjects("faqDescription")}
            items={tProjects.raw("faq")}
          />
        </div>
      </section>
    </div>
  );
}
