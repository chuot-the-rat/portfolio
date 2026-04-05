import { useEffect } from "react";

const BASE = "Leana Le";

/**
 * Sets document.title for the current page.
 * Pass null to use the base title only (Home page).
 *
 * @param {string|null} pageTitle
 */
export function usePageTitle(pageTitle) {
    useEffect(() => {
        document.title = pageTitle ? `${pageTitle} · ${BASE}` : `${BASE} · Designer`;
        return () => { document.title = BASE; };
    }, [pageTitle]);
}
