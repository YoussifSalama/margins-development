import type { PostCard } from "@/lib/content";

export type { Post, PostCard, PostCategory } from "@/lib/content";

/** Canonical URL of a post: /media/<category>/<slug>. One place, so links can't drift. */
export const postHref = (post: Pick<PostCard, "category" | "slug">) => `/media/${post.category}/${post.slug}`;

/** Canonical URL of a listing: /media or /media/<category>. */
export const mediaHref = (category?: string) => (category ? `/media/${category}` : "/media");
