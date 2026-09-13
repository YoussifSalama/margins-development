import Image from "next/image";
import { useTranslations } from "next-intl";
import { FiArrowLeft } from "react-icons/fi";
import type { Post } from "@/lib/posts";
import { Link } from "@/i18n/navigation";
import PostMetaGrid from "@/components/PostMetaGrid";
import ShareLinks from "@/components/ShareLinks";
import TableOfContents, { headingId } from "@/components/TableOfContents";
import PostGallery from "@/components/PostGallery";
import PostCard from "@/components/PostCard";

export default function PostDetailBody({
  post,
  related,
  base,
}: {
  post: Post;
  related: Post[];
  base: "news" | "blogs";
}) {
  const t = useTranslations("posts");

  return (
    <div>
      <section className="relative isolate flex min-h-95 items-end overflow-hidden px-6 pb-10 sm:min-h-107.5 sm:pb-12 lg:min-h-131.5 lg:pb-13.5">
        <Image src={post.image} alt="" fill sizes="100vw" priority className="-z-10 object-cover" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-hero-overlay-dark/70" />
        <div className="container flex flex-col items-center gap-6 text-center">
          <h1 className="max-w-3xl font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.1] text-white">
            {post.title}
          </h1>
          <Link
            href={`/${base}`}
            className="flex items-center gap-2 text-sm text-white/70 hover:text-accent rtl:flex-row-reverse"
          >
            <FiArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
            {base === "news" ? t("backToNews") : t("backToBlogs")}
          </Link>
        </div>
      </section>

      <div className="bg-background px-6 py-16">
        <div className="container grid grid-cols-1 gap-16 lg:grid-cols-[1fr_420px]">
          <div className="flex flex-col gap-10">
            {post.sections.map((section) => (
              <div key={section.heading} id={headingId(section.heading)} className="flex scroll-mt-24 flex-col gap-4">
                <h2 className="font-heading text-3xl text-dark">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-foreground/80">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}

            <PostGallery images={post.gallery} />
          </div>

          <aside className="flex flex-col gap-10">
            <PostMetaGrid
              items={[
                { label: t("meta.date"), value: post.date },
                { label: t("meta.category"), value: post.category },
                { label: t("meta.readingTime"), value: post.readingTime },
                { label: t("meta.author"), value: post.author },
              ]}
            />
            <ShareLinks label={t("shareTo")} title={post.title} copiedLabel={t("linkCopied")} />
            <TableOfContents
              title={t("tableOfContents")}
              headings={post.sections.map((section) => section.heading)}
            />
          </aside>
        </div>

        {related.length > 0 && (
          <div className="container mt-24">
            <h2 className="font-heading text-[40px] leading-[1.1] text-dark">
              {t.rich(base === "news" ? "relatedNews" : "relatedBlogs", {
                gold: (chunks) => <span className="text-accent">{chunks}</span>,
              })}
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-x-13.5 gap-y-16 lg:grid-cols-2">
              {related.map((relatedPost) => (
              <PostCard
                key={relatedPost.slug}
                slug={relatedPost.slug}
                category={relatedPost.category}
                title={relatedPost.title}
                date={relatedPost.date}
                image={relatedPost.image}
                base={base}
              />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
