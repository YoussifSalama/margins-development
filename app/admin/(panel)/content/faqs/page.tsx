import PageShell from "@/components/cms/page-shell";
import { listFaqs } from "@/server/lists/queries";
import FaqsManager from "./faqs-manager";

export const metadata = { title: "FAQs" };

export default async function FaqsPage() {
  return (
    <PageShell
      tour="simpleList"
      eyebrow="Content"
      title="FAQs"
      description="One shared list. Every page that shows FAQs (Home, project pages) reads from here, in this order."
    >
      <FaqsManager items={await listFaqs()} />
    </PageShell>
  );
}
