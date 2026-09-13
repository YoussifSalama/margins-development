import NewsEventCard from "@/components/NewsEventCard";
import type { Post } from "@/lib/posts";

function href(post: Post) {
  return `/${post.category === "Blogs" ? "blogs" : "news"}/${post.slug}`;
}

// featured + left mini stack the left column; the other two fill the right column
export default function NewsEventsSlide({ posts }: { posts: Post[] }) {
  const [featured, right1, right2, leftMini] = posts;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
      <div className="flex flex-col gap-8">
        {featured && (
          <NewsEventCard
            href={href(featured)}
            eyebrow={featured.category}
            title={featured.title}
            description={featured.excerpt}
            image={featured.image}
            variant="featured"
          />
        )}
        {leftMini && (
          <NewsEventCard
            href={href(leftMini)}
            eyebrow={leftMini.category}
            title={leftMini.title}
            description={leftMini.excerpt}
            image={leftMini.image}
            variant="horizontal-sm"
          />
        )}
      </div>

      <div className="flex flex-col gap-8 lg:justify-between">
        {[right1, right2].filter((post): post is Post => Boolean(post)).map((post) => (
          <NewsEventCard
            key={post.slug}
            href={href(post)}
            eyebrow={post.category}
            title={post.title}
            description={post.excerpt}
            image={post.image}
            variant="horizontal-lg"
          />
        ))}
      </div>
    </div>
  );
}
