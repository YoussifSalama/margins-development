import { useTranslations } from "next-intl";
import { FaWhatsapp, FaFacebookF, FaInstagram, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import PageHero from "@/components/PageHero";
import ContactInfoRow from "@/components/ContactInfoRow";
import ContactFormCard from "@/components/ContactFormCard";

export const metadata = { title: "Contact — Margins" };

const heroImage = "/pages/contact/hero.jpg";

const methodIcons = { whatsapp: FaWhatsapp, email: FiMail, phone: FiPhone, location: FiMapPin } as const;

// ponytail: "#" until real social profiles exist
const socials = [
  { icon: FaFacebookF, href: "https://facebook.com/marginsdevelopment" },
  { icon: FaInstagram, href: "https://instagram.com/marginsdevelopment" },
  { icon: FaTiktok, href: "https://tiktok.com/@marginsdevelopment" },
  { icon: FaXTwitter, href: "https://x.com/marginsdevelopment" },
  { icon: FaWhatsapp, href: "https://wa.me/201012877474" },
  { icon: FaYoutube, href: "https://youtube.com/@marginsdevelopment" },
];

export default function Contact() {
  const t = useTranslations("contact");

  return (
    <div>
      <PageHero
        title={t("heroTitle")}
        description={t("heroDescription")}
        current={t("heroTitle")}
        image={heroImage}
      />

      <section
        className="bg-dark bg-cover bg-center py-16 lg:py-24"
        style={{
          backgroundImage:
            "linear-gradient(var(--dark-overlay), var(--dark-overlay)), url(/pages/contact/contact-form-bg.jpg)",
        }}
      >
        <div className="container grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <h2 className="max-w-2xl whitespace-pre-line font-heading text-[clamp(2.5rem,4vw+2rem,6rem)] leading-[1.05] font-normal tracking-[-2.16px] text-accent">
              {t("formTitle")}
            </h2>

            <div className="mt-16 flex flex-col gap-7.5">
              {(["whatsapp", "email", "phone", "location"] as const).map((key) => (
                <ContactInfoRow
                  key={key}
                  icon={methodIcons[key]}
                  label={t(`methods.${key}.label`)}
                  value={t(`methods.${key}.value`)}
                />
              ))}
            </div>

            <div className="mt-14">
              <p className="font-heading text-[16px] leading-6 text-white">{t("followUsOn")}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {socials.map(({ icon: Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-14 items-center justify-center rounded-full border border-accent text-accent hover:bg-accent hover:text-white"
                  >
                    <Icon className="size-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div id="contact-form" className="flex scroll-mt-24 justify-center lg:justify-end">
            <ContactFormCard />
          </div>
        </div>
      </section>
    </div>
  );
}
