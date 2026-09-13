import { getTranslations } from "next-intl/server";
import Faq, { type FaqItem } from "@/components/Faq";

export default async function ProjectFaq({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "projects" });
  const items = t.raw("faq") as FaqItem[];

  return (
    <section className="bg-background pb-24">
      <div className="container">
        <Faq
          heading={t.rich("faqHeading", { gold: (chunks) => <span className="text-accent">{chunks}</span> })}
          description={t("faqDescription")}
          items={items}
        />
      </div>
    </section>
  );
}
