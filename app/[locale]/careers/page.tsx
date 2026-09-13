import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { FiZap, FiUsers, FiHeart, FiAward, FiRefreshCw, FiShield } from "react-icons/fi";
import { getRoles } from "@/lib/careers";
import JobList from "@/components/JobList";
import Breadcrumb from "@/components/Breadcrumb";
import ValueCard from "@/components/ValueCard";

export const metadata = { title: "Careers — Margins" };

// ponytail: Unsplash stand-ins until Margins' own photos land
const heroImage =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80&auto=format&fit=crop";

const collageImages = [
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=900&q=80&auto=format&fit=crop",
];

const valueIcons = {
  innovation: FiZap,
  collaboration: FiUsers,
  empathy: FiHeart,
  excellence: FiAward,
  adaptability: FiRefreshCw,
  accountability: FiShield,
} as const;

export default function Careers() {
  const t = useTranslations("careers");
  const locale = useLocale();
  const roles = getRoles(locale);

  return (
    <div className="bg-dark px-6 text-white">
      <div className="container">
        {/* hero */}
        <div className="pt-24 sm:pt-32 lg:pt-36.25">
          <Breadcrumb items={[{ label: t("title") }]} />

          <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-32">
            <h1 className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] tracking-[2px] lg:max-w-204">
              {t.rich("heroTitle", {
                gold: (chunks) => <span className="text-accent">{chunks}</span>,
              })}
            </h1>
            <p className="text-[18px] leading-8 tracking-[-0.16px] sm:text-[20px] sm:leading-8.75 lg:flex-1">
              {t("heroDescription")}
            </p>
          </div>

          <div className="relative mt-13 aspect-1654/600 w-full overflow-hidden">
            <Image src={heroImage} alt="" fill sizes="100vw" priority className="object-cover" />
          </div>
        </div>

        {/* discover / what sets us apart */}
        <div className="mt-20 text-center sm:mt-32 lg:mt-49">
          <h2 className="mx-auto max-w-4xl font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] tracking-[2px]">
            {t.rich("heroTitle", {
              gold: (chunks) => <span className="text-accent">{chunks}</span>,
            })}
          </h2>
          <p className="mx-auto mt-6.5 max-w-2xl text-white/60">{t("discoverDescription")}</p>
        </div>

        {/* photo collage */}
        <div className="mt-14 flex flex-col items-center gap-6 sm:mt-20 lg:mt-31.5 lg:flex-row lg:items-center lg:justify-center lg:gap-8.5">
          <div className="relative aspect-2/3 w-full max-w-75 shrink-0 overflow-hidden">
            <Image src={collageImages[0]} alt="" fill sizes="300px" className="object-cover" />
          </div>
          <div className="relative aspect-13/17.5 w-full max-w-130 shrink-0 overflow-hidden lg:-mt-8">
            <Image src={collageImages[1]} alt="" fill sizes="520px" className="object-cover" />
          </div>
          <div className="flex w-full max-w-100 shrink-0 flex-col gap-8.75">
            <div className="relative aspect-23/14 w-full overflow-hidden">
              <Image src={collageImages[2]} alt="" fill sizes="400px" className="object-cover" />
            </div>
            <div className="relative aspect-400/322 w-full overflow-hidden">
              <Image src={collageImages[3]} alt="" fill sizes="400px" className="object-cover" />
            </div>
          </div>
        </div>

        {/* currently hiring */}
        <div className="mt-20 sm:mt-32 lg:mt-50.75">
          <h2 className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] tracking-[2px]">
            {t.rich("hiringHeading", {
              gold: (chunks) => <span className="text-accent">{chunks}</span>,
            })}
          </h2>
          <div className="mt-10.5">
            <JobList roles={roles} />
          </div>
        </div>

        {/* values */}
        <div className="mt-32 pb-24 sm:mt-52 lg:mt-83">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-32">
            <h2 className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] tracking-[2px] lg:max-w-204">
              {t.rich("valuesTitle", {
                gold: (chunks) => <span className="text-accent">{chunks}</span>,
              })}
            </h2>
            <p className="text-white/60 lg:flex-1">{t("valuesDescription")}</p>
          </div>

          <div className="mt-20.25 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-41.25 lg:gap-y-25">
            {(Object.keys(valueIcons) as (keyof typeof valueIcons)[]).map((key) => (
              <ValueCard
                key={key}
                icon={valueIcons[key]}
                title={t(`values.${key}.title`)}
                description={t(`values.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
