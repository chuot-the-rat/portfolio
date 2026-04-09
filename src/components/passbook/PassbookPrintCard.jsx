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

import { useEffect, useRef, useState } from "react";
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

    const [shouldAnimate, setShouldAnimate] = useState(false);
    const hasMounted = useRef(false);

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            setShouldAnimate(true);
        }
        if (isNewlyIssued) {
            const t = setTimeout(clearNewlyIssued, 2400);
            return () => clearTimeout(t);
        }
    }, [isNewlyIssued, clearNewlyIssued]);

    const CARD_DELAY = 0.55;

    const cardVariants = {
        initial: shouldAnimate
            ? { clipPath: "inset(0 0 100% 0)", opacity: 1 }
            : { clipPath: "inset(0 0 0% 0)", opacity: 1 },
        animate: {
            clipPath: "inset(0 0 0% 0)",
            opacity: 1,
            transition: {
                clipPath: {
                    duration: 0.72,
                    ease: [0.16, 1, 0.3, 1],
                    delay: CARD_DELAY,
                },
            },
        },
    };

    const contentVariants = {
        initial: { opacity: shouldAnimate ? 0 : 1 },
        animate: {
            opacity: 1,
            transition: {
                duration: 0.3,
                delay: shouldAnimate ? CARD_DELAY + 0.45 : 0,
            },
        },
    };

    const tearVariants = {
        initial: {
            scaleX: shouldAnimate ? 0 : 1,
            opacity: shouldAnimate ? 0 : 1,
        },
        animate: {
            scaleX: 1,
            opacity: 1,
            transition: {
                scaleX: {
                    duration: 0.4,
                    ease: "easeOut",
                    delay: shouldAnimate ? CARD_DELAY + 0.65 : 0,
                },
                opacity: {
                    duration: 0.15,
                    delay: shouldAnimate ? CARD_DELAY + 0.65 : 0,
                },
            },
        },
    };

    const allDone = stampCount === totalRoutes;

    return (
        <div className="pb-print-wrapper">
            <div className="pb-print-slot" aria-hidden="true">
                <span className="pb-print-slot__feed" />
            </div>
            <motion.div
                className="pb-print-tear"
                aria-hidden="true"
                initial={tearVariants.initial}
                animate={tearVariants.animate}
                style={{ transformOrigin: "left center" }}
            />
            <motion.button
                className="pb-print-card"
                onClick={openDrawer}
                aria-label={`Project Passbook — ${stampCount} of ${totalRoutes} stamps collected. Open passbook.`}
                initial={cardVariants.initial}
                animate={cardVariants.animate}
            >
                <motion.span
                    className="pb-print-card__inner"
                    initial={contentVariants.initial}
                    animate={contentVariants.animate}
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
                </motion.span>
            </motion.button>
        </div>
    );
}
