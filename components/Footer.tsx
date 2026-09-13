"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Link, usePathname } from "@/i18n/navigation";
import Button from "@/components/Button";
import MediaBackground from "@/components/MediaBackground";
import { spring, footerItemVariants } from "@/lib/motion";

const MotionLink = motion.create(Link);

const columnKeys = ["navigation", "information", "socials"] as const;

const linkClass = "text-[16px] leading-[24px] tracking-[-0.16px] text-white-80 hover:text-accent";

// ponytail: "#" until real pages exist for these — Contact is the one live route
const columnHrefs: Record<(typeof columnKeys)[number], { href: string; external?: boolean }[]> = {
  navigation: [{ href: "#" }, { href: "#" }, { href: "#" }, { href: "#" }, { href: "#" }],
  information: [{ href: "#" }, { href: "/contact" }, { href: "#" }],
  socials: [
    { href: "https://instagram.com/marginsdevelopment", external: true },
    { href: "https://linkedin.com/company/marginsdevelopment", external: true },
    { href: "https://x.com/marginsdevelopment", external: true },
  ],
};

const CTA_MEDIA =
  "https://customer-v992ht8wqeglys2p.cloudflarestream.com/59601d5cd4816162ef786255ed977700/downloads/default.mp4";

export default function Footer() {
  const t = useTranslations("footer");
  const pathname = usePathname();
  const onContactPage = pathname === "/contact";

  return (
    <footer className="bg-dark text-white">
      <MediaBackground
        src={CTA_MEDIA}
        className="min-h-dvh"
      >
        <div className="flex flex-col items-center justify-end px-6 text-center min-h-dvh py-28">
          <h2 className="max-w-xl text-[clamp(2rem,4vw+1rem,3.5rem)] font-light leading-[1.05] tracking-[2px] font-heading">
            {t("cta")}
          </h2>
          <div className="mt-[31px] flex gap-2">
            {onContactPage ? (
              <Button as="anchor" href="#contact-form" variant="solid">
                {t("contactCta")}
              </Button>
            ) : (
              <Button href="/contact" variant="solid">{t("contactCta")}</Button>
            )}
            <Button href="/about" variant="ghost">{t("aboutCta")}</Button>
          </div>
        </div>
      </MediaBackground>

      <div className="py-16">
        <div className="container">
          {/* row 1: logo */}
          <div className="relative mb-14 h-[49px] w-[336px] max-w-full">
            <Image
              src="/brand/logo.png"
              alt="Margins"
              fill
              sizes="336px"
              className="object-contain object-left invert"
              priority
            />
          </div>

          {/* row 2: body */}
          <div className="flex flex-col gap-14 lg:flex-row lg:justify-between">
            <div className="flex w-full max-w-201.75 flex-col gap-18.25">
              <div className="max-w-110">
                <p className="text-[16px] leading-[24px] tracking-[-0.16px] text-white-80">
                  {t("addressLabel")}
                </p>
                <p className="mt-3 text-[28px] leading-[33.6px] tracking-[-0.56px] text-white">
                  {t("address")}
                </p>
              </div>

              <form className="flex flex-col gap-2.5">
                <label
                  htmlFor="footer-email"
                  className="text-[16px] leading-[24px] tracking-[-0.16px] text-white-80"
                >
                  {t("emailLabel")}
                </label>
                <div className="flex items-center gap-2 rounded-[128px] bg-white-10 py-1.5 ps-6 pe-1.5">
                  <input
                    id="footer-email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    dir="ltr"
                    className="h-14.5 min-w-0 flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-white-80 ltr:text-left rtl:text-right"
                  />
                  <Button
                    as="button"
                    type="submit"
                    variant="light"
                    className="h-14.5 shrink-0 border border-black/10 px-6 py-0 text-[16px] leading-none"
                  >
                    {t("join")}
                  </Button>
                </div>
                <p className="mt-6 text-[16px] leading-[24px] tracking-[-0.16px] text-white-80">
                  {t.rich("disclaimer", {
                    link: (chunks) => (
                      <motion.a
                        href={columnHrefs.information[2].href}
                        className="inline-block underline hover:text-accent"
                        initial="rest"
                        whileHover="hover"
                        variants={footerItemVariants}
                        transition={spring}
                      >
                        {chunks}
                      </motion.a>
                    ),
                  })}
                </p>
              </form>
            </div>

            <div className="flex flex-wrap gap-x-16 gap-y-10">
              {columnKeys.map((key) => (
                <div key={key} className="flex flex-col gap-4">
                  <p className="text-[16px] leading-[24px] tracking-[-0.16px] text-white-80">
                    {t(`columns.${key}.title`)}
                  </p>
                  {t.raw(`columns.${key}.links`).map((link: string, i: number) => {
                    const target = columnHrefs[key][i];
                    return target.external ? (
                      <motion.a
                        key={link}
                        href={target.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                        initial="rest"
                        whileHover="hover"
                        variants={footerItemVariants}
                        transition={spring}
                      >
                        {link}
                      </motion.a>
                    ) : (
                      <MotionLink
                        key={link}
                        href={target.href}
                        className={linkClass}
                        initial="rest"
                        whileHover="hover"
                        variants={footerItemVariants}
                        transition={spring}
                      >
                        {link}
                      </MotionLink>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* row 3: copyright */}
          <p className="mt-16 text-[14px] leading-[21px] tracking-[-0.14px] text-white-80">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
