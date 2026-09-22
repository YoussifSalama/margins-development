import Link from "next/link";
import PageShell, { SectionCard } from "@/components/cms/page-shell";
import { getChatSettings } from "@/server/chat/queries";
import ChatbotSettingsForm from "./chatbot-settings-form";

export const metadata = { title: "Chat assistant" };

export default async function ChatbotPage() {
  const settings = await getChatSettings();
  return (
    <PageShell eyebrow="Shared" title="Chat assistant" description="The website's chat widget (bottom-right of every page). It answers from the published FAQ list and general questions about Margins.">
      <SectionCard title="Assistant settings">
        <ChatbotSettingsForm {...settings} />
      </SectionCard>
      <SectionCard title="FAQs" hint="The questions and answers the assistant is allowed to answer from.">
        <Link href="/admin/content/faqs" className="text-sm font-medium underline underline-offset-4">
          Manage FAQs →
        </Link>
      </SectionCard>
    </PageShell>
  );
}
