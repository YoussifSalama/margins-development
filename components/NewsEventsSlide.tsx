import NewsEventCard from "@/components/NewsEventCard";
import { postHref as href, type PostCard as Post } from "@/lib/posts";


// featured + left mini stack the left column; the other two fill the right column
export default function NewsEventsSlide({ posts }: { posts: Post[] }) {
  const [featured, right1, right2, leftMini] = posts;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
      <div className="flex flex-col gap-8">
        {featured && (
          <NewsEventCard
            href={href(featured)}
            eyebrow={featured.categoryName}
            title={featured.title}
            description={featured.excerpt}
            image={featured.image}
            variant="featured"
          />
        )}
        {leftMini && (
          <NewsEventCard
            href={href(leftMini)}
            eyebrow={leftMini.categoryName}
            title={leftMini.title}
            description={leftMini.excerpt}
            image={leftMini.image}
            variant="horizontal-sm"
            reveal="center"
          />
        )}
      </div>

      <div className="flex flex-col gap-8 lg:justify-between">
        {[right1, right2].filter((post): post is Post => Boolean(post)).map((post) => (
          <NewsEventCard
            key={post.slug}
            href={href(post)}
            eyebrow={post.categoryName}
            title={post.title}
            description={post.excerpt}
            image={post.image}
            variant="horizontal-lg"
            reveal="center"
          />
        ))}
      </div>
    </div>
  );
}
