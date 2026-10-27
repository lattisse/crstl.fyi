// @ts-check
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://crstl.fyi",
  // Astro 7 defaults to JSX-style whitespace stripping, which removes spaces
  // between text and inline elements. Keep the pre-v7 HTML-aware behavior.
  compressHTML: true,
  integrations: [mdx(), sitemap()],
});
