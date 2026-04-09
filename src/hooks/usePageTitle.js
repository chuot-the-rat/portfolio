import { useEffect } from "react";

const BASE = "Leana Le";
const SITE_URL = "https://leanale.com";
const DEFAULT_DESCRIPTION =
    "Product designer with front-end chops. Case studies in UX, UI, and shipped code.";
const DEFAULT_IMAGE = `${SITE_URL}/starfruit.png`;

const ensureMeta = (selector, attr, value) => {
    let el = document.head.querySelector(selector);
    if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, value);
        document.head.appendChild(el);
    }
    return el;
};

const setMeta = (selector, attr, value, content) => {
    const el = ensureMeta(selector, attr, value);
    el.setAttribute("content", content);
};

const setCanonical = (href) => {
    let el = document.head.querySelector("link[rel='canonical']");
    if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", "canonical");
        document.head.appendChild(el);
    }
    el.setAttribute("href", href);
};

const setStructuredData = (structuredData) => {
    const id = "site-structured-data";
    const existing = document.getElementById(id);
    if (!structuredData) {
        if (existing) existing.remove();
        return;
    }

    const script = existing || document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    if (!existing) document.head.appendChild(script);
};

/**
 * Sets document.title for the current page.
 *
 * @param {string|null} pageTitle   - Page label. Pass null for home ("Leana Le · Designer").
 * @param {{
 *   site?: boolean,
 *   description?: string,
 *   path?: string,
 *   image?: string,
 *   noindex?: boolean,
 *   structuredData?: object|object[]
 * }} options
 */
export function usePageTitle(pageTitle, options = {}) {
    const {
        site = false,
        description = DEFAULT_DESCRIPTION,
        path,
        image = DEFAULT_IMAGE,
        noindex = false,
        structuredData = null,
    } = options;

    useEffect(() => {
        const fallbackPath =
            typeof window !== "undefined" ? window.location.pathname : "/";
        const normalizedPath = path || fallbackPath;
        const url = `${SITE_URL}${normalizedPath}`;

        if (!pageTitle) {
            document.title = `${BASE} · Designer`;
        } else if (site) {
            document.title = `${BASE} · ${pageTitle}`;
        } else {
            document.title = `${pageTitle} · ${BASE}`;
        }

        const finalTitle = document.title;
        setCanonical(url);
        setMeta("meta[name='description']", "name", "description", description);
        setMeta("meta[property='og:type']", "property", "og:type", "website");
        setMeta("meta[property='og:title']", "property", "og:title", finalTitle);
        setMeta("meta[property='og:description']", "property", "og:description", description);
        setMeta("meta[property='og:url']", "property", "og:url", url);
        setMeta("meta[property='og:image']", "property", "og:image", image);
        setMeta("meta[name='twitter:card']", "name", "twitter:card", "summary_large_image");
        setMeta("meta[name='twitter:title']", "name", "twitter:title", finalTitle);
        setMeta("meta[name='twitter:description']", "name", "twitter:description", description);
        setMeta("meta[name='twitter:image']", "name", "twitter:image", image);
        setMeta(
            "meta[name='robots']",
            "name",
            "robots",
            noindex ? "noindex, nofollow" : "index, follow",
        );
        setStructuredData(structuredData);

        return () => {
            document.title = `${BASE} · Designer`;
        };
    }, [description, image, noindex, pageTitle, path, site, structuredData]);
}
