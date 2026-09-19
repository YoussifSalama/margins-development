import { getPrivacyPage } from "@/server/public/pages";
import { toMetadata } from "@/server/public/seo";
import PageSeoScripts from "@/components/PageSeoScripts";
import RichText from "@/components/RichText";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy">) {
  return toMetadata((await getPrivacyPage((await params).locale)).seo);
}

// The policy the footer and the newsletter consent link to. One payload
// (GET /api/pages/privacy returns the same); written in the CMS under Pages → Privacy policy.
export default async function Privacy({ params }: PageProps<"/[locale]/privacy">) {
  const { seo, page } = await getPrivacyPage((await params).locale);

  return (
    <div className="bg-background px-6 pt-40 pb-24">
      <PageSeoScripts seo={seo} />
      <article className="container max-w-3xl">
        <h1 className="font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.1] text-dark">{page.title}</h1>
        <RichText html={page.bodyHtml} className="mt-10 text-foreground/80" />
      </article>
    </div>
  );
}
