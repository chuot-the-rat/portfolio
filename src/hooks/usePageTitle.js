import { useEffect } from "react";

const BASE = "Leana Le";

/**
 * Sets document.title for the current page.
 *
 * @param {string|null} pageTitle   - Page label. Pass null for home ("Leana Le · Designer").
 * @param {{ site?: boolean }}       - site: true → "Leana Le · {pageTitle}" (brand-first for
 *                                     core site pages like About). Default is content-first:
 *                                     "{pageTitle} · Leana Le" (used for project detail pages).
 */
export function usePageTitle(pageTitle, { site = false } = {}) {
    useEffect(() => {
        if (!pageTitle) {
            document.title = `${BASE} · Designer`;
        } else if (site) {
            document.title = `${BASE} · ${pageTitle}`;
        } else {
            document.title = `${pageTitle} · ${BASE}`;
        }
        return () => {
            document.title = `${BASE} · Designer`;
        };
    }, [pageTitle, site]);
}
