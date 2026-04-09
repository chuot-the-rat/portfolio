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
import { PASSBOOK_ROUTE_ORDER, PASSBOOK_ROUTES } from "../../data/passbook/passbookConfig";
import "./Passbook.css";

export default function PassbookPrintCard() {
    const {
        stampCount,
        totalRoutes,
        openDrawer,
        isStamped,
        isNewlyIssued,
        clearNewlyIssued,
        isParked,
        parkPassbook,
    } = usePassbook();

    const shouldAnimate = true;

    useEffect(() => {
        if (isNewlyIssued) {
            const t = setTimeout(clearNewlyIssued, 2400);
            return () => clearTimeout(t);
        }
    }, [isNewlyIssued, clearNewlyIssued]);

    const isPrimaryIssue = isNewlyIssued;
    const profile = isPrimaryIssue
        ? {
              delay: 0.5,
              feedDuration: 0.76,
              tearDuration: 0.4,
              contentDuration: 0.3,
              contentDelay: 0.45,
              tearDelay: 0.65,
          }
        : {
              delay: 0.05,
              feedDuration: 0.42,
              tearDuration: 0.28,
              contentDuration: 0.24,
              contentDelay: 0.18,
              tearDelay: 0.26,
          };

    const cardVariants = {
        initial: shouldAnimate
            ? { clipPath: "inset(0 0 100% 0)", opacity: 1 }
            : { clipPath: "inset(0 0 0% 0)", opacity: 1 },
        animate: {
            clipPath: "inset(0 0 0% 0)",
            opacity: 1,
            transition: {
                clipPath: {
                    duration: profile.feedDuration,
                    ease: [0.16, 1, 0.3, 1],
                    delay: profile.delay,
                },
            },
        },
    };

    const contentVariants = {
        initial: { opacity: shouldAnimate ? 0 : 1 },
        animate: {
            opacity: 1,
            transition: {
                duration: profile.contentDuration,
                delay: shouldAnimate ? profile.delay + profile.contentDelay : 0,
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
                    duration: profile.tearDuration,
                    ease: "easeOut",
                    delay: shouldAnimate ? profile.delay + profile.tearDelay : 0,
                },
                opacity: {
                    duration: 0.15,
                    delay: shouldAnimate ? profile.delay + profile.tearDelay : 0,
                },
            },
        },
    };

    const allDone = stampCount === totalRoutes;
    const handlePress = () => {
        if (!isParked) {
            parkPassbook();
            return;
        }
        openDrawer();
    };

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
                onClick={handlePress}
                aria-label={
                    isParked
                        ? `Project Passbook — ${stampCount} of ${totalRoutes} route seals logged. Open passbook.`
                        : "Printed pass ready. Press to add passbook."
                }
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
                            {isNewlyIssued ? "Issuance active" : "Printed pass"}
                        </span>
                        <span className="pb-print-card__label">
                            {!isParked
                                ? "Press to add passbook"
                                : allDone
                                  ? "All route seals logged."
                                  : "Press to open and log route seals."}
                        </span>
                        <span className="pb-print-card__sub">
                            {stampCount} / {totalRoutes} routes stamped
                        </span>
                        <span className="pb-print-card__slots" aria-hidden="true">
                            {PASSBOOK_ROUTE_ORDER.map((id) => {
                                const stamped = isStamped(id);
                                const route = PASSBOOK_ROUTES[id];
                                return (
                                    <span
                                        key={id}
                                        className={`pb-print-slot-dot${stamped ? " is-filled" : ""}`}
                                        style={{ "--pb-accent-hue": route?.accentHue ?? 240 }}
                                    />
                                );
                            })}
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
