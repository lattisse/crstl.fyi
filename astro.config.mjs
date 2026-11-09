// @ts-check
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

const blogDir = fileURLToPath(new URL("./src/content/blog/", import.meta.url));
/** @type {Map<string, string>} */
const lastmods = new Map();

/**
 * Collect `updatedDate`/`pubDate` from each MDX post so the sitemap can emit
 * accurate `<lastmod>` values without importing `astro:content` in the config.
 * @param {string} dir
 */
function collectLastmods(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            collectLastmods(fullPath);
            continue;
        }

        if (!/\.mdx?$/.test(entry.name)) continue;

        const slug = path
            .relative(blogDir, fullPath)
            .replace(/\.mdx?$/, "")
            .split(path.sep)
            .join("/");
        const source = fs.readFileSync(fullPath, "utf8");
        const updated = source.match(
            /^updatedDate:\s*["']?([^"'\n]+)["']?/m,
        )?.[1];
        const published = source.match(
            /^pubDate:\s*["']?([^"'\n]+)["']?/m,
        )?.[1];
        const fallback = fs.statSync(fullPath).mtime;
        const date = new Date(updated ?? published ?? fallback);

        lastmods.set(
            `/blog/${slug}/`,
            (Number.isNaN(date.valueOf()) ? fallback : date).toISOString(),
        );
    }
}

collectLastmods(blogDir);

// https://astro.build/config
export default defineConfig({
    site: "https://crstl.fyi",
    // Astro 7 defaults to JSX-style whitespace stripping, which removes spaces
    // between text and inline elements. Keep the pre-v7 HTML-aware behavior.
    compressHTML: true,
    trailingSlash: "always",
    prefetch: {
        prefetchAll: true,
        defaultStrategy: "hover",
    },
    markdown: {
        shikiConfig: {
            theme: "github-dark",
        },
    },
    integrations: [
        mdx(),
        sitemap({
            namespaces: {
                news: false,
                xhtml: false,
                image: false,
                video: false,
            },
            serialize(item) {
                const pathname = new URL(item.url).pathname;
                const lastmod = lastmods.get(pathname);
                if (lastmod) item.lastmod = lastmod;
                return item;
            },
        }),
    ],
});
