import PageShell from "@/components/cms/page-shell";
import { listPartners } from "@/server/lists/queries";
import PartnersManager from "./partners-manager";

export const metadata = { title: "Partners" };

export default async function PartnersPage() {
  return (
    <PageShell tour="simpleList" eyebrow="Content" title="Partners" description="Shown in the partners marquee on Home and About, in this order.">
      <PartnersManager items={await listPartners()} />
    </PageShell>
  );
}
