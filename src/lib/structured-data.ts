import { SITE } from "./site";
import type { BlogPost } from "./posts";

const PERSON_ID = `${SITE.url}/#person`;
const WEBSITE_ID = `${SITE.url}/#website`;

function absolute(path: string): string {
    return new URL(path, SITE.url).href;
}

export function personSchema() {
    return {
        "@type": "Person",
        "@id": PERSON_ID,
        name: SITE.author,
        url: SITE.url,
        sameAs: [SITE.github, SITE.steam],
        description:
            "Crystal is a human interested in programming, homelabbing, linux, physics, rockets, and space.",
        knowsAbout: [
            "Programming",
            "Linux",
            "Homelabbing",
            "Physics",
            "Aerospace engineering",
        ],
    };
}

export function websiteSchema() {
    return {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE.url,
        name: SITE.name,
        description: SITE.description,
        inLanguage: "en",
        publisher: { "@id": PERSON_ID },
    };
}

export function blogSchema() {
    return {
        "@type": "Blog",
        "@id": `${SITE.url}/blog/#blog`,
        url: absolute("/blog/"),
        name: `${SITE.name} – blog`,
        description: SITE.blogDescription,
        inLanguage: "en",
        publisher: { "@id": PERSON_ID },
    };
}

export function blogPostingSchema(post: BlogPost, url: string) {
    const modified = post.data.updatedDate ?? post.data.pubDate;

    return {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.data.title,
        description: post.data.description ?? SITE.description,
        datePublished: post.data.pubDate.toISOString(),
        dateModified: modified.toISOString(),
        author: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        image: absolute(SITE.ogImage),
        inLanguage: "en",
        ...(post.data.tags.length > 0 && {
            keywords: post.data.tags.join(", "),
        }),
    };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: absolute(item.url),
        })),
    };
}

export function aboutPageSchema() {
    return {
        "@type": "AboutPage",
        "@id": `${SITE.url}/about/#webpage`,
        url: absolute("/about/"),
        name: `about – ${SITE.name}`,
        description: SITE.aboutDescription,
        inLanguage: "en",
        mainEntity: { "@id": PERSON_ID },
    };
}

/** Wrap schema nodes in a single `@graph` document. */
export function jsonLdGraph(...nodes: Record<string, unknown>[]) {
    return {
        "@context": "https://schema.org",
        "@graph": nodes,
    };
}
