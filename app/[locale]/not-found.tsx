import * as motion from "motion/react-client";
import StaggerReveal from "@/components/StaggerReveal";
import { fadeUpBounce } from "@/lib/motion";
import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import Button from "@/components/Button";

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "notFound" });

  return (
    <section className="relative isolate flex min-h-[calc(100vh-96px)] items-center justify-center overflow-hidden bg-dark py-24 text-white">
      <Image
        src="/pages/projects/explore/banner.png"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-40"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-dark via-dark/80 to-dark" />

      <StaggerReveal
        stagger={0.15}
        className="container flex flex-col items-center gap-6 text-center"
      >
        <motion.p
          variants={fadeUpBounce}
          className="font-heading text-[120px] leading-none tracking-[2px] text-accent sm:text-[160px]"
        >
          {t("eyebrow")}
        </motion.p>
        <motion.h1
          variants={fadeUpBounce}
          className="max-w-2xl font-heading text-[clamp(1.75rem,4vw+1rem,3rem)] leading-[1.15] tracking-[2px]"
        >
          {t.rich("heading", {
            gold: (chunks) => <span className="text-accent">{chunks}</span>,
          })}
        </motion.h1>
        <motion.p
          variants={fadeUpBounce}
          className="max-w-md text-base leading-6 text-white/70"
        >
          {t("description")}
        </motion.p>

        <motion.div
          variants={fadeUpBounce}
          className="mt-4 flex flex-wrap items-center justify-center gap-4"
        >
          <Button href="/" variant="solid">
            {t("cta")}
          </Button>
          <Button href="/projects" variant="ghost">
            {t("ctaSecondary")}
          </Button>
        </motion.div>
      </StaggerReveal>
    </section>
  );
}
