import * as motion from "motion/react-client";
import Reveal from "@/components/Reveal";
import StaggerReveal from "@/components/StaggerReveal";
import { fadeUpBounce } from "@/lib/motion";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import {
  FiZap,
  FiUsers,
  FiHeart,
  FiAward,
  FiRefreshCw,
  FiShield,
} from "react-icons/fi";
import { getCareersPage } from "@/server/public/pages";
import { toMetadata } from "@/server/public/seo";
import PageSeoScripts from "@/components/PageSeoScripts";
import RichText from "@/components/RichText";
import Gold from "@/components/Gold";
import JobList from "@/components/JobList";
import Breadcrumb from "@/components/Breadcrumb";
import ValueCard from "@/components/ValueCard";


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

export async function generateMetadata({ params }: PageProps<"/[locale]/careers">) {
  return toMetadata((await getCareersPage((await params).locale)).seo);
}

// One payload (GET /api/pages/careers returns the same): SEO, site data, the page copy and the open jobs.
export default async function Careers({ params }: PageProps<"/[locale]/careers">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "careers" });
  const { seo, page } = await getCareersPage(locale);
  const { hero, discover, hiring, jobs, values } = page;
  const icons = Object.values(valueIcons);

  return (
    <div className="bg-dark px-6 text-white">
      <PageSeoScripts seo={seo} />
      <div className="container">
        {/* hero */}
        <div className="pt-24 sm:pt-32 lg:pt-36.25">
          <Breadcrumb items={[{ label: t("title") }]} />

          <StaggerReveal className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-32">
            <motion.h1
              variants={fadeUpBounce}
              className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] tracking-[2px] lg:max-w-204"
            >
              <Gold text={hero.title} />
            </motion.h1>
            <motion.div
              variants={fadeUpBounce}
              className="text-[18px] leading-8 tracking-[-0.16px] sm:text-[20px] sm:leading-8.75 lg:flex-1"
            >
              <RichText html={hero.description} />
            </motion.div>
          </StaggerReveal>

          <Reveal
            delay={0.3}
            className="relative mt-13 aspect-1654/600 w-full overflow-hidden"
          >
            <Image
              src={hero.image || heroImage}
              alt=""
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          </Reveal>
        </div>

        {/* discover / what sets us apart */}
        <StaggerReveal className="mt-20 text-center sm:mt-32 lg:mt-49">
          <motion.h2
            variants={fadeUpBounce}
            className="mx-auto max-w-4xl font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] tracking-[2px]"
          >
            <Gold text={discover.title} />
          </motion.h2>
          <motion.div
            variants={fadeUpBounce}
            className="mx-auto mt-6.5 max-w-2xl text-white/60"
          >
            <RichText html={discover.description} />
          </motion.div>
        </StaggerReveal>

        {/* photo collage */}
        <div className="mt-14 flex flex-col items-center gap-6 sm:mt-20 lg:mt-31.5 lg:flex-row lg:items-center lg:justify-center lg:gap-8.5">
          <Reveal
            delay={0}
            className="relative aspect-2/3 w-full max-w-75 shrink-0 overflow-hidden"
          >
            <Image
              src={discover.images[0] ?? collageImages[0]}
              alt=""
              fill
              sizes="300px"
              className="object-cover"
            />
          </Reveal>
          <Reveal
            delay={0.12}
            className="relative aspect-13/17.5 w-full max-w-130 shrink-0 overflow-hidden lg:-mt-8"
          >
            <Image
              src={discover.images[1] ?? collageImages[1]}
              alt=""
              fill
              sizes="520px"
              className="object-cover"
            />
          </Reveal>
          <div className="flex w-full max-w-100 shrink-0 flex-col gap-8.75">
            <Reveal
              delay={0.24}
              className="relative aspect-23/14 w-full overflow-hidden"
            >
              <Image
                src={discover.images[2] ?? collageImages[2]}
                alt=""
                fill
                sizes="400px"
                className="object-cover"
              />
            </Reveal>
            <Reveal
              delay={0.36}
              className="relative aspect-400/322 w-full overflow-hidden"
            >
              <Image
                src={discover.images[3] ?? collageImages[3]}
                alt=""
                fill
                sizes="400px"
                className="object-cover"
              />
            </Reveal>
          </div>
        </div>

        {/* currently hiring */}
        <div className="mt-20 sm:mt-32 lg:mt-50.75">
          <Reveal>
            <h2 className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] tracking-[2px]">
              <Gold text={hiring.heading} />
            </h2>
          </Reveal>
          <div className="mt-10.5">
            <JobList roles={jobs} />
          </div>
        </div>

        {/* values */}
        <div className="mt-32 pb-24 sm:mt-52 lg:mt-83">
          <StaggerReveal className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-32">
            <motion.h2
              variants={fadeUpBounce}
              className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.05] tracking-[2px] lg:max-w-204"
            >
              <Gold text={values.title} />
            </motion.h2>
            <motion.div
              variants={fadeUpBounce}
              className="text-white/60 lg:flex-1"
            >
              <RichText html={values.description} />
            </motion.div>
          </StaggerReveal>

          <div className="mt-20.25 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-41.25 lg:gap-y-25">
            {values.items.map(
              (value, i) => (
                <Reveal key={value.title} delay={(i % 3) * 0.12}>
                  <ValueCard
                    icon={icons[i % icons.length]}
                    title={value.title}
                    description={value.description}
                  />
                </Reveal>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
