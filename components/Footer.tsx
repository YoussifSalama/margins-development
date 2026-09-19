"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState, type FormEvent } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Link, usePathname } from "@/i18n/navigation";
import Button from "@/components/Button";
import MediaBackground from "@/components/MediaBackground";
import { spring, footerItemVariants } from "@/lib/motion";
import type { Site } from "@/lib/content";
import { subscribeNewsletter } from "@/server/inbox/public";

const MotionLink = motion.create(Link);

const linkClass =
  "text-[16px] leading-[24px] tracking-[-0.16px] text-white-80 hover:text-accent";

// ponytail: FAQ stays "#" — no dedicated page for it yet. Social links come from the CMS.
const columnHrefs: Record<
  "navigation" | "information",
  { href: string; external?: boolean }[]
> = {
  navigation: [
    { href: "/" },
    { href: "/projects" },
    { href: "/media" },
    { href: "/careers" },
    { href: "/calculator" },
  ],
  information: [{ href: "#" }, { href: "/contact" }, { href: "/privacy" }],
};

const socialNames: Record<string, { en: string; ar: string }> = {
  facebook: { en: "Facebook", ar: "فيسبوك" },
  instagram: { en: "Instagram", ar: "إنستغرام" },
  linkedin: { en: "Linkedin", ar: "لينكدإن" },
  x: { en: "Twitter (X)", ar: "تويتر (X)" },
  tiktok: { en: "TikTok", ar: "تيك توك" },
  youtube: { en: "YouTube", ar: "يوتيوب" },
  whatsapp: { en: "WhatsApp", ar: "واتساب" },
};

// fallback until a footer background is uploaded in the CMS (Shared → Site settings → Footer)
const CTA_MEDIA =
  "https://customer-v992ht8wqeglys2p.cloudflarestream.com/59601d5cd4816162ef786255ed977700/downloads/default.mp4";

// `site` = Shared → Site settings in the CMS: one source for the address, socials and footer copy.
export default function Footer({ site }: { site: Site }) {
  const t = useTranslations("footer");
  const locale = useLocale() === "ar" ? "ar" : "en";
  // newsletter: sign-ups land in the CMS under Inbox → Subscribers
  const [newsletter, setNewsletter] = useState<"idle" | "sending" | "done" | "error">("idle");
  async function onSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setNewsletter("sending");
    const result = await subscribeNewsletter({ email: String(data.get("email") ?? ""), website: String(data.get("website") ?? ""), locale }).catch(() => ({ ok: false as const }));
    if (result.ok) form.reset();
    setNewsletter(result.ok ? "done" : "error");
  }

  const [disclaimerBefore, disclaimerLink, disclaimerAfter] = site.footer.newsletterDisclaimer.split(/<\/?link>/);
  const pathname = usePathname();
  const onContactPage = pathname === "/contact";
  const ctaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ctaRef,
    offset: ["start end", "start start"],
  });
  const ctaMinHeight = useTransform(
    scrollYProgress,
    [0, 1],
    ["90dvh", "100dvh"],
  );

  return (
    <footer className="bg-dark text-white">
      {/* scrubbed: 90dvh as it enters the viewport → 100dvh by the time its top reaches the top */}
      <motion.div
        ref={ctaRef}
        style={{ minHeight: ctaMinHeight }}
        className="flex flex-col"
      >
        <MediaBackground src={site.footer.ctaMedia || CTA_MEDIA} className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col items-center justify-end px-6 py-28 text-center">
            <h2 className="max-w-xl text-[clamp(2rem,4vw+1rem,3.5rem)] font-light leading-[1.05] tracking-[2px] font-heading">
              {site.footer.ctaHeading || t("cta")}
            </h2>
            <div className="mt-[31px] flex gap-2">
              {onContactPage ? (
                <Button as="anchor" href="#contact-form" variant="solid">
                  {t("contactCta")}
                </Button>
              ) : (
                <Button href="/contact" variant="solid">
                  {t("contactCta")}
                </Button>
              )}
              <Button href="/about" variant="ghost">
                {t("aboutCta")}
              </Button>
            </div>
          </div>
        </MediaBackground>
      </motion.div>

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
                  {site.contact.address || t("address")}
                </p>
              </div>

              <form onSubmit={onSubscribe} className="flex flex-col gap-2.5">
                <label
                  htmlFor="footer-email"
                  className="text-[16px] leading-[24px] tracking-[-0.16px] text-white-80"
                >
                  {t("emailLabel")}
                </label>
                <div className="flex items-center gap-2 rounded-[128px] bg-white-10 py-1.5 ps-6 pe-1.5">
                  <input
                    id="footer-email"
                    name="email"
                    required
                    autoComplete="email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    dir="ltr"
                    className="h-14.5 min-w-0 flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-white-80 ltr:text-left rtl:text-right"
                  />
                  <Button
                    as="button"
                    type="submit"
                    variant="light"
                    disabled={newsletter === "sending"}
                    className="h-14.5 shrink-0 border border-black/10 px-6 py-0 text-[16px] leading-none"
                  >
                    {newsletter === "sending" ? t("subscribing") : t("join")}
                  </Button>
                </div>
                {/* honeypot — hidden from people and assistive tech, bots fill it */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
                {(newsletter === "done" || newsletter === "error") && (
                  <p role={newsletter === "error" ? "alert" : "status"} className={`mt-2 text-[14px] ${newsletter === "error" ? "text-red-300" : "text-accent"}`}>
                    {newsletter === "done" ? t("subscribed") : t("subscribeError")}
                  </p>
                )}
                <p className="mt-6 text-[16px] leading-[24px] tracking-[-0.16px] text-white-80">
                  {disclaimerBefore}
                  {disclaimerLink && (
                    <MotionLink
                      href={columnHrefs.information[2].href}
                      className="inline-block underline hover:text-accent"
                      initial="rest"
                      whileHover="hover"
                      variants={footerItemVariants}
                      transition={spring}
                    >
                      {disclaimerLink}
                    </MotionLink>
                  )}
                  {disclaimerAfter}
                </p>
              </form>
            </div>

            <div className="flex flex-wrap gap-x-16 gap-y-10">
              {(["navigation", "information"] as const).map((key) => (
                <div key={key} className="flex flex-col gap-4">
                  <p className="text-[16px] leading-[24px] tracking-[-0.16px] text-white-80">
                    {t(`columns.${key}.title`)}
                  </p>
                  {t
                    .raw(`columns.${key}.links`)
                    .map((link: string, i: number) => {
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
              {site.socials.length > 0 && (
                <div className="flex flex-col gap-4">
                  <p className="text-[16px] leading-[24px] tracking-[-0.16px] text-white-80">
                    {t("columns.socials.title")}
                  </p>
                  {site.socials.map((social) => (
                    <motion.a
                      key={social.url}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                      initial="rest"
                      whileHover="hover"
                      variants={footerItemVariants}
                      transition={spring}
                    >
                      {socialNames[social.platform]?.[locale] ?? social.platform}
                    </motion.a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* row 3: copyright */}
          <p className="mt-16 text-[14px] leading-[21px] tracking-[-0.14px] text-white-80">
            {(site.footer.copyright || t("copyright", { year: "{year}" })).replace("{year}", String(new Date().getFullYear()))}
          </p>
        </div>
      </div>
    </footer>
  );
}
