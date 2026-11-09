import { getCollection, type CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

/** All posts, newest first. */
export async function getSortedPosts(): Promise<BlogPost[]> {
    const posts = await getCollection("blog");
    return posts.sort(
        (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
    );
}

/** ISO date used in `<time datetime>` and visible metadata. */
export function formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
}

/** Rough reading time in minutes, rounded up, minimum 1. */
export function readingTime(body: string | undefined): number {
    if (!body) return 1;
    const words = body.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
}

/** Neighbours in a newest-first list. */
export function getAdjacentPosts(posts: BlogPost[], current: BlogPost) {
    const index = posts.findIndex((post) => post.id === current.id);
    return {
        newer: index > 0 ? posts[index - 1] : undefined,
        older:
            index >= 0 && index < posts.length - 1
                ? posts[index + 1]
                : undefined,
    };
}
