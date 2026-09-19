import Faq, { type FaqItem } from "@/components/Faq";
import Gold from "@/components/Gold";

// the shared FAQ list (CMS → Content → FAQs) arrives with the page payload
export default function ProjectFaq({ heading, description, items }: { heading: string; description: string; items: FaqItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className="bg-background pb-24">
      <div className="container">
        <Faq heading={<Gold text={heading} />} description={description} items={items} />
      </div>
    </section>
  );
}
