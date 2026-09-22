import Faq, { type FaqItem } from "@/components/Faq";
import Gold from "@/components/Gold";
import Reveal from "@/components/Reveal";

// the shared FAQ list (CMS → Content → FAQs) arrives with the page payload
export default function ProjectFaq({ heading, description, items }: { heading: string; description: string; items: FaqItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className="bg-background pb-24">
      <div className="container">
        <Reveal amount={0.1}>
          <Faq heading={<Gold text={heading} />} description={description} items={items} />
        </Reveal>
      </div>
    </section>
  );
}
