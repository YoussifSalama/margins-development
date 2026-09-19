import { getTranslations } from "next-intl/server";
import { getCalculatorPage } from "@/server/public/pages";
import { toMetadata } from "@/server/public/seo";
import PageSeoScripts from "@/components/PageSeoScripts";
import Gold from "@/components/Gold";
import * as motion from "motion/react-client";
import StaggerReveal from "@/components/StaggerReveal";
import { fadeUpBounce } from "@/lib/motion";
import InvestmentCalculator from "@/components/calculator/InvestmentCalculator";


export async function generateMetadata({ params }: PageProps<"/[locale]/calculator">) {
  return toMetadata((await getCalculatorPage((await params).locale)).seo);
}

// One payload (GET /api/pages/calculator returns the same): SEO, site data, the intro copy and
// everything the wizard needs — projects, units, prices, horizons and assumptions from the CMS.
export default async function CalculatorPage({ params }: PageProps<"/[locale]/calculator">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "calculator" });
  const { seo, page } = await getCalculatorPage(locale);
  const { intro, disclaimer, destinations, horizons, defaultHorizon } = page;

  return (
    <div className="bg-background py-24 sm:py-28">
      <PageSeoScripts seo={seo} />
      <StaggerReveal
        stagger={0.15}
        className="container flex flex-col items-center gap-4 text-center"
      >
        <motion.p
          variants={fadeUpBounce}
          className="font-eyebrow text-[13px] tracking-[2px] text-accent uppercase"
        >
          {intro.eyebrow || t("eyebrow")}
        </motion.p>
        <motion.h1
          variants={fadeUpBounce}
          className="font-heading text-[clamp(2.5rem,4vw+1rem,3.5rem)] text-foreground"
        >
          <Gold text={intro.heading} />
        </motion.h1>
        <motion.p
          variants={fadeUpBounce}
          className="max-w-xl text-base text-muted"
        >
          {intro.subtitle || t("subtitle")}
        </motion.p>
      </StaggerReveal>

      <div className="container mt-16">
        {destinations.length > 0 ? (
          <InvestmentCalculator destinations={destinations} horizons={horizons} defaultHorizon={defaultHorizon} disclaimer={disclaimer} />
        ) : (
          <p className="mx-auto max-w-md text-center text-base text-muted">{t("empty")}</p>
        )}
      </div>
    </div>
  );
}
