import rss from "@astrojs/rss";
import { render } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { getContainerRenderer } from "@astrojs/mdx/container-renderer";
import type { APIRoute } from "astro";
import { getSortedPosts } from "../lib/posts";
import { SITE } from "../lib/site";

/** Make root-relative links and images absolute for feed readers. */
function absolutizeHtml(html: string, site: URL): string {
    return html.replace(
        /(href|src)="\/(?!\/)/g,
        (_match, attribute: string) => `${attribute}="${site.origin}/`,
    );
}

export const GET: APIRoute = async (context) => {
    const site = context.site ?? new URL(SITE.url);
    const posts = await getSortedPosts();

    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });

    const items = await Promise.all(
        posts.map(async (post) => {
            const { Content } = await render(post);
            const html = await container.renderToString(Content);

            return {
                title: post.data.title,
                description: post.data.description ?? SITE.description,
                link: `/blog/${post.id}/`,
                pubDate: post.data.pubDate,
                categories: post.data.tags,
                content: absolutizeHtml(html, site),
            };
        }),
    );

    const lastBuildDate = posts[0]?.data.pubDate ?? new Date();

    return rss({
        title: `${SITE.name} – blog`,
        description: SITE.blogDescription,
        site,
        items,
        trailingSlash: true,
        customData: `
            <language>en-us</language>
            <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>
            <generator>Astro</generator>
            <ttl>60</ttl>
        `,
    });
};
