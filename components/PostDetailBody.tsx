import Image from "next/image";
import { useTranslations } from "next-intl";
import { FiArrowLeft } from "react-icons/fi";
import { mediaHref, postHref, type Post, type PostCard as RelatedPost } from "@/lib/posts";
import Breadcrumb from "@/components/Breadcrumb";
import { Link } from "@/i18n/navigation";
import PostMetaGrid from "@/components/PostMetaGrid";
import ShareLinks from "@/components/ShareLinks";
import TableOfContents from "@/components/TableOfContents";
import RichText from "@/components/RichText";
import PostGallery from "@/components/PostGallery";
import PostCard from "@/components/PostCard";
import * as motion from "motion/react-client";
import Reveal from "@/components/Reveal";
import StaggerReveal from "@/components/StaggerReveal";
import { fadeUpBounce } from "@/lib/motion";

export default function PostDetailBody({
  post,
  related,
}: {
  post: Post;
  related: RelatedPost[];
}) {
  const t = useTranslations("posts");

  return (
    <div>
      <section className="relative isolate flex min-h-95 items-end overflow-hidden px-6 pt-28 pb-10 sm:min-h-107.5 sm:pt-32 sm:pb-12 lg:min-h-131.5 lg:pb-13.5">
        <Image
          src={post.image}
          alt=""
          fill
          sizes="100vw"
          priority
          className="-z-10 object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-hero-overlay-dark/70"
        />
        <StaggerReveal className="container flex flex-col items-center gap-6 text-center">
          <motion.h1
            variants={fadeUpBounce}
            className="max-w-3xl font-heading text-[clamp(2rem,4vw+1rem,3.5rem)] leading-[1.1] text-white"
          >
            {post.title}
          </motion.h1>
          <motion.div variants={fadeUpBounce} className="text-white">
            <Breadcrumb
              items={[
                { label: t("heroTitle"), href: mediaHref() },
                // the title is the <h1> right above — repeating it here only wraps onto three lines on a
                // phone. The full trail (incl. the title) is still in the BreadcrumbList structured data.
                { label: post.categoryName },
              ]}
            />
          </motion.div>
          <motion.div variants={fadeUpBounce}>
            <Link
              href={mediaHref(post.category)}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-accent rtl:flex-row-reverse"
            >
              <FiArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
              {t("backToCategory", { category: post.categoryName })}
            </Link>
          </motion.div>
        </StaggerReveal>
      </section>

      <div className="bg-background px-6 py-16">
        <div className="container grid grid-cols-1 gap-16 lg:grid-cols-[1fr_420px]">
          <div className="flex flex-col gap-10">
            {/* the article body is CMS rich text; its <h2>s carry the ids the table of contents links to */}
            <Reveal amount={0.05}>
              <RichText html={post.bodyHtml} className="text-foreground/80" />
            </Reveal>

            <Reveal amount={0.1}>
              <PostGallery images={post.gallery} />
            </Reveal>
          </div>

          <aside className="flex flex-col gap-10">
            <Reveal>
              <PostMetaGrid
                items={[
                  { label: t("meta.date"), value: post.date },
                  { label: t("meta.category"), value: post.categoryName },
                  { label: t("meta.readingTime"), value: post.readingTime },
                  { label: t("meta.author"), value: post.author },
                ]}
              />
            </Reveal>
            <Reveal delay={0.12}>
              <ShareLinks
                label={t("shareTo")}
                title={post.title}
                copiedLabel={t("linkCopied")}
              />
            </Reveal>
            <Reveal delay={0.24}>
              <TableOfContents
                title={t("tableOfContents")}
                headings={post.headings}
              />
            </Reveal>
          </aside>
        </div>

        {related.length > 0 && (
          <div className="container mt-24">
            <Reveal>
              <h2 className="font-heading text-[40px] leading-[1.1] text-dark">
                {t.rich("related", {
                  gold: (chunks) => (
                    <span className="text-accent">{chunks}</span>
                  ),
                })}
              </h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-x-13.5 gap-y-16 lg:grid-cols-2">
              {related.map((relatedPost, i) => (
                <Reveal key={relatedPost.slug} delay={i * 0.12}>
                  <PostCard
                    href={postHref(relatedPost)}
                    category={relatedPost.categoryName}
                    title={relatedPost.title}
                    date={relatedPost.date}
                    image={relatedPost.image}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
