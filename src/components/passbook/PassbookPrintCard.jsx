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
    // First visit (per session): physical "printing" emerge — card starts
    // collapsed flat at its top edge, then a spring drives it open like
    // a booklet being dispensed from a slot.
    // Return visit (same session): render instantly in resting state.
    const cardVariants = isNewlyIssued
        ? {
              initial: {
                  scaleY:  0.04,
                  scaleX:  0.92,
                  opacity: 0,
              },
              animate: {
                  scaleY:  1,
                  scaleX:  1,
                  opacity: 1,
                  transition: {
                      scaleY:  { type: "spring", stiffness: 190, damping: 16, mass: 0.7, delay: 0.7 },
                      scaleX:  { type: "spring", stiffness: 240, damping: 22, delay: 0.7 },
                      opacity: { duration: 0.08, delay: 0.7 },
                  },
              },
          }
        : {
              initial:  { opacity: 1, scaleY: 1, scaleX: 1 },
              animate:  { opacity: 1, scaleY: 1, scaleX: 1 },
          };

    const allDone = stampCount === totalRoutes;

    return (
        <motion.button
            className="pb-print-card"
            onClick={openDrawer}
            aria-label={`Project Passbook — ${stampCount} of ${totalRoutes} stamps collected. Open passbook.`}
            style={{ transformOrigin: "top center" }}
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
