import { getTranslations } from "next-intl/server";
import { FaLinkedinIn } from "react-icons/fa6";
import { getContactPage } from "@/server/public/pages";
import { toMetadata } from "@/server/public/seo";
import PageSeoScripts from "@/components/PageSeoScripts";
import {
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import ContactInfoRow from "@/components/ContactInfoRow";
import ContactFormCard from "@/components/ContactFormCard";


const heroImage = "/pages/contact/hero.jpg";

const methodIcons = {
  whatsapp: FaWhatsapp,
  email: FiMail,
  phone: FiPhone,
  location: FiMapPin,
} as const;

// the links come from the CMS (Shared → Site settings → Social links); this only maps a platform to its icon
const socialIcons: Record<string, typeof FaFacebookF> = {
  facebook: FaFacebookF, instagram: FaInstagram, tiktok: FaTiktok, x: FaXTwitter, whatsapp: FaWhatsapp, youtube: FaYoutube, linkedin: FaLinkedinIn,
};

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">) {
  return toMetadata((await getContactPage((await params).locale)).seo);
}

// One payload (GET /api/pages/contact returns the same): SEO, site data (phone, email, address,
// socials), the page copy and the unit types for the form.
export default async function Contact({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  const { seo, site, page } = await getContactPage(locale);
  const { hero, form, unitTypes } = page;
  // labels are UI strings; the values are the company's real details from the CMS
  const methods = { whatsapp: site.contact.whatsapp, email: site.contact.email, phone: site.contact.phone, location: site.contact.address };

  return (
    <div>
      <PageSeoScripts seo={seo} />
      <PageHero title={hero.title} description={hero.description} current={hero.title} image={hero.image || heroImage} />

      <section
        className="bg-dark bg-cover bg-center py-16 lg:py-24"
        style={{
          backgroundImage:
            `linear-gradient(var(--dark-overlay), var(--dark-overlay)), url(${form.backgroundImage || "/pages/contact/contact-form-bg.jpg"})`,
        }}
      >
        <div className="container grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <Reveal>
              <h2 className="max-w-2xl whitespace-pre-line font-heading text-[clamp(2.5rem,4vw+2rem,6rem)] leading-[1.05] font-normal tracking-[-2.16px] text-accent">
                {form.title}
              </h2>
            </Reveal>

            <div className="mt-16 flex flex-col gap-7.5">
              {(["whatsapp", "email", "phone", "location"] as const).filter((key) => methods[key]).map(
                (key, i) => (
                  <Reveal key={key} delay={i * 0.1} amount={0.5}>
                    <ContactInfoRow
                      icon={methodIcons[key]}
                      label={t(`methods.${key}.label`)}
                      value={methods[key]}
                    />
                  </Reveal>
                ),
              )}
            </div>

            <Reveal className="mt-14">
              <p className="font-heading text-[16px] leading-6 text-white">
                {t("followUsOn")}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {site.socials.filter((social) => socialIcons[social.platform]).map((social) => {
                  const Icon = socialIcons[social.platform];
                  return (
                  <a
                    key={social.url}
                    href={social.url}
                    aria-label={social.platform}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-14 items-center justify-center rounded-full border border-accent text-accent hover:bg-accent hover:text-white"
                  >
                    <Icon className="size-5" />
                  </a>
                  );
                })}
              </div>
            </Reveal>
          </div>

          <div
            id="contact-form"
            className="flex scroll-mt-24 justify-center lg:justify-end"
          >
            <Reveal
              delay={0.2}
              amount={0.1}
              className="flex w-full justify-center lg:justify-end"
            >
              <ContactFormCard title={form.cardTitle} unitTypes={unitTypes} />
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
