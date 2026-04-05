/**
 * PassbookPrintCard.jsx
 * First-visit passbook introduction, shown in the home page hero area.
 *
 * Behaviour:
 * - On first visit (isNewlyIssued = true): animates in with a brief entrance,
 *   then settles. Card marks itself as "seen" after mount.
 * - On return visits: renders in its resting state immediately (no entrance).
 * - Clicking opens the passbook drawer.
 *
 * Rendered between HeroContainer and MarqueeTicker in Home.jsx.
 * Stays visible on the home page as the hero-level passbook touchpoint.
 */

import { useEffect } from "react";
import { motion } from "framer-motion";
import { usePassbook } from "./PassbookProvider";
import "./Passbook.css";

export default function PassbookPrintCard() {
    const {
        stampCount,
        totalRoutes,
        openDrawer,
        isNewlyIssued,
        clearNewlyIssued,
    } = usePassbook();

    // Clear the "newly issued" flag shortly after mounting
    // so the entrance animation doesn't replay on re-renders
    useEffect(() => {
        if (!isNewlyIssued) return;
        const t = setTimeout(clearNewlyIssued, 2000);
        return () => clearTimeout(t);
    }, [isNewlyIssued, clearNewlyIssued]);

    /* ── Animation ─────────────────────────────────────────────────── */
    // First visit: fade + slight rise
    // Return visit: appear instantly
    const cardVariants = isNewlyIssued
        ? {
              initial:  { opacity: 0, y: 16 },
              animate:  {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: 0.9, ease: [0.16, 1, 0.3, 1] },
              },
          }
        : {
              initial:  { opacity: 1, y: 0 },
              animate:  { opacity: 1, y: 0 },
          };

    const allDone = stampCount === totalRoutes;

    return (
        <motion.button
            className="pb-print-card"
            onClick={openDrawer}
            aria-label={`Project Passbook — ${stampCount} of ${totalRoutes} stamps collected. Open passbook.`}
            {...cardVariants}
        >
            {/* Left: compact mark */}
            <span className="pb-print-card__mark" aria-hidden="true">
                PP
            </span>

            {/* Text block */}
            <span className="pb-print-card__body">
                <span className="pb-print-card__eyebrow">
                    {isNewlyIssued ? "Issued" : "Project Passbook"}
                </span>
                <span className="pb-print-card__label">
                    {allDone
                        ? "All routes complete."
                        : "Collect stamps as you explore."}
                </span>
                <span className="pb-print-card__sub">
                    {stampCount} / {totalRoutes} routes stamped
                </span>
            </span>

            {/* Arrow */}
            <span className="pb-print-card__arrow" aria-hidden="true">
                →
            </span>
        </motion.button>
    );
}
