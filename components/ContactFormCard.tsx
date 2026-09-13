import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import FormField from "@/components/FormField";

// ponytail: placeholder list until the real unit types are given
const unitTypes = ["Studio", "Apartment", "Duplex", "Villa", "Penthouse"];

export default function ContactFormCard() {
  const t = useTranslations("contact");

  return (
    <div className="relative w-full max-w-[636px] overflow-hidden rounded-3xl bg-dark px-6 pt-10 pb-14 shadow-[0px_3px_3px_0px_rgba(0,0,0,0.1),0px_7.77px_16px_0px_rgba(0,0,0,0.06)] sm:px-10 sm:pt-12 sm:pb-20 lg:px-14 lg:pt-14 lg:pb-37">
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0px_4px_0px_0px_rgba(58,54,54,0.6),inset_0px_-8px_0px_0px_rgba(0,0,0,0.05)]" />

      <h3 className="font-heading text-[36px] leading-[48px] tracking-[-0.36px] text-accent">
        {t("formCardTitle")}
      </h3>

      <form className="mt-10 flex flex-col gap-6">
        <FormField label={t("nameLabel")} placeholder={t("namePlaceholder")} type="text" />
        <FormField label={t("emailLabel2")} placeholder={t("emailPlaceholder2")} type="email" />
        <FormField label={t("phoneLabel")} placeholder={t("phonePlaceholder")} type="tel" />
        <FormField as="select" label={t("unitLabel")} placeholder={t("unitPlaceholder")} options={unitTypes} />
        <FormField as="textarea" label={t("messageLabel")} placeholder={t("messagePlaceholder")} />

        <Button as="button" type="submit" variant="solid" className="mt-4 self-start !text-[#271b16]">
          {t("submit")}
        </Button>
      </form>
    </div>
  );
}
