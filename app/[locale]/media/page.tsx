import { toMetadata } from "@/server/public/seo";
import MediaListing, { loadMedia } from "./listing";

export async function generateMetadata({ params, searchParams }: PageProps<"/[locale]/media">) {
  const payload = await loadMedia((await params).locale, await searchParams);
  return payload ? toMetadata(payload.seo) : {};
}

export default async function MediaCenter({ params, searchParams }: PageProps<"/[locale]/media">) {
  return <MediaListing locale={(await params).locale} query={await searchParams} />;
}
