# crstl.fyi

Personal site of Crystal — programming, homelabbing, Linux, physics, rockets, and space.

Built with [Astro](https://astro.build), MDX, and the official RSS and sitemap integrations.

## Commands

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Start the dev server at `localhost:4321`    |
| `npm run build`   | Build the production site to `./dist/`      |
| `npm run preview` | Preview the production build locally        |
| `npm run check`   | Run Astro's type and content checks         |
| `npm run astro`   | Run the Astro CLI                           |

## Project structure

```text
/
├── public/
│   ├── fonts/                 # Atkinson font files
│   ├── _headers               # Cloudflare caching/security headers
│   ├── _redirects             # /feed, /feed.xml, /sitemap.xml aliases
│   ├── favicon*.png           # Icon variants
│   ├── apple-touch-icon.png
│   ├── favicon.ico
│   ├── og.png                 # Default social preview image
│   └── site.webmanifest
├── src/
│   ├── assets/icons/          # Inline SVG icons
│   ├── components/            # Head, nav, post list, TOC, footer, etc.
│   ├── content/blog/          # MDX posts
│   ├── layouts/Layout.astro   # Page shell
│   ├── lib/                   # Site constants, post helpers, JSON-LD
│   ├── pages/                 # Routes, RSS, robots.txt
│   └── styles/global.css
├── astro.config.mjs
└── package.json
```

## Writing a post

Add an `.mdx` file to `src/content/blog/`. The filename becomes the URL slug:

`src/content/blog/my-post.mdx` → `/blog/my-post/`

Frontmatter:

```yaml
---
title: "My post"
description: "A short summary used for SEO, Open Graph, and RSS."
pubDate: "2026-01-01"
updatedDate: "2026-01-02" # optional
tags: ["linux", "astro"] # optional
---
```

The RSS feed includes the full rendered MDX content, not just the summary.

## Generated endpoints

- `/rss.xml` — full-content RSS feed
- `/sitemap-index.xml` and `/sitemap-0.xml` — sitemap
- `/robots.txt` — crawler rules with the sitemap URL

## Deployment

The site is designed for Cloudflare Pages/Workers static hosting:

- `public/_headers` sets long-lived caching for hashed assets and fonts.
- `public/_redirects` aliases `/feed`, `/feed.xml`, and `/sitemap.xml`.
- Cloudflare's managed `robots.txt` is prepended to the generated file automatically.

Set the build command to `npm run build` and the output directory to `dist`.
