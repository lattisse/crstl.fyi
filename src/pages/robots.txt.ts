import type { APIRoute } from "astro";
import { SITE } from "../lib/site";

export const GET: APIRoute = ({ site }) => {
    const siteURL = site ?? new URL(SITE.url);
    const sitemapURL = new URL("/sitemap-index.xml", siteURL);

    return new Response(
        `User-agent: *\nAllow: /\n\nSitemap: ${sitemapURL.href}\n`,
        {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
            },
        },
    );
};
