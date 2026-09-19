import { getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";
import { getHomePage } from "@/server/public/pages";
import { toMetadata } from "@/server/public/seo";
import PageSeoScripts from "@/components/PageSeoScripts";
import RichText from "@/components/RichText";
import Gold from "@/components/Gold";
import { fadeUpBounce } from "@/lib/motion";
import StaggerReveal from "@/components/StaggerReveal";
import HomeHero from "@/components/HomeHero";
import Marquee from "@/components/Marquee";
import ApproachStack from "@/components/ApproachStack";
import AboutStats from "@/components/AboutStats";
import RisingBackdrop from "@/components/RisingBackdrop";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import Splash from "@/components/Splash";
import NewsEventsSlide from "@/components/NewsEventsSlide";
import Faq from "@/components/Faq";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
  return toMetadata((await getHomePage((await params).locale)).seo);
}

// Everything on this page comes from ONE payload (GET /api/pages/home returns the same):
// SEO, site data and every section. Only button labels stay in the translation files.
export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const { seo, page } = await getHomePage(locale);
  const { hero, partners, about, showcase, approach, feed, faq } = page;
  // the news carousel shows four posts per slide
  const newsSlides = Array.from({ length: Math.ceil(feed.posts.length / 4) }, (_, i) => feed.posts.slice(i * 4, i * 4 + 4));

  return (
    <div className="flex flex-col">
      <PageSeoScripts seo={seo} />
      <Splash />
      <HomeHero
        title={hero.title}
        description={hero.subtitle}
        ctaProjects={t("ctaProjects")}
        ctaAbout={t("ctaAbout")}
        media={hero.media || "/pages/home/hero.png"}
      />

      <div className="relative">
        <section className="sticky top-0 z-0 flex flex-col bg-background pt-8 pb-16">
          <Marquee items={partners.map((partner) => ({ label: partner.name, src: partner.logo ?? undefined, alt: partner.name }))} />

          <AboutStats
            aboutText={<Gold text={about.text} />}
            stats={about.stats.map((stat, i) => ({ key: String(i), value: stat.value, label: stat.label }))}
          />
        </section>

        <section>
          {(() => {
            // Home only picks WHICH projects and their order (CMS → Pages → Home → Projects showcase);
            // the projects themselves are the real ones from Content → Projects
            const showcaseProjects = showcase.projects.map((project) => ({
              title: project.name,
              location: project.location,
              eyebrow: showcase.eyebrow,
              image: project.image,
            }));

            return (
              <ProjectsShowcase projects={showcaseProjects}>
                <section className="rounded-t-4xl bg-dark py-24 sm:rounded-t-[48px] lg:py-32">
                  <ApproachStack
                    intro={
                      <StaggerReveal className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-24">
                        <motion.h2
                          variants={fadeUpBounce}
                          className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.15] text-white"
                        >
                          <Gold text={approach.heading} />
                        </motion.h2>
                        <motion.div variants={fadeUpBounce} className="text-[16px] leading-6 text-white/70">
                          <RichText html={approach.description} />
                        </motion.div>
                      </StaggerReveal>
                    }
                    items={approach.items.map((item, i) => ({ number: i + 1, ...item }))}
                  />
                </section>
              </ProjectsShowcase>
            );
          })()}
        </section>
      </div>

      <section className="relative isolate bg-dark pt-16">
        <RisingBackdrop className="bg-background" />
        <Carousel opts={{ direction: locale === "ar" ? "rtl" : "ltr" }} className="container flex flex-col gap-10">
          <div className="flex items-start justify-between gap-6">
            <StaggerReveal className="flex flex-col gap-2">
              <motion.h2
                variants={fadeUpBounce}
                className="font-heading text-[clamp(1.75rem,3vw+1rem,2.5rem)] text-foreground"
              >
                <Gold text={feed.heading} />
              </motion.h2>
              <motion.div variants={fadeUpBounce} className="max-w-md text-[15px] text-muted">
                <RichText html={feed.description} />
              </motion.div>
            </StaggerReveal>
            <div className="hidden items-center gap-4 sm:flex">
              <CarouselPrevious variant="light" aria-label={t("newsEvents.previous")} />
              <CarouselNext className="bg-dark" aria-label={t("newsEvents.next")} />
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
            heading={<Gold text={faq.heading} />}
            description={faq.description}
            items={faq.items}
          />
        </div>
      </section>
    </div>
  );
}
