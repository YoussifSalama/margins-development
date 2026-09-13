import Image from "next/image";
import { getTranslations } from "next-intl/server";

const valueKeys = ["integrity", "people", "opportunities", "excellence", "helping"] as const;

export default async function ProjectsExplore({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "projects" });

  return (
    <section className="rounded-t-2xl bg-dark py-24 text-white">
      <div className="container flex flex-col gap-10">
        <h2 className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] tracking-[2px]">
          {t("exploreLine1")}
          <br />
          <span className="text-accent uppercase">{t("exploreLine2")}</span>
        </h2>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="flex min-h-64 flex-col justify-between gap-10 border border-white-10 p-8.5 sm:min-h-80 lg:col-span-2 lg:min-h-103">
            <p className="font-heading text-4xl tracking-[-0.56px] text-accent">{t("vision.title")}</p>
            <p className="text-lg leading-[1.45] text-panel-text">{t("vision.description")}</p>
          </div>
          <div className="flex min-h-64 items-center justify-center border border-white-10 p-8.5 sm:min-h-80 lg:min-h-103">
            <div className="relative aspect-408/318 w-full max-w-102">
              <Image src="/pages/projects/explore/floorplan-1.png" alt="" fill sizes="(min-width: 1024px) 408px, 40vw" className="object-contain" />
            </div>
          </div>

          <div className="flex min-h-64 items-center justify-center border border-white-10 p-8.5 sm:min-h-80 lg:order-3 lg:min-h-103">
            <div className="relative aspect-408/318 w-full max-w-102">
              <Image src="/pages/projects/explore/floorplan-2.png" alt="" fill sizes="(min-width: 1024px) 408px, 40vw" className="object-contain" />
            </div>
          </div>
          <div className="flex min-h-64 flex-col justify-between gap-10 border border-white-10 p-8.5 sm:min-h-80 lg:order-4 lg:col-span-2 lg:min-h-103">
            <p className="font-heading text-4xl tracking-[-0.56px] text-accent">{t("mission.title")}</p>
            <p className="text-lg leading-[1.45] text-panel-text">{t("mission.description")}</p>
          </div>
        </div>
      </div>

      <div className="relative mt-24 h-90 w-full overflow-hidden sm:h-110 lg:h-137">
        <Image src="/pages/projects/explore/banner.png" alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-banner-grad-start to-banner-grad-end opacity-79" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
          <p className="text-sm font-medium tracking-[-0.84px]">{t("bannerEyebrow")}</p>
          <p className="text-[clamp(2.5rem,6vw,80px)] leading-tight tracking-[-3.2px]">{t("bannerTitle")}</p>
        </div>
      </div>

      <div className="container mt-24 grid gap-10 lg:grid-cols-2">
        <h2 className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] tracking-[2px]">
          {t("exploreLine1")}
          <br />
          <span className="text-accent uppercase">{t("valuesLine2")}</span>
        </h2>

        <div className="flex flex-col">
          {valueKeys.map((key) => (
            <div key={key} className="flex flex-col gap-3 border-b border-white-7 py-6 last:border-none">
              <p className="font-heading text-2xl tracking-[-0.48px] text-accent">{t(`values.${key}.title`)}</p>
              <p className="text-base leading-[1.5] text-value-text">{t(`values.${key}.description`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
