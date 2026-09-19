import JsonLd from "@/components/JsonLd";
import type { PageSeo } from "@/lib/content";

/** The structured data that came with the page payload. Title/description/canonical go through generateMetadata. */
export default function PageSeoScripts({ seo }: { seo: PageSeo }) {
  return <>{seo.jsonLd.map((data, index) => <JsonLd key={index} data={data} />)}</>;
}
