import { useTranslations } from "next-intl";
import PageHero from "@/components/PageHero";
import Marquee from "@/components/Marquee";
import StatCard from "@/components/StatCard";
import ChairmanCard from "@/components/ChairmanCard";

export const metadata = { title: "About — Margins" };

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

// ponytail: placeholder words until real partner logos land
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

export default function About() {
  const t = useTranslations("about");

  return (
    <div>
      <PageHero
        title={t("heroTitle")}
        description={t("heroDescription")}
        current={t("heroTitle")}
        image={heroImage}
      />
      <section className="bg-background py-16">
        <Marquee items={partnerWords} />

        <div className="container mt-16 grid grid-cols-1 gap-x-16 gap-y-6 sm:mt-24 md:grid-cols-[200px_1fr] lg:mt-36">
          <p className="font-eyebrow text-[14px] leading-[18.2px] tracking-[-0.84px] text-eyebrow">
            {t("whoWeAre")}
          </p>
          <div>
            <h2 className="text-[30px] font-medium leading-[36px] tracking-[-0.6px] text-foreground">
              {t.rich("section2Title", {
                gold: (chunks) => <span className="text-accent">{chunks}</span>,
              })}
            </h2>
            <p className="mt-6 whitespace-pre-line text-[18px] leading-[25.2px] text-body">
              {t("section2Description")}
            </p>
          </div>
        </div>

        <div className="container mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(["homes", "satisfaction", "neighborhoods"] as const).map((key, i) => (
            <StatCard
              key={key}
              value={t(`stats.${key}.value`)}
              label={t(`stats.${key}.label`)}
              caption={t(`stats.${key}.caption`)}
              image={statImages[i]}
            />
          ))}
        </div>

        <div className="container mt-24 grid grid-cols-1 gap-x-16 md:grid-cols-[200px_1fr]">
          <div />
          <div >
            <h2 className="text-[30px] font-medium leading-[36px] tracking-[-0.6px] text-title-ink">
              {t.rich("section3Title", {
                gold: (chunks) => <span className="text-accent">{chunks}</span>,
              })}
            </h2>
            <p className="mt-6 text-[18px] leading-[25.2px] text-body">
              {t("section3Description")}
            </p>
          </div>
        </div>

        <div className="container mt-24 grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-3">
          <h2 className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] font-light tracking-[2px] text-black">
            {t("chairman.eyebrow")}
            <br />
            <span className="text-accent uppercase">{t("chairman.title")}</span>
          </h2>
          <div className="flex flex-col gap-16 col-span-2">
            {t.raw("chairman.people").map((person: { name: string; credential: string }, i: number) => (
              <ChairmanCard
                key={person.name}
                image={chairmanImages[i]}
                name={person.name}
                credential={person.credential}
                description={t("chairman.description")}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
